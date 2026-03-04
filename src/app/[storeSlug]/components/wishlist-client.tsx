"use client"

import Link from "next/link"
import Image from "next/image"
import { useStore } from "./store-provider"
import { Heart, ArrowLeft, Trash2 } from "lucide-react"

type ProductInfo = {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  isAvailable: boolean
}

type WishlistClientProps = {
  storeSlug: string
  currency: string
  allProducts: ProductInfo[]
  brandColor: string
}

export function WishlistClient({ storeSlug, currency, allProducts, brandColor }: WishlistClientProps) {
  const { wishlist, toggleWishlist } = useStore()

  // Find products that are in the user's wishlist
  const savedProducts = allProducts.filter(p => wishlist.includes(p.id))

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(p)
  }

  if (savedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#E8E8E5] rounded-sm text-center">
        <div className="h-16 w-16 mb-4 rounded-full bg-[#F7F7F5] flex items-center justify-center">
          <Heart className="w-7 h-7 text-[#1A1A1A] fill-transparent" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Your wishlist is empty</h2>
        <p className="text-[#737373] text-sm mb-6 max-w-sm">
          Save items you love by clicking the heart icon on any product page.
        </p>
        <Link
          href={`/${storeSlug}`}
          className="inline-flex items-center gap-2 h-12 px-6 bg-[#1A1A1A] text-white font-medium text-sm transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
      {savedProducts.map((product) => (
        <div key={product.id} className="group relative">
          {/* Remove Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(product.id)
            }}
            className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-[#737373] hover:text-red-500"
            aria-label="Remove from wishlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link href={`/${storeSlug}/product/${product.id}`} className="block cursor-pointer">
            {/* Image */}
            <div className="relative aspect-[4/5] md:aspect-square w-full bg-[#EEECEA] overflow-hidden mb-3 rounded-sm">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                  <span className="text-[#AAAAAA] text-[10px] md:text-xs uppercase tracking-widest font-medium">No image</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-0.5">
              <p className="text-[12px] md:text-[13px] text-[#737373] font-normal leading-none">
                {product.category ?? ""}
              </p>
              <p className="text-[13px] md:text-sm font-medium text-[#1A1A1A] leading-snug line-clamp-2">
                {product.name}
              </p>
              <p className="text-[13px] md:text-sm font-semibold text-[#1A1A1A]">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
