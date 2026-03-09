"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useStore } from "./store-provider"
import { createOrder } from "@/lib/actions/orders"
import {
  Loader2,
  ArrowLeft,
} from "lucide-react"

type DeliveryZone = {
  id: string
  name: string
  price: number
}

type CheckoutClientProps = {
  storeId: string
  storeSlug: string
  currency: string
  deliveryZones: DeliveryZone[]
  brandColor: string
}

type CheckoutFormData = {
  name: string
  phone: string
  deliveryAddress: string
  zoneId: string
}

type PaymentMethod = "mpesa" | "card"

type CheckoutFieldErrors = Partial<Record<keyof CheckoutFormData, string>>

// Per-store draft key lets shoppers resume checkout without cross-store conflicts.
function getCheckoutDraftStorageKey(storeSlug: string) {
  return `orderform_checkout_draft:${storeSlug}`
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "")
}

// Client-side validation mirrors server expectations for faster feedback.
function validateCheckout(formData: CheckoutFormData, requiresZone: boolean): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {}

  if (!formData.name.trim() || formData.name.trim().length < 2) {
    errors.name = "Please enter your full name."
  }

  const phoneDigits = normalizePhone(formData.phone)
  if (phoneDigits.length < 10 || phoneDigits.length > 12) {
    errors.phone = "Enter a valid phone number (e.g. 0712345678)."
  }

  if (!formData.deliveryAddress.trim() || formData.deliveryAddress.trim().length < 8) {
    errors.deliveryAddress = "Please provide a complete delivery location."
  }

  if (requiresZone && !formData.zoneId) {
    errors.zoneId = "Please select your delivery zone."
  }

  return errors
}

function getFieldClass(hasError: boolean): string {
  const base = "w-full rounded-none text-sm text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-0"

  if (hasError) {
    return `${base} border border-red-400 bg-transparent focus:border-red-500`
  }

  return `${base} border border-[#E8E8E5] bg-transparent focus:border-[#1A1A1A]`
}

