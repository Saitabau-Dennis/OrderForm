"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  variant: string | null
  quantity: number
}

type StoreContextType = {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeFromCart: (productId: string, variant: string | null) => void
  updateQuantity: (productId: string, variant: string | null, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number

  wishlist: string[] // Array of product IDs
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean

  actionModal: StoreActionModal | null
  showActionModal: (modal: StoreActionModal) => void
  hideActionModal: () => void

  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  toggleCart: () => void

  isWishlistOpen: boolean
  setIsWishlistOpen: (open: boolean) => void
  toggleWishlistSidebar: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export type StoreActionModal = {
  type: "cart" | "wishlist"
  productId: string
  name: string
  imageUrl: string | null
  category: string | null
}

const LEGACY_CART_KEY = "orderform_cart"
const LEGACY_WISHLIST_KEY = "orderform_wishlist"

// Store-scoped keys prevent data bleeding between different storefront slugs.
function getCartStorageKey(storeSlug: string) {
  return `orderform_cart:${storeSlug}`
}

function getWishlistStorageKey(storeSlug: string) {
  return `orderform_wishlist:${storeSlug}`
}

function parseJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

// Keeps only valid cart records and drops entries for products that no longer exist.
function sanitizeCart(value: unknown, availableProductIds: Set<string>): CartItem[] {
  if (!Array.isArray(value)) return []

  const sanitized: CartItem[] = []

  for (const item of value) {
    if (!item || typeof item !== "object") continue

    const candidate = item as Partial<CartItem>
    if (typeof candidate.productId !== "string" || candidate.productId.trim() === "") continue
    if (!availableProductIds.has(candidate.productId)) continue
    if (typeof candidate.name !== "string" || candidate.name.trim() === "") continue
    if (typeof candidate.price !== "number" || !Number.isFinite(candidate.price) || candidate.price < 0) continue

    const quantity =
      typeof candidate.quantity === "number" && Number.isFinite(candidate.quantity)
        ? Math.max(1, Math.floor(candidate.quantity))
        : 1

    sanitized.push({
      productId: candidate.productId,
      name: candidate.name,
      price: candidate.price,
      imageUrl: typeof candidate.imageUrl === "string" ? candidate.imageUrl : null,
      variant: typeof candidate.variant === "string" ? candidate.variant : null,
      quantity,
    })
  }

  return sanitized
}

// Keeps only unique, currently available product ids.
function sanitizeWishlist(value: unknown, availableProductIds: Set<string>): string[] {
  if (!Array.isArray(value)) return []

  const ids = value
    .filter((id): id is string => typeof id === "string" && id.trim() !== "")
    .filter((id) => availableProductIds.has(id))

  return Array.from(new Set(ids))
}

function areCartEqual(a: CartItem[], b: CartItem[]) {
  if (a.length !== b.length) return false
  return a.every((item, index) => {
    const compare = b[index]
    return (
      item.productId === compare.productId &&
      item.name === compare.name &&
      item.price === compare.price &&
      item.imageUrl === compare.imageUrl &&
      item.variant === compare.variant &&
      item.quantity === compare.quantity
    )
  })
}

function areStringArraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  return a.every((value, index) => value === b[index])
}

export function StoreProvider({
  children,
  storeSlug,
  availableProductIds,
}: {
  children: React.ReactNode
  storeSlug: string
  availableProductIds: string[]
}) {
  const availableProductsSet = useMemo(() => new Set(availableProductIds), [availableProductIds])
  const cartStorageKey = useMemo(() => getCartStorageKey(storeSlug), [storeSlug])
  const wishlistStorageKey = useMemo(() => getWishlistStorageKey(storeSlug), [storeSlug])
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [actionModal, setActionModal] = useState<StoreActionModal | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Restore scoped state and transparently migrate legacy unscoped keys.
  useEffect(() => {
    try {
      const rawScopedCart = localStorage.getItem(cartStorageKey)
      const rawScopedWishlist = localStorage.getItem(wishlistStorageKey)

      const rawCart = rawScopedCart ?? localStorage.getItem(LEGACY_CART_KEY)
      const rawWishlist = rawScopedWishlist ?? localStorage.getItem(LEGACY_WISHLIST_KEY)

      const parsedCart = parseJson<unknown>(rawCart)
      const parsedWishlist = parseJson<unknown>(rawWishlist)

      const nextCart = sanitizeCart(parsedCart, availableProductsSet)
      const nextWishlist = sanitizeWishlist(parsedWishlist, availableProductsSet)

      // State must be set after mount to avoid SSR hydration drift.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(nextCart)
      setWishlist(nextWishlist)
    } catch (e) {
      console.error("Failed to load store state", e)
    }
    setHasInitialized(true)
  }, [availableProductsSet, cartStorageKey, wishlistStorageKey])

  // Persist cart after initial hydration only.
  useEffect(() => {
    if (!hasInitialized) return
    localStorage.setItem(cartStorageKey, JSON.stringify(cart))
  }, [cart, cartStorageKey, hasInitialized])

  useEffect(() => {
    if (!hasInitialized) return
    localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist))
  }, [wishlist, wishlistStorageKey, hasInitialized])

  // Sync cart/wishlist updates across tabs via the storage event.
  useEffect(() => {
    if (!hasInitialized) return

    const handleStorage = (event: StorageEvent) => {
      if (!event.key) return

      if (event.key === cartStorageKey) {
        const nextCart = sanitizeCart(parseJson<unknown>(event.newValue), availableProductsSet)
        setCart((previous) => (areCartEqual(previous, nextCart) ? previous : nextCart))
      }

      if (event.key === wishlistStorageKey) {
        const nextWishlist = sanitizeWishlist(parseJson<unknown>(event.newValue), availableProductsSet)
        setWishlist((previous) => (areStringArraysEqual(previous, nextWishlist) ? previous : nextWishlist))
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [availableProductsSet, cartStorageKey, wishlistStorageKey, hasInitialized])

  // Cart actions.
  const addToCart = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    if (!availableProductsSet.has(newItem.productId)) return

    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.variant === newItem.variant
      )

      if (existingItemIndex > -1) {
        const updated = [...prev]
        updated[existingItemIndex].quantity += (newItem.quantity || 1)
        return updated
      }

      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }]
    })
  }

  const removeFromCart = (productId: string, variant: string | null) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variant === variant)))
  }

  const updateQuantity = (productId: string, variant: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        (item.productId === productId && item.variant === variant)
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Wishlist actions.
  const toggleWishlist = (productId: string) => {
    if (!availableProductsSet.has(productId)) return

    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      }
      return [...prev, productId]
    })
  }

  const isInWishlist = (productId: string) => wishlist.includes(productId)

  const showActionModal = (modal: StoreActionModal) => setActionModal(modal)
  const hideActionModal = () => setActionModal(null)

  // UI state for side panels/modals.
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  const toggleCart = () => setIsCartOpen((prev) => !prev)
  const toggleWishlistSidebar = () => setIsWishlistOpen((prev) => !prev)

  return (
    <StoreContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
        wishlist, toggleWishlist, isInWishlist,
        actionModal, showActionModal, hideActionModal,
        isCartOpen, setIsCartOpen, toggleCart,
        isWishlistOpen, setIsWishlistOpen, toggleWishlistSidebar
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
