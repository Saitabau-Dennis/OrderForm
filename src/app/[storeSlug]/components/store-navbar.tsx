"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Heart } from "lucide-react"
import { useStore } from "./store-provider"

type StoreNavbarProps = {
  store: {
    name: string
    logoUrl: string | null
    brandColor: string
    slug: string
  }
}

export function StoreNavbar({ store }: StoreNavbarProps) {
  const { cartCount, wishlist, toggleCart, toggleWishlistSidebar, isCartOpen, isWishlistOpen } = useStore()

  // Derive initials for logo fallback
  const initials = store.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="bg-[#F7F7F5] border-b border-[#E8E8E5] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Logo + Name */}
        <Link
          href={`/${store.slug}`}
          className="flex items-center gap-2.5 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
        >
          {store.logoUrl ? (
            <Image
              src={store.logoUrl}
              alt={`${store.name} logo`}
              width={32}
              height={32}
              className="h-8 w-8 rounded-sm object-cover"
            />
          ) : (
            <span
              className="h-8 w-8 rounded-sm flex items-center justify-center text-[11px] font-bold text-white tracking-wider shrink-0"
              style={{ backgroundColor: store.brandColor || "#1A1A1A" }}
            >
              {initials}
            </span>
          )}
          <span className="text-[15px] md:text-base font-semibold text-[#1A1A1A] tracking-tight">
            {store.name}
          </span>
        </Link>

        {/* Actions (Wishlist + Cart) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Wishlist */}
          <button
            type="button"
            onClick={toggleWishlistSidebar}
            aria-label="Open wishlist"
            aria-expanded={isWishlistOpen}
            className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#F0F0EE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            <Heart className="h-[22px] w-[22px] text-[#1A1A1A]" strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span
                className="absolute top-1 right-1 h-2 w-2 rounded-full border border-[#F7F7F5]"
                style={{ backgroundColor: store.brandColor || "#1A1A1A" }}
              />
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={toggleCart}
            aria-label="Open cart"
            aria-expanded={isCartOpen}
            className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#F0F0EE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            <ShoppingBag className="h-5 w-5 text-[#1A1A1A]" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-sm"
                style={{ backgroundColor: store.brandColor || "#1A1A1A" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
