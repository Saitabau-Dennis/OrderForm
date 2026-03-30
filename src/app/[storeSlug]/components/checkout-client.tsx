"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useStore } from "./store-provider"
import { createOrder } from "@/lib/actions/orders"
import { storefrontPath } from "@/lib/storefront-path"
import { getQuickCheckoutStorageKey, parseQuickCheckoutPayload } from "./quick-checkout-storage"
import { ArrowLeft } from "lucide-react"
import { CheckoutBillingSection } from "./checkout-billing-section"
import { CheckoutShippingSection } from "./checkout-shipping-section"
import { CheckoutOrderSummary } from "./checkout-order-summary"
import {
  formatCheckoutPrice,
  getFieldClass,
  validateCheckout,
} from "./checkout-validation"
import type {
  CheckoutClientProps,
  CheckoutFieldErrors,
  CheckoutFormData,
  PaymentMethod,
} from "./checkout-form-types"

// Per-store draft key lets shoppers resume checkout without cross-store conflicts.
function getCheckoutDraftStorageKey(storeSlug: string) {
  return `orderform_checkout_draft:${storeSlug}`
}


export function CheckoutClient({
  storeId,
  storeSlug,
  currency,
  deliveryZones,
  brandColor,
  enableDelivery,
  enableShopPickup,
  shopPickupInstructions,
}: CheckoutClientProps) {
  const searchParams = useSearchParams()
  const isQuickCheckoutRequested = searchParams.get("quick") === "1"
  const checkoutDraftStorageKey = useMemo(() => getCheckoutDraftStorageKey(storeSlug), [storeSlug])
  const quickCheckoutStorageKey = useMemo(() => getQuickCheckoutStorageKey(storeSlug), [storeSlug])
  const { cart } = useStore()
  const [quickCheckoutItem, setQuickCheckoutItem] = useState<ReturnType<typeof parseQuickCheckoutPayload>>(null)
  const [hasHydratedQuickCheckout, setHasHydratedQuickCheckout] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({})
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa")
  const [orderNotes, setOrderNotes] = useState("")
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [billingAddressLineTwo, setBillingAddressLineTwo] = useState("")
  const [shippingRecipientName, setShippingRecipientName] = useState("")
  const [shippingRecipientPhone, setShippingRecipientPhone] = useState("")
  const [shippingAddressLine1, setShippingAddressLine1] = useState("")
  const [shippingAddressLine2, setShippingAddressLine2] = useState("")
  const [shippingZoneId, setShippingZoneId] = useState("")
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    deliveryMethod: enableDelivery ? "delivery" : "shop_pickup",
    deliveryAddress: "",
    zoneId: "",
  })

  const hasAnyShippingMethod = enableDelivery || enableShopPickup
  const checkoutItems = useMemo(() => {
    if (!isQuickCheckoutRequested) return cart
    if (!hasHydratedQuickCheckout) return []
    return quickCheckoutItem ? [quickCheckoutItem] : []
  }, [cart, hasHydratedQuickCheckout, isQuickCheckoutRequested, quickCheckoutItem])
  const checkoutSubtotal = useMemo(
    () => checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0),
    [checkoutItems]
  )
  const effectiveZoneId =
    formData.deliveryMethod !== "delivery"
      ? ""
      : shipToDifferentAddress
      ? shippingZoneId
      : formData.zoneId
  const selectedZone = useMemo(() => {
    if (formData.deliveryMethod !== "delivery") return undefined
    return deliveryZones.find((zone) => zone.id === effectiveZoneId)
  }, [deliveryZones, effectiveZoneId, formData.deliveryMethod])
  const deliveryFee = formData.deliveryMethod === "delivery" && selectedZone ? selectedZone.price : 0
  const grandTotal = checkoutSubtotal + deliveryFee
  const [firstNamePart = "", ...otherNameParts] = formData.name.trim().split(/\s+/)
  const lastNamePart = otherNameParts.join(" ")

  useEffect(() => {
    setHasHydratedQuickCheckout(false)

    if (!isQuickCheckoutRequested) {
      setQuickCheckoutItem(null)
      setHasHydratedQuickCheckout(true)
      return
    }

    try {
      const rawQuickPayload = localStorage.getItem(quickCheckoutStorageKey)
      setQuickCheckoutItem(parseQuickCheckoutPayload(rawQuickPayload, storeSlug))
    } catch (error) {
      console.error("Failed to restore quick checkout payload", error)
      setQuickCheckoutItem(null)
    } finally {
      setHasHydratedQuickCheckout(true)
    }
  }, [isQuickCheckoutRequested, quickCheckoutStorageKey, storeSlug])

  useEffect(() => {
    // Restore previous in-progress checkout details from localStorage.
    try {
      const rawDraft = localStorage.getItem(checkoutDraftStorageKey)
      if (!rawDraft) return

      const parsedDraft = JSON.parse(rawDraft) as Partial<CheckoutFormData> & {
        shipToDifferentAddress?: boolean
        billingAddressLineTwo?: string
        shippingRecipientName?: string
        shippingRecipientPhone?: string
        shippingAddressLine1?: string
        shippingAddressLine2?: string
        shippingZoneId?: string
        orderNotes?: string
        emailAddress?: string
      }
      setFormData((previous) => ({
        name: typeof parsedDraft.name === "string" ? parsedDraft.name : previous.name,
        phone: typeof parsedDraft.phone === "string" ? parsedDraft.phone : previous.phone,
        deliveryMethod:
          parsedDraft.deliveryMethod === "shop_pickup" || parsedDraft.deliveryMethod === "delivery"
            ? parsedDraft.deliveryMethod
            : previous.deliveryMethod,
        deliveryAddress:
          typeof parsedDraft.deliveryAddress === "string"
            ? parsedDraft.deliveryAddress
            : previous.deliveryAddress,
        zoneId: typeof parsedDraft.zoneId === "string" ? parsedDraft.zoneId : previous.zoneId,
      }))
      if (typeof parsedDraft.shipToDifferentAddress === "boolean") {
        setShipToDifferentAddress(parsedDraft.shipToDifferentAddress)
      }
      if (typeof parsedDraft.billingAddressLineTwo === "string") {
        setBillingAddressLineTwo(parsedDraft.billingAddressLineTwo)
      }
      if (typeof parsedDraft.shippingRecipientName === "string") {
        setShippingRecipientName(parsedDraft.shippingRecipientName)
      }
      if (typeof parsedDraft.shippingRecipientPhone === "string") {
        setShippingRecipientPhone(parsedDraft.shippingRecipientPhone)
      }
      if (typeof parsedDraft.shippingAddressLine1 === "string") {
        setShippingAddressLine1(parsedDraft.shippingAddressLine1)
      }
      if (typeof parsedDraft.shippingAddressLine2 === "string") {
        setShippingAddressLine2(parsedDraft.shippingAddressLine2)
      }
      if (typeof parsedDraft.shippingZoneId === "string") {
        setShippingZoneId(parsedDraft.shippingZoneId)
      }
      if (typeof parsedDraft.orderNotes === "string") {
        setOrderNotes(parsedDraft.orderNotes)
      }
      if (typeof parsedDraft.emailAddress === "string") {
        setEmailAddress(parsedDraft.emailAddress)
      }
    } catch (error) {
      console.error("Failed to restore checkout draft", error)
    } finally {
      setHasHydratedDraft(true)
    }
  }, [checkoutDraftStorageKey])

  useEffect(() => {
    if (formData.deliveryMethod === "delivery" && !enableDelivery) {
      setFormData((previous) => ({ ...previous, deliveryMethod: "shop_pickup", zoneId: "" }))
      return
    }

    if (formData.deliveryMethod === "shop_pickup" && !enableShopPickup) {
      setFormData((previous) => ({ ...previous, deliveryMethod: "delivery" }))
    }
  }, [enableDelivery, enableShopPickup, formData.deliveryMethod])

  useEffect(() => {
    if (!hasHydratedDraft) return

    // Persist only non-empty drafts so old data does not linger indefinitely.
    const hasAnyDraftValue = Boolean(
      formData.name.trim() ||
      formData.phone.trim() ||
      formData.deliveryAddress.trim() ||
      formData.zoneId.trim() ||
      billingAddressLineTwo.trim() ||
      shippingRecipientName.trim() ||
      shippingRecipientPhone.trim() ||
      shippingAddressLine1.trim() ||
      shippingAddressLine2.trim() ||
      shippingZoneId.trim() ||
      orderNotes.trim() ||
      emailAddress.trim()
    )

    try {
      if (!hasAnyDraftValue) {
        localStorage.removeItem(checkoutDraftStorageKey)
        return
      }

      localStorage.setItem(
        checkoutDraftStorageKey,
        JSON.stringify({
          ...formData,
          shipToDifferentAddress,
          billingAddressLineTwo,
          shippingRecipientName,
          shippingRecipientPhone,
          shippingAddressLine1,
          shippingAddressLine2,
          shippingZoneId,
          orderNotes,
          emailAddress,
        })
      )
    } catch (error) {
      console.error("Failed to save checkout draft", error)
    }
  }, [
    billingAddressLineTwo,
    checkoutDraftStorageKey,
    emailAddress,
    formData,
    hasHydratedDraft,
    orderNotes,
    shipToDifferentAddress,
    shippingRecipientName,
    shippingRecipientPhone,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingZoneId,
  ])

  const formatPrice = (price: number) => formatCheckoutPrice(currency, price)

  const setFieldValue = (field: keyof CheckoutFormData, value: string) => {
    setFormData((previous) => {
      if (field === "deliveryMethod") {
        const nextMethod = value as CheckoutFormData["deliveryMethod"]
        if (nextMethod === "shop_pickup") {
          return { ...previous, deliveryMethod: nextMethod, zoneId: "" }
        }
      }
      return { ...previous, [field]: value }
    })

    if (fieldErrors[field]) {
      setFieldErrors((previous) => {
        const next = { ...previous }
        delete next[field]
        return next
      })
    }

    if (field === "deliveryMethod") {
      setFieldErrors((previous) => {
        const next = { ...previous }
        delete next.deliveryAddress
        delete next.zoneId
        delete next.shippingRecipientName
        delete next.shippingRecipientPhone
        delete next.shippingAddressLine1
        delete next.shippingZoneId
        return next
      })
    }
  }

  const clearFieldError = (field: keyof CheckoutFieldErrors) => {
    setFieldErrors((previous) => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  const handleShipToDifferentAddressChange = (checked: boolean) => {
    setShipToDifferentAddress(checked)

    if (checked) {
      clearFieldError("deliveryAddress")
      clearFieldError("zoneId")
      setShippingRecipientName(formData.name)
      setShippingRecipientPhone(formData.phone)
      setShippingAddressLine1(formData.deliveryAddress)
      setShippingAddressLine2(billingAddressLineTwo)
      setShippingZoneId(formData.zoneId)
      return
    }

    clearFieldError("shippingRecipientName")
    clearFieldError("shippingRecipientPhone")
    clearFieldError("shippingAddressLine1")
    clearFieldError("shippingZoneId")
  }

  const submitOrder = async () => {
    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    // Final totals and discount validation still happen server-side in `createOrder`.
    if (!hasAnyShippingMethod) {
      toast.error("This store has not enabled any shipping method yet.")
      return
    }

    const errors = validateCheckout(
      formData,
      formData.deliveryMethod === "delivery" && deliveryZones.length > 0,
      shipToDifferentAddress,
      shippingRecipientName,
      shippingRecipientPhone,
      shippingAddressLine1,
      shippingZoneId
    )
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields")
      return
    }

    setIsLoading(true)

    try {
      const isDelivery = formData.deliveryMethod === "delivery"
      const billingAddressLine1 = formData.deliveryAddress.trim()
      const billingAddressLine2Trimmed = billingAddressLineTwo.trim()
      const usesSeparateShipping = isDelivery && shipToDifferentAddress
      const shippingAddressLine1Trimmed = usesSeparateShipping
        ? shippingAddressLine1.trim()
        : billingAddressLine1
      const shippingAddressLine2Trimmed = usesSeparateShipping
        ? shippingAddressLine2.trim()
        : billingAddressLine2Trimmed
      const shippingRecipientNameTrimmed = usesSeparateShipping
        ? shippingRecipientName.trim()
        : formData.name.trim()
      const shippingRecipientPhoneTrimmed = usesSeparateShipping
        ? shippingRecipientPhone.trim()
        : formData.phone.trim()
      const effectiveShippingZoneId = usesSeparateShipping ? shippingZoneId : formData.zoneId
      const legacyDeliveryAddress = [shippingAddressLine1Trimmed, shippingAddressLine2Trimmed]
        .filter(Boolean)
        .join(", ")

      const orderResult = await createOrder({
        storeId,
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        fulfillmentMethod: formData.deliveryMethod,
        shipToDifferentAddress: usesSeparateShipping,
        billingAddressLine1: isDelivery ? billingAddressLine1 || undefined : undefined,
        billingAddressLine2: isDelivery ? billingAddressLine2Trimmed || undefined : undefined,
        billingZoneId: isDelivery ? formData.zoneId || undefined : undefined,
        shippingRecipientName: isDelivery ? shippingRecipientNameTrimmed || undefined : undefined,
        shippingRecipientPhone: isDelivery ? shippingRecipientPhoneTrimmed || undefined : undefined,
        shippingAddressLine1: isDelivery ? shippingAddressLine1Trimmed || undefined : undefined,
        shippingAddressLine2: isDelivery ? shippingAddressLine2Trimmed || undefined : undefined,
        shippingZoneId: isDelivery ? effectiveShippingZoneId || undefined : undefined,
        deliveryAddress: isDelivery ? legacyDeliveryAddress || undefined : undefined,
        deliveryZoneId: isDelivery ? effectiveShippingZoneId || undefined : undefined,
        notes: orderNotes.trim() || undefined,
        items: checkoutItems.map((item) => ({
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
      const targetUrl = `${storefrontPath(storeSlug, "/checkout/payment")}?${query.toString()}`

      // Clear local draft once order is successfully created.
      localStorage.removeItem(checkoutDraftStorageKey)
      if (isQuickCheckoutRequested) {
        localStorage.removeItem(quickCheckoutStorageKey)
      }
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

  const shippingMethodLabel =
    formData.deliveryMethod === "shop_pickup"
      ? "Shop Pickup"
      : selectedZone
      ? selectedZone.name
      : "Delivery"

  if (isQuickCheckoutRequested && !hasHydratedQuickCheckout) {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-[#E8E8E5] py-20 text-center">
        <p className="text-sm text-[#737373]">Preparing checkout...</p>
      </div>
    )
  }

  if (checkoutItems.length === 0) {
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
          href={storefrontPath(storeSlug)}
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
    <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12 xl:gap-12">
      <div className="xl:col-span-7">
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-7" noValidate>
          <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
            <CheckoutBillingSection
              firstNamePart={firstNamePart}
              lastNamePart={lastNamePart}
              fieldErrors={fieldErrors}
              formData={formData}
              hasAnyShippingMethod={hasAnyShippingMethod}
              enableDelivery={enableDelivery}
              enableShopPickup={enableShopPickup}
              shopPickupInstructions={shopPickupInstructions}
              shipToDifferentAddress={shipToDifferentAddress}
              deliveryZones={deliveryZones}
              billingAddressLineTwo={billingAddressLineTwo}
              emailAddress={emailAddress}
              formatPrice={formatPrice}
              getFieldClass={getFieldClass}
              onNameChange={(nextName) => setFieldValue("name", nextName)}
              onFieldValueChange={setFieldValue}
              onBillingAddressLineTwoChange={setBillingAddressLineTwo}
              onEmailAddressChange={setEmailAddress}
            />

            <CheckoutShippingSection
              deliveryMethod={formData.deliveryMethod}
              shipToDifferentAddress={shipToDifferentAddress}
              shippingRecipientName={shippingRecipientName}
              shippingRecipientPhone={shippingRecipientPhone}
              shippingAddressLine1={shippingAddressLine1}
              shippingAddressLine2={shippingAddressLine2}
              shippingZoneId={shippingZoneId}
              deliveryZones={deliveryZones}
              orderNotes={orderNotes}
              fieldErrors={fieldErrors}
              formatPrice={formatPrice}
              getFieldClass={getFieldClass}
              onToggleShipToDifferentAddress={handleShipToDifferentAddressChange}
              onShippingRecipientNameChange={(value) => {
                setShippingRecipientName(value)
                clearFieldError("shippingRecipientName")
              }}
              onShippingRecipientPhoneChange={(value) => {
                setShippingRecipientPhone(value)
                clearFieldError("shippingRecipientPhone")
              }}
              onShippingAddressLine1Change={(value) => {
                setShippingAddressLine1(value)
                clearFieldError("shippingAddressLine1")
              }}
              onShippingAddressLine2Change={setShippingAddressLine2}
              onShippingZoneIdChange={(value) => {
                setShippingZoneId(value)
                clearFieldError("shippingZoneId")
              }}
              onOrderNotesChange={setOrderNotes}
            />
          </section>
        </form>
      </div>

      <CheckoutOrderSummary
        checkoutItems={checkoutItems}
        checkoutSubtotal={checkoutSubtotal}
        shippingMethodLabel={shippingMethodLabel}
        grandTotal={grandTotal}
        brandColor={brandColor}
        paymentMethod={paymentMethod}
        isLoading={isLoading}
        formatPrice={formatPrice}
        onPaymentMethodChange={setPaymentMethod}
        onSubmit={submitOrder}
      />
    </div>
  )
}