export function CheckoutClient({ storeId, storeSlug, currency, deliveryZones, brandColor }: CheckoutClientProps) {
  const checkoutDraftStorageKey = useMemo(() => getCheckoutDraftStorageKey(storeSlug), [storeSlug])
  const { cart, cartTotal } = useStore()

  const [isLoading, setIsLoading] = useState(false)
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({})
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa")
  const [orderNotes, setOrderNotes] = useState("")
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [addressLineTwo, setAddressLineTwo] = useState("")
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    deliveryAddress: "",
    zoneId: "",
  })
  const paymentOptions: Array<{
    id: PaymentMethod
    label: string
    description: string
    imageSrc: string
    imageAlt: string
  }> = [
    {
      id: "mpesa",
      label: "M-PESA",
      description: "Pay with your phone number after placing the order.",
      imageSrc: "/images/mpesa.jpg",
      imageAlt: "M-PESA",
    },
    {
      id: "card",
      label: "Debit/Credit Cards",
      description: "Visa, Mastercard and more via secure card checkout.",
      imageSrc: "/images/paystack-ke.png",
      imageAlt: "Card payment options",
    },
  ]

  const selectedZone = useMemo(
    () => deliveryZones.find((zone) => zone.id === formData.zoneId),
    [deliveryZones, formData.zoneId]
  )
  const deliveryFee = selectedZone ? selectedZone.price : 0
  const grandTotal = cartTotal + deliveryFee
  const [firstNamePart = "", ...otherNameParts] = formData.name.trim().split(/\s+/)
  const lastNamePart = otherNameParts.join(" ")

  useEffect(() => {
    // Restore previous in-progress checkout details from localStorage.
    try {
      const rawDraft = localStorage.getItem(checkoutDraftStorageKey)
      if (!rawDraft) return

      const parsedDraft = JSON.parse(rawDraft) as Partial<CheckoutFormData>
      setFormData((previous) => ({
        name: typeof parsedDraft.name === "string" ? parsedDraft.name : previous.name,
        phone: typeof parsedDraft.phone === "string" ? parsedDraft.phone : previous.phone,
        deliveryAddress:
          typeof parsedDraft.deliveryAddress === "string"
            ? parsedDraft.deliveryAddress
            : previous.deliveryAddress,
        zoneId: typeof parsedDraft.zoneId === "string" ? parsedDraft.zoneId : previous.zoneId,
      }))
    } catch (error) {
      console.error("Failed to restore checkout draft", error)
    } finally {
      setHasHydratedDraft(true)
    }
  }, [checkoutDraftStorageKey])

  useEffect(() => {
    if (!hasHydratedDraft) return

    // Persist only non-empty drafts so old data does not linger indefinitely.
    const hasAnyDraftValue = Object.values(formData).some((value) => value.trim() !== "")

    try {
      if (!hasAnyDraftValue) {
        localStorage.removeItem(checkoutDraftStorageKey)
        return
      }

      localStorage.setItem(checkoutDraftStorageKey, JSON.stringify(formData))
    } catch (error) {
      console.error("Failed to save checkout draft", error)
    }
  }, [checkoutDraftStorageKey, formData, hasHydratedDraft])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const setFieldValue = (field: keyof CheckoutFormData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }))

    if (fieldErrors[field]) {
      setFieldErrors((previous) => {
        const next = { ...previous }
        delete next[field]
        return next
      })
    }
  }

  const submitOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    // Final totals and discount validation still happen server-side in `createOrder`.
    const errors = validateCheckout(formData, deliveryZones.length > 0)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields")
      return
    }

    setIsLoading(true)

    try {
      const orderResult = await createOrder({
        storeId,
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        deliveryAddress: formData.deliveryAddress.trim(),
        deliveryZone: selectedZone?.name,
        deliveryFee,
        notes: orderNotes.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant || undefined,
        })),
      })

      if (!orderResult?.success || !orderResult.id) {
        toast.error(orderResult?.error || "We could not place your order. Please try again.")
        return
      }

      const query = new URLSearchParams({
        method: paymentMethod,
        orderId: orderResult.id,
      })
      const targetUrl = `/${storeSlug}/checkout/payment?${query.toString()}`

      // Clear local draft once order is successfully created.
      localStorage.removeItem(checkoutDraftStorageKey)
      window.location.assign(targetUrl)
    } catch (error) {
      console.error(error)
      toast.error("We could not place your order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await submitOrder()
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-[#E8E8E5] py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-none">
          <span className="text-2xl text-[#1A1A1A]">🛒</span>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[#1A1A1A]">Your cart is empty</h2>
        <p className="mb-6 max-w-sm text-sm text-[#737373]">
          It looks like you haven&apos;t added any products to your cart yet.
        </p>
        <Link
          href={`/${storeSlug}`}
          className="inline-flex h-12 items-center gap-2 rounded-none px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          style={{ backgroundColor: "var(--store-brand, #1A1A1A)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-7" noValidate>
          <section className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <h2 className="text-[42px] font-medium tracking-tight text-[#1A1A1A]">Billing Details</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="first-name" className="text-[13px] font-medium text-[#1A1A1A]">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    value={firstNamePart}
                    onChange={(event) => {
                      const nextName = [event.target.value, lastNamePart].filter(Boolean).join(" ")
                      setFieldValue("name", nextName)
                    }}
                    className={`${getFieldClass(Boolean(fieldErrors.name))} h-11 px-3`}
                    aria-invalid={Boolean(fieldErrors.name)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="last-name" className="text-[13px] font-medium text-[#1A1A1A]">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastNamePart}
                    onChange={(event) => {
                      const nextName = [firstNamePart, event.target.value].filter(Boolean).join(" ")
                      setFieldValue("name", nextName)
                    }}
                    className={`${getFieldClass(Boolean(fieldErrors.name))} h-11 px-3`}
                    aria-invalid={Boolean(fieldErrors.name)}
                  />
                </div>
              </div>

              {fieldErrors.name ? (
                <p id="checkout-name-error" className="text-xs text-red-600" role="alert">
                  {fieldErrors.name}
                </p>
              ) : null}

              <div className="space-y-1.5">
                <p className="text-[13px] font-medium text-[#1A1A1A]">
                  Country / Region <span className="text-red-500">*</span>
                </p>
                <p className="text-[30px] font-semibold leading-none tracking-tight text-[#1A1A1A]">Kenya</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="deliveryAddress" className="text-[13px] font-medium text-[#1A1A1A]">
                  Street address <span className="text-red-500">*</span>
                </label>
                <input
                  id="deliveryAddress"
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(event) => setFieldValue("deliveryAddress", event.target.value)}
                  placeholder="House number and street name"
                  className={`${getFieldClass(Boolean(fieldErrors.deliveryAddress))} h-11 px-3`}
                  aria-invalid={Boolean(fieldErrors.deliveryAddress)}
                  aria-describedby={fieldErrors.deliveryAddress ? "checkout-address-error" : undefined}
                />
                <input
                  id="deliveryAddress-2"
                  type="text"
                  value={addressLineTwo}
                  onChange={(event) => setAddressLineTwo(event.target.value)}
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  className="h-11 w-full rounded-none border border-[#E8E8E5] bg-transparent px-3 text-sm text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                />
                {fieldErrors.deliveryAddress ? (
                  <p id="checkout-address-error" className="text-xs text-red-600" role="alert">
                    {fieldErrors.deliveryAddress}
                  </p>
                ) : null}
              </div>

              {deliveryZones.length > 0 ? (
                <div className="space-y-1.5">
                  <label htmlFor="zone" className="text-[13px] font-medium text-[#1A1A1A]">
                    Town / City <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="zone"
                    value={formData.zoneId}
                    onChange={(event) => setFieldValue("zoneId", event.target.value)}
                    className={`${getFieldClass(Boolean(fieldErrors.zoneId))} h-11 px-3`}
                    aria-invalid={Boolean(fieldErrors.zoneId)}
                    aria-describedby={fieldErrors.zoneId ? "checkout-zone-error" : undefined}
                  >
                    <option value="">Select city</option>
                    {deliveryZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} — {formatPrice(zone.price)}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.zoneId ? (
                    <p id="checkout-zone-error" className="text-xs text-red-600" role="alert">
                      {fieldErrors.zoneId}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-[13px] font-medium text-[#1A1A1A]">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFieldValue("phone", event.target.value)}
                  placeholder="+254 712345678"
                  className={`${getFieldClass(Boolean(fieldErrors.phone))} h-11 px-3`}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? "checkout-phone-error" : undefined}
                />
                {fieldErrors.phone ? (
                  <p id="checkout-phone-error" className="text-xs text-red-600" role="alert">
                    {fieldErrors.phone}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email-address" className="text-[13px] font-medium text-[#1A1A1A]">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email-address"
                  type="email"
                  value={emailAddress}
                  onChange={(event) => setEmailAddress(event.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-none border border-[#E8E8E5] bg-transparent px-3 text-sm text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  id="ship-different-address"
                  type="checkbox"
                  checked={shipToDifferentAddress}
                  onChange={(event) => setShipToDifferentAddress(event.target.checked)}
                  className="h-4 w-4 rounded-none border-[#BEBEB8] text-[#1A1A1A] focus:ring-[#1A1A1A]"
                />
                <label htmlFor="ship-different-address" className="text-[19px] font-semibold text-[#1A1A1A]">
                  Ship To A Different Address?
                </label>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="order-notes" className="text-[13px] font-medium text-[#1A1A1A]">
                  Order notes (optional)
                </label>
                <textarea
                  id="order-notes"
                  rows={6}
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className="w-full resize-y rounded-none border border-[#D7D7D2] bg-transparent p-3 text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                />
              </div>
            </div>
          </section>
        </form>
      </div>

      <div className="lg:col-span-5">
        <div className="border border-[#DADAD5]">
          <div className="border-b border-[#DADAD5] px-6 py-5">
            <h2 className="text-[36px] font-semibold tracking-tight text-[#1A1A1A]">Your Order</h2>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-[#E2E2DD] pb-3 text-[13px] font-semibold text-[#4E4E49]">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            <div className="divide-y divide-[#E8E8E5]">
              {cart.map((item) => (
                <div key={`checkout-item-${item.productId}-${item.variant || "default"}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-4 text-sm">
                  <p className="min-w-0 text-[#4A4A45]">
                    <span className="line-clamp-1">{item.name}</span>
                    <span className="text-xs text-[#70706A]"> × {item.quantity}</span>
                  </p>
                  <span className="font-semibold text-[#1A1A1A]">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-0 border-t border-[#DADAD5]">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] py-4 text-[29px] font-semibold text-[#1A1A1A]">
                <span className="text-[17px]">Subtotal</span>
                <span className="text-[17px]">{formatPrice(cartTotal)}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] border-t border-[#E8E8E5] py-4 text-[15px] text-[#4E4E49]">
                <span className="font-semibold">Shipment</span>
                <span className="font-semibold">{selectedZone ? selectedZone.name : "Custom Rate"}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] border-t border-[#DADAD5] py-4">
                <span className="text-xl font-semibold text-[#1A1A1A]">Total</span>
                <span className="text-xl font-semibold text-[#1A1A1A]" style={{ color: brandColor || "#1A1A1A" }}>
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#DADAD5] px-6 py-5">
            <div className="space-y-5">
              {paymentOptions.map((option) => {
                const isActive = paymentMethod === option.id
                return (
                  <label key={option.id} className="block cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        value={option.id}
                        checked={isActive}
                        onChange={() => setPaymentMethod(option.id)}
                        className="h-4 w-4 accent-[#1A1A1A]"
                      />
                      <p className="text-base leading-none font-medium text-[#1A1A1A]">{option.label}</p>
                      {option.id === "mpesa" ? (
                        <Image
                          src={option.imageSrc}
                          alt={option.imageAlt}
                          width={64}
                          height={24}
                          className="h-6 w-auto object-contain"
                        />
                      ) : null}
                    </div>
                    {isActive ? (
                      <div className="ml-7 mt-2 bg-[#DAD5E1] px-3 py-2 text-sm text-[#4B4B46]">
                        {option.id === "mpesa"
                          ? "Place order and pay using M-PESA."
                          : "Proceed to secure card checkout after placing order."}
                      </div>
                    ) : null}

                    {option.id === "card" ? (
                      <div className="ml-7 mt-2 rounded border border-[#DDDDD8] bg-white px-3 py-3">
                        <div className="flex items-center justify-center">
                          <Image
                            src="/images/paystack-ke.png"
                            alt="Visa, Mastercard, Amex, M-PESA and Apple Pay"
                            width={520}
                            height={92}
                            className="h-auto w-full max-w-[520px] object-contain"
                          />
                        </div>
                      </div>
                    ) : null}
                  </label>
                )
              })}
            </div>
          </div>

          <div className="border-t border-[#DADAD5] px-6 py-6">
            <p className="max-w-[520px] text-[16px] leading-relaxed text-[#666661]">
              Your personal data will be used to process your order, support your experience and for other purposes described in our privacy policy.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={submitOrder}
                disabled={isLoading}
                className="inline-flex h-12 min-w-[170px] items-center justify-center border border-[#1A1A1A] bg-transparent px-6 text-xl font-medium text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
