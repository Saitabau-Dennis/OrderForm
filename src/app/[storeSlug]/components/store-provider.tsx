"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

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

  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  toggleCart: () => void

  isWishlistOpen: boolean
  setIsWishlistOpen: (open: boolean) => void
  toggleWishlistSidebar: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("orderform_cart")
      const savedWishlist = localStorage.getItem("orderform_wishlist")
      if (savedCart) setCart(JSON.parse(savedCart))
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    } catch (e) {
      console.error("Failed to load store state", e)
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem("orderform_cart", JSON.stringify(cart))
  }, [cart, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem("orderform_wishlist", JSON.stringify(wishlist))
  }, [wishlist, isInitialized])

  // Cart Actions
  const addToCart = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
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

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      }
      return [...prev, productId]
    })
  }

  const isInWishlist = (productId: string) => wishlist.includes(productId)

  // UI State for Sliders
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  const toggleCart = () => setIsCartOpen((prev) => !prev)
  const toggleWishlistSidebar = () => setIsWishlistOpen((prev) => !prev)

  return (
    <StoreContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
        wishlist, toggleWishlist, isInWishlist,
        isCartOpen, setIsCartOpen, toggleCart,
        isWishlistOpen, setIsWishlistOpen, toggleWishlistSidebar
      }}
    >
      {/* Suppress hydration mismatch by not rendering until loaded if strictly needed,
          but usually okay to render children. To be safe with counts, we can render immediately
          and let the client hydrate. */}
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
