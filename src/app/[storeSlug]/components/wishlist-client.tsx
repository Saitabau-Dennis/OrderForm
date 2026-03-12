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
}

export function WishlistClient({ storeSlug, currency, allProducts }: WishlistClientProps) {
  const { wishlist, toggleWishlist } = useStore()

  // Resolve persisted wishlist ids into full product rows for rendering.
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
      <div className="flex flex-col items-center justify-center rounded-none border border-[#CECEC9] py-24 text-center">
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
    <div className="space-y-4">
      <div className="space-y-3 md:hidden">
        {savedProducts.map((product) => (
          <article key={product.id} className="border border-[#E8E8E5] p-3">
            <div className="flex items-start gap-3">
              <Link href={`/${storeSlug}/catalog/${product.id}`} className="block">
                <div className="relative h-16 w-16 overflow-hidden rounded-none bg-[#EEECEA]">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center px-1 text-center">
                      <span className="text-[9px] uppercase tracking-wider text-[#AAAAAA]">No image</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/${storeSlug}/catalog/${product.id}`}
                  className="line-clamp-2 text-sm font-medium text-[#1A1A1A] transition hover:underline"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-xs text-[#737373]">{product.category || "-"}</p>
                <p className="mt-2 text-sm font-semibold text-[#1A1A1A]">{formatPrice(product.price)}</p>
              </div>
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="mt-3 inline-flex h-9 items-center gap-2 border border-[#D8D8D2] px-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#5F5F5A] transition hover:border-red-200 hover:text-red-600"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto border border-[#E8E8E5] md:block">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E8E8E5] text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6D6D67]">Item</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6D6D67]">Product</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6D6D67]">Category</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6D6D67]">Price</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6D6D67]">Action</th>
            </tr>
          </thead>
          <tbody>
            {savedProducts.map((product) => (
              <tr key={product.id} className="border-b border-[#EFEFEA] last:border-b-0">
                <td className="px-4 py-3">
                  <Link href={`/${storeSlug}/catalog/${product.id}`} className="block">
                    <div className="relative h-16 w-16 overflow-hidden rounded-none bg-[#EEECEA]">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover object-center"
                          sizes="64px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center px-1 text-center">
                          <span className="text-[9px] uppercase tracking-wider text-[#AAAAAA]">No image</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${storeSlug}/catalog/${product.id}`}
                    className="text-sm font-medium text-[#1A1A1A] transition hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-[#737373]">{product.category || "-"}</td>
                <td className="px-4 py-3 text-sm font-semibold text-[#1A1A1A]">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="inline-flex h-9 items-center gap-2 border border-[#D8D8D2] px-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#5F5F5A] transition hover:border-red-200 hover:text-red-600"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
