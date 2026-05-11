import type { CartItem } from "./store-provider"

export type DeliveryZone = {
  id: string
  name: string
  price: number
}

export type CheckoutClientProps = {
  storeId: string
  storeSlug: string
  currency: string
  deliveryZones: DeliveryZone[]
  brandColor: string
  enableDelivery: boolean
  enableShopPickup: boolean
  shopPickupInstructions?: string | null
}

export type CheckoutFormData = {
  name: string
  phone: string
  deliveryMethod: "delivery" | "shop_pickup"
  deliveryAddress: string
  zoneId: string
}

export type PaymentMethod = "mpesa" | "card"

export type CheckoutFieldName =
  | keyof CheckoutFormData
  | "shippingAddressLine1"
  | "shippingZoneId"
  | "shippingRecipientName"
  | "shippingRecipientPhone"

export type CheckoutFieldErrors = Partial<Record<CheckoutFieldName, string>>

export type CheckoutLineItem = CartItem
