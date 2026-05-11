import type { CheckoutFieldErrors, CheckoutFormData } from "./checkout-form-types"

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "")
}

// Client-side validation mirrors server expectations for faster feedback.
export function validateCheckout(
  formData: CheckoutFormData,
  requiresZone: boolean,
  shipToDifferentAddress: boolean,
  shippingRecipientName: string,
  shippingRecipientPhone: string,
  shippingAddressLine1: string,
  shippingZoneId: string
): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {}
  const isDelivery = formData.deliveryMethod === "delivery"

  if (!formData.name.trim() || formData.name.trim().length < 2) {
    errors.name = "Please enter your full name."
  }

  const phoneDigits = normalizePhone(formData.phone)
  if (phoneDigits.length < 10 || phoneDigits.length > 12) {
    errors.phone = "Enter a valid phone number (e.g. 0712345678)."
  }

  if (
    isDelivery &&
    !shipToDifferentAddress &&
    (!formData.deliveryAddress.trim() || formData.deliveryAddress.trim().length < 8)
  ) {
    errors.deliveryAddress = "Please provide a complete delivery location."
  }

  if (isDelivery && requiresZone && !shipToDifferentAddress && !formData.zoneId) {
    errors.zoneId = "Please select your delivery zone."
  }

  if (isDelivery && shipToDifferentAddress) {
    if (!shippingRecipientName.trim() || shippingRecipientName.trim().length < 2) {
      errors.shippingRecipientName = "Please enter recipient name."
    }

    const shippingRecipientPhoneDigits = normalizePhone(shippingRecipientPhone)
    if (shippingRecipientPhoneDigits.length < 10 || shippingRecipientPhoneDigits.length > 12) {
      errors.shippingRecipientPhone = "Enter a valid recipient phone number."
    }

    if (!shippingAddressLine1.trim() || shippingAddressLine1.trim().length < 8) {
      errors.shippingAddressLine1 = "Please provide a complete shipping location."
    }

    if (requiresZone && !shippingZoneId) {
      errors.shippingZoneId = "Please select a shipping zone."
    }
  }

  return errors
}

export function getFieldClass(hasError: boolean): string {
  const base =
    "w-full rounded-none text-sm text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-0"

  if (hasError) {
    return `${base} border border-red-400 bg-transparent focus:border-red-500`
  }

  return `${base} border border-[#E8E8E5] bg-transparent focus:border-[#1A1A1A]`
}

export function formatCheckoutPrice(currency: string, price: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
}
