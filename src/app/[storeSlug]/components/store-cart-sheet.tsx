"use client"

import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { useStore } from "./store-provider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function StoreCartSheet({ storeSlug, currency }: { storeSlug: string; currency: string }) {
  const {
    cart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useStore()

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(p)
  }

  const handleRemoveItem = (productId: string, variant: string | null, itemName: string) => {
    removeFromCart(productId, variant)
    toast.success(`${itemName} removed from cart`)
  }

  const handleClearCart = () => {
    if (cart.length === 0) return
    clearCart()
    toast.success("Cart cleared")
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="theme-store w-full sm:max-w-lg p-0 flex flex-col bg-white font-sans">
        <SheetHeader className="px-6 pt-6 pb-4 pr-16 text-left">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="text-xl font-semibold text-[#1A1A1A]">Your Cart</SheetTitle>
            {cartCount > 0 ? (
              <span className="rounded-full bg-[#F3F3F0] px-2.5 py-1 text-xs font-semibold text-[#5A5A55]" aria-live="polite">
                {cartCount} item{cartCount === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 my-auto">
              <span className="text-4xl">🛒</span>
              <p className="text-[#737373] text-sm">Your cart is currently empty.</p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 h-10 border border-[#1A1A1A] text-[#1A1A1A] font-medium text-sm transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs font-semibold uppercase tracking-wide text-[#6A6A65] underline underline-offset-4 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                >
                  Clear cart
                </button>
              </div>

              {cart.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="rounded-sm border border-[#E8E8E5] bg-white p-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/${storeSlug}/products/${item.productId}`}
                      onClick={() => setIsCartOpen(false)}
                      className="relative h-20 w-20 bg-[#EEECEA] rounded-sm overflow-hidden shrink-0 border border-[#E8E8E5] block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                    >
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/${storeSlug}/products/${item.productId}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-[#1A1A1A] leading-tight hover:underline line-clamp-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.productId, item.variant, item.name)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-[#7A7A73] transition-colors hover:bg-[#F4F4F1] hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {item.variant ? (
                        <p className="mt-1 text-[12px] text-[#737373] line-clamp-1">{item.variant}</p>
                      ) : null}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-sm border border-[#E8E8E5] bg-[#FAFAFA] px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#737373] transition-colors hover:bg-white hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                          >
                            -
                          </button>
                          <span className="min-w-[1rem] text-center text-[13px] font-semibold text-[#1A1A1A]" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-[#737373] transition-colors hover:bg-white hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] text-[#7A7A73]">Total</p>
                          <p className="text-sm font-bold text-[#1A1A1A]">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-[#E8E8E5] bg-[#FAFAFA] space-y-4">
            <div className="rounded-sm border border-[#E5E5E0] bg-white p-4">
              <div className="flex items-center justify-between text-[13px] text-[#737373]">
                <span>Items</span>
                <span className="font-medium text-[#1A1A1A]">{cartCount}</span>
              </div>
              <div className="mt-2 flex justify-between items-center text-[15px]">
                <span className="font-semibold text-[#1A1A1A]">Subtotal</span>
                <span className="font-bold text-[#1A1A1A]">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <p className="text-[12px] text-[#737373]">Shipping & taxes calculated at checkout.</p>
            <Link
              href={`/${storeSlug}/checkout`}
              onClick={() => setIsCartOpen(false)}
              className="w-full h-14 bg-[#1A1A1A] text-white font-medium text-[15px] transition-opacity hover:opacity-90 active:scale-[0.99] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
