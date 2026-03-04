"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useStore } from "./store-provider"
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Truck,
  Trash2,
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

type CheckoutFieldErrors = Partial<Record<keyof CheckoutFormData, string>>

type PlacedOrderState = {
  orderReference: string
  customerName: string
  total: number
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "")
}

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
  const base = "w-full rounded-sm text-sm text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-0"

  if (hasError) {
    return `${base} border border-red-400 bg-red-50 focus:border-red-500`
  }

  return `${base} border border-[#E8E8E5] bg-[#FAFAFA] focus:border-[#1A1A1A] focus:bg-white`
}

export function CheckoutClient({ storeId, storeSlug, currency, deliveryZones, brandColor }: CheckoutClientProps) {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useStore()

  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({})
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderState | null>(null)
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    deliveryAddress: "",
    zoneId: "",
  })

  const selectedZone = useMemo(
    () => deliveryZones.find((zone) => zone.id === formData.zoneId),
    [deliveryZones, formData.zoneId]
  )
  const deliveryFee = selectedZone ? selectedZone.price : 0
  const grandTotal = cartTotal + deliveryFee
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    const errors = validateCheckout(formData, deliveryZones.length > 0)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields")
      return
    }

    setIsLoading(true)

    try {
      // This remains mocked until checkout is wired to server actions.
      console.log("Submitting order...", { storeId, cart, formData, grandTotal })
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const mockReference = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

      setPlacedOrder({
        orderReference: mockReference,
        customerName: formData.name.trim(),
        total: grandTotal,
      })
      clearCart()
      toast.success("Order placed successfully")
    } catch (error) {
      console.error(error)
      toast.error("We could not place your order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (placedOrder) {
    return (
      <div className="py-8 md:py-10">
        <div className="mx-auto max-w-lg text-center">
          <div
            className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: brandColor || "#1A1A1A" }}
          >
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">Order Confirmed</h2>
          <p className="mt-2 text-sm text-[#6F6F69]">
            Thanks, {placedOrder.customerName}. Your order has been received and is being processed.
          </p>

          <div className="mt-6 text-left">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] py-2 text-sm">
              <span className="text-[#737373]">Order reference</span>
              <span className="font-semibold text-[#1A1A1A]">{placedOrder.orderReference}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-[#737373]">Total paid</span>
              <span className="font-semibold text-[#1A1A1A]">{formatPrice(placedOrder.total)}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-2 text-left">
            <TrustRow icon={Clock3} text="We usually confirm orders within a few minutes." />
            <TrustRow icon={Truck} text="Delivery timeline depends on your selected location." />
            <TrustRow icon={ShieldCheck} text="Your details are securely stored for order fulfillment." />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/${storeSlug}`}
              className="inline-flex h-11 items-center justify-center rounded-sm px-5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              style={{ backgroundColor: brandColor || "#1A1A1A" }}
            >
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={() => setPlacedOrder(null)}
              className="inline-flex h-11 items-center justify-center rounded-sm border border-[#DADAD5] px-5 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F5F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-[#E8E8E5] bg-white py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F7F5]">
          <span className="text-2xl text-[#1A1A1A]">🛒</span>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[#1A1A1A]">Your cart is empty</h2>
        <p className="mb-6 max-w-sm text-sm text-[#737373]">
          It looks like you haven&apos;t added any products to your cart yet.
        </p>
        <Link
          href={`/${storeSlug}`}
          className="inline-flex h-12 items-center gap-2 rounded-sm bg-[#1A1A1A] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7 rounded-sm border border-[#E8E8E5] bg-white p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#EFEFEA] pb-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">Contact & Delivery</h2>
            <p className="mt-1 text-sm text-[#737373]">Enter your details to confirm your order.</p>
          </div>
          <div className="rounded-full bg-[#F3F3F0] px-3 py-1 text-xs font-semibold text-[#5A5A55]" aria-live="polite">
            {cartCount} item{cartCount === 1 ? "" : "s"}
          </div>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6" noValidate>
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6A6A65]">Contact Information</h3>

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[13px] font-medium text-[#1A1A1A]">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(event) => setFieldValue("name", event.target.value)}
                placeholder="e.g. Jane Doe"
                className={`${getFieldClass(Boolean(fieldErrors.name))} h-12 px-4`}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "checkout-name-error" : undefined}
              />
              {fieldErrors.name ? (
                <p id="checkout-name-error" className="text-xs text-red-600" role="alert">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-[13px] font-medium text-[#1A1A1A]">
                Phone Number (M-PESA) <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(event) => setFieldValue("phone", event.target.value)}
                placeholder="e.g. 0712345678"
                className={`${getFieldClass(Boolean(fieldErrors.phone))} h-12 px-4`}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? "checkout-phone-error" : undefined}
              />
              {fieldErrors.phone ? (
                <p id="checkout-phone-error" className="text-xs text-red-600" role="alert">
                  {fieldErrors.phone}
                </p>
              ) : (
                <p className="text-[11px] text-[#85857E]">We use this number for order confirmation and payment prompts.</p>
              )}
            </div>
          </section>

          <section className="space-y-4 border-t border-[#EFEFEA] pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6A6A65]">Delivery Details</h3>

            <div className="space-y-1.5">
              <label htmlFor="deliveryAddress" className="text-[13px] font-medium text-[#1A1A1A]">
                Delivery Address / Location <span className="text-red-500">*</span>
              </label>
              <textarea
                id="deliveryAddress"
                rows={4}
                value={formData.deliveryAddress}
                onChange={(event) => setFieldValue("deliveryAddress", event.target.value)}
                placeholder="Enter building, street, landmarks, or detailed directions"
                className={`${getFieldClass(Boolean(fieldErrors.deliveryAddress))} resize-y p-4`}
                aria-invalid={Boolean(fieldErrors.deliveryAddress)}
                aria-describedby={fieldErrors.deliveryAddress ? "checkout-address-error" : undefined}
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
                  Delivery Zone <span className="text-red-500">*</span>
                </label>
                <select
                  id="zone"
                  value={formData.zoneId}
                  onChange={(event) => setFieldValue("zoneId", event.target.value)}
                  className={`${getFieldClass(Boolean(fieldErrors.zoneId))} h-12 px-4`}
                  aria-invalid={Boolean(fieldErrors.zoneId)}
                  aria-describedby={fieldErrors.zoneId ? "checkout-zone-error" : undefined}
                >
                  <option value="">Select a delivery area</option>
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
          </section>
        </form>
      </div>

      <div className="flex flex-col gap-5 lg:col-span-5">
        <div className="rounded-sm border border-[#E8E8E5] bg-white p-6 md:p-8">
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-[#1A1A1A]">Order Summary</h2>

          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.variant}`} className="rounded-sm border border-[#ECECE7] bg-[#FAFAF8] p-3">
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-[#E8E8E5] bg-[#EEECEA]">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold leading-tight text-[#1A1A1A]">{item.name}</p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.variant)}
                        aria-label={`Remove ${item.name} from order`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-[#7A7A73] transition-colors hover:bg-[#F0F0EC] hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {item.variant ? <p className="mt-1 line-clamp-1 text-[12px] text-[#737373]">{item.variant}</p> : null}

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-sm border border-[#E2E2DD] bg-white px-1 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#737373] hover:bg-[#F6F6F3] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                        >
                          -
                        </button>
                        <span className="min-w-[18px] text-center text-[13px] font-semibold text-[#1A1A1A]" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#737373] hover:bg-[#F6F6F3] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-bold text-[#1A1A1A]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-[#E8E8E5] pt-4 text-[15px]">
            <div className="flex items-center justify-between text-[#737373]">
              <span>Subtotal</span>
              <span className="font-medium text-[#1A1A1A]">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[#737373]">
              <span>Delivery</span>
              <span className="font-medium text-[#1A1A1A]">
                {deliveryFee > 0 ? formatPrice(deliveryFee) : "Select a zone"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-[#E8E8E5] pt-3">
              <span className="font-semibold text-[#1A1A1A]">Total</span>
              <span className="text-lg font-bold" style={{ color: brandColor || "#1A1A1A" }}>
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <button
            form="checkout-form"
            type="submit"
            disabled={isLoading}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-sm text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            style={{ backgroundColor: brandColor || "#1A1A1A" }}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Processing..." : "Place Order"}
          </button>

          <p className="mt-3 text-center text-[11px] text-[#85857E]">
            By placing this order, you agree to share the details required for delivery and confirmation.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 gap-2 rounded-sm border border-[#E8E8E5] bg-white p-4 sm:grid-cols-3">
          <TrustRow icon={Clock3} text="Quick confirmation" />
          <TrustRow icon={Truck} text="Reliable delivery" />
          <TrustRow icon={ShieldCheck} text="Secure checkout" />
        </div> */}
      </div>
    </div>
  )
}

function TrustRow({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  text: string
}) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon className="h-4 w-4 text-[#1A1A1A]" />
      <p className="text-xs font-medium text-[#555550]">{text}</p>
    </div>
  )
}
