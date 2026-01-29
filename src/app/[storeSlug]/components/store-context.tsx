"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

// --- Types ---
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variant?: string;
  maxQuantity?: number;
}

interface StoreContextType {
  // Cart State
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: any, quantity: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, delta: number, variant?: string) => void;
  cartCount: number;
  cartTotal: number;

  // Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Store Theme State
  // Store Theme State
  currency: string;
  brandColor: string;
  storeName: string;
  whatsappNumber: string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({
  children,
  currency = "KES",
  brandColor = "#000000",
  storeName,
  whatsappNumber
}: {
  children: ReactNode;
  currency?: string;
  brandColor?: string;
  storeName: string;
  whatsappNumber: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("orderform-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("orderform-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: any, quantity: number, variant?: string) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === (product._id || product.id) && item.variant === variant
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prev,
          {
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity,
            variant,
          },
        ];
      }
    });
    setIsCartOpen(true);
    toast.success("Added to bag");
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.variant === variant)));
  };

  const updateQuantity = (productId: string, delta: number, variant?: string) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === productId && item.variant === variant) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        searchQuery,
        setSearchQuery,
        currency,
        brandColor,
        storeName,
        whatsappNumber
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}