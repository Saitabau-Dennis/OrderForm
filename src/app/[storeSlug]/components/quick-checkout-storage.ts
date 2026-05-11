import type { CartItem } from "./store-provider"

type QuickCheckoutPayload = {
  storeSlug: string
  item: CartItem
  createdAt: number
}

export function getQuickCheckoutStorageKey(storeSlug: string) {
  return `orderform_quick_checkout:${storeSlug}`
}

function sanitizeCartItem(value: unknown): CartItem | null {
  if (!value || typeof value !== "object") return null

  const candidate = value as Partial<CartItem>
  if (typeof candidate.productId !== "string" || candidate.productId.trim() === "") return null
  if (typeof candidate.name !== "string" || candidate.name.trim() === "") return null
  if (typeof candidate.price !== "number" || !Number.isFinite(candidate.price) || candidate.price < 0) return null

  const quantity =
    typeof candidate.quantity === "number" && Number.isFinite(candidate.quantity)
      ? Math.max(1, Math.floor(candidate.quantity))
      : 1

  return {
    productId: candidate.productId,
    name: candidate.name,
    price: candidate.price,
    imageUrl: typeof candidate.imageUrl === "string" ? candidate.imageUrl : null,
    variant: typeof candidate.variant === "string" ? candidate.variant : null,
    quantity,
  }
}

export function createQuickCheckoutPayload(storeSlug: string, item: CartItem): QuickCheckoutPayload {
  return {
    storeSlug,
    item,
    createdAt: Date.now(),
  }
}

export function parseQuickCheckoutPayload(rawValue: string | null, expectedStoreSlug: string): CartItem | null {
  if (!rawValue) return null

  try {
    const parsed = JSON.parse(rawValue) as Partial<QuickCheckoutPayload>
    if (parsed.storeSlug !== expectedStoreSlug) return null
    return sanitizeCartItem(parsed.item)
  } catch {
    return null
  }
}
