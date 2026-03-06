"use client"

import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useStore } from "./store-provider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Trash2 } from "lucide-react"

// Same product interface exported or redefined here for the component
type ProductInfo = {
  id: string
  name: string
  price: number
  imageUrl: string | null
  category: string | null
  hasOptions?: boolean
}

export function StoreWishlistSheet({ storeSlug, currency, allProducts }: { storeSlug: string; currency: string; allProducts: ProductInfo[] }) {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    setIsCartOpen,
  } = useStore()

  // Find products that are in the user's wishlist
  const savedProducts = allProducts.filter(p => wishlist.includes(p.id))

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(p)
  }

  const handleRemoveFromWishlist = (product: ProductInfo) => {
    toggleWishlist(product.id)
    toast.success(`${product.name} removed from wishlist`)
  }

  // Quick Add function from Wishlist to Cart
  const handleQuickAdd = (product: ProductInfo) => {
    if (product.hasOptions) return

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      variant: null,
      quantity: 1,
    })
    setIsWishlistOpen(false)
    setIsCartOpen(true)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
      <SheetContent side="right" className="theme-store w-full sm:max-w-lg p-0 flex flex-col bg-white font-sans">
        <SheetHeader className="px-6 pt-6 pb-4 pr-16 text-left">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="text-xl font-semibold text-[#1A1A1A]">Your Wishlist</SheetTitle>
            {savedProducts.length > 0 ? (
              <span className="rounded-full bg-[#F3F3F0] px-2.5 py-1 text-xs font-semibold text-[#5A5A55]" aria-live="polite">
                {savedProducts.length} item{savedProducts.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {savedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 my-auto">
              <span className="text-4xl text-[#1A1A1A]">♡</span>
              <p className="text-[#737373] text-sm max-w-[250px]">
                Save items you love by clicking the heart icon on any product page.
              </p>
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="mt-4 px-6 h-10 border border-[#1A1A1A] text-[#1A1A1A] font-medium text-sm transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProducts.map((product) => (
                <div key={product.id} className="group relative rounded-sm border border-[#E8E8E5] bg-white p-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemoveFromWishlist(product)
                    }}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-sm shadow-sm text-[#737373] hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex gap-3">
                    <Link
                      href={`/${storeSlug}/products/${product.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                    >
                      <div className="relative h-20 w-20 bg-[#EEECEA] rounded-sm overflow-hidden border border-[#E8E8E5]">
                        {product.imageUrl && (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" />
                        )}
                      </div>
                    </Link>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-[#737373] line-clamp-1 uppercase tracking-wide">{product.category || "Featured"}</p>
                      <Link
                        href={`/${storeSlug}/products/${product.id}`}
                        onClick={() => setIsWishlistOpen(false)}
                        className="mt-0.5 block text-[13px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2 hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-2 text-[13px] font-bold text-[#1A1A1A]">{formatPrice(product.price)}</p>

                      <div className="mt-3 flex gap-2">
                        <Link
                          href={`/${storeSlug}/products/${product.id}`}
                          onClick={() => setIsWishlistOpen(false)}
                          className="inline-flex h-9 items-center justify-center rounded-sm border border-[#DADAD5] px-3 text-[11px] font-semibold uppercase tracking-wide text-[#5D5D57] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                        >
                          View
                        </Link>
                        {product.hasOptions ? (
                          <Link
                            href={`/${storeSlug}/products/${product.id}`}
                            onClick={() => setIsWishlistOpen(false)}
                            className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-sm border border-[#1A1A1A] bg-[#1A1A1A] px-3 text-[11px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                          >
                            Add to cart
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product)}
                            className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-sm border border-[#1A1A1A] bg-[#1A1A1A] px-3 text-[11px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                          >
                            Add to cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
