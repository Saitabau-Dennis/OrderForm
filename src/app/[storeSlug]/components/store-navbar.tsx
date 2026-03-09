"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Heart, Search } from "lucide-react"
import { useStore } from "./store-provider"
import { StoreTopBar } from "./store-top-bar"

type StoreNavbarProps = {
  store: {
    name: string
    brandColor: string
    slug: string
    categories?: string[]
    socialLinks?: {
      instagramUrl?: string | null
      facebookUrl?: string | null
      tiktokUrl?: string | null
      xUrl?: string | null
    }
  }
}

export function StoreNavbar({ store }: StoreNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { cartCount, wishlist } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  const categories = (store.categories ?? []).filter(Boolean)
  const isHomeActive = pathname === `/${store.slug}`
  const isCatalogActive = pathname.startsWith(`/${store.slug}/products`)
  const isContactActive = pathname === `/${store.slug}/contact`
  const contactHref = `/${store.slug}/contact`

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Search is handled by products page query param routing.
    const query = searchQuery.trim()
    const searchParams = query ? `?query=${encodeURIComponent(query)}` : ""
    router.push(`/${store.slug}/products${searchParams}`)
  }

  return (
    <header className="z-40 bg-[#F7F7F5]">
      <StoreTopBar socialLinks={store.socialLinks} />

      <div>
        <div className="mx-auto grid h-[140px] w-full max-w-[1460px] items-center gap-4 px-4 pt-6 sm:px-6 sm:pt-8 lg:grid-cols-[320px_minmax(0,1fr)_220px] lg:px-8 lg:pt-10">
          <Link
            href={`/${store.slug}`}
            className="relative inline-flex min-w-0 shrink-0 pr-8 pt-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            title={store.name}
          >
            <span className="block max-w-[320px] [font-family:var(--font-adcure)] text-[30px] leading-[0.82] tracking-tight text-[#111111] sm:text-[34px] lg:text-[38px]">
              {store.name}
            </span>
          </Link>

          <form onSubmit={handleSearch} className="relative mx-auto hidden w-full max-w-[640px] lg:block">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Enter key to search"
              className="h-[48px] w-full border border-[#CECEC9] bg-transparent pl-4 pr-12 text-sm text-[#1A1A1A] placeholder:text-[#7C7C75] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-0"
            />
            <button
              type="submit"
              aria-label="Search products"
              className="absolute right-0 top-0 inline-flex h-[48px] w-[48px] items-center justify-center text-[#33332F] hover:bg-[#ECECE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="flex items-center justify-start gap-2 md:justify-end sm:gap-3">
            <Link
              href={`/${store.slug}/wishlist`}
              aria-label="Open wishlist"
              className="relative inline-flex h-9 w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#F0F0EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              <Heart className="h-5 w-5" strokeWidth={1.8} />
              {wishlist.length > 0 ? (
                <span
                  className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center px-1 text-[10px] font-bold text-white"
                  style={{ backgroundColor: "var(--store-brand, #1A1A1A)" }}
                >
                  {wishlist.length}
                </span>
              ) : null}
            </Link>

            <Link
              href={`/${store.slug}/cart`}
              aria-label="Open cart"
              className="relative inline-flex h-9 w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#F0F0EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
              {cartCount > 0 ? (
                <span
                  className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center px-1 text-[10px] font-bold text-white"
                  style={{ backgroundColor: "var(--store-brand, #1A1A1A)" }}
                >
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[180px] w-full max-w-[1460px] items-end justify-center px-4 pb-8 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-center gap-10">
          <Link
            href={`/${store.slug}`}
            className={`text-sm font-semibold tracking-wide ${
              isHomeActive ? "text-[#111111] underline underline-offset-[6px]" : "text-[#2A2A26] hover:underline hover:underline-offset-[6px]"
            }`}
          >
            HOME
          </Link>

          <div className="group relative">
            <Link
              href={`/${store.slug}/products`}
              className={`inline-flex items-center gap-1 text-sm font-semibold tracking-wide ${
                isCatalogActive ? "text-[#111111] underline underline-offset-[6px]" : "text-[#2A2A26] hover:underline hover:underline-offset-[6px]"
              }`}
            >
              CATALOG
              <span>+</span>
            </Link>

            <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-[240px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
              <div className="border border-[#D8D8D3] bg-[#F7F7F5] p-2 shadow-[0_10px_24px_rgba(20,20,18,0.08)]">
                <Link
                  href={`/${store.slug}/products`}
                  className="block px-3 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#ECECE7]"
                >
                  All products
                </Link>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category}
                      href={`/${store.slug}/products?category=${encodeURIComponent(category)}`}
                      className="block px-3 py-2 text-sm text-[#2A2A26] hover:bg-[#ECECE7]"
                    >
                      {category}
                    </Link>
                  ))
                ) : (
                  <span className="block px-3 py-2 text-sm text-[#787872]">No categories yet</span>
                )}
              </div>
            </div>
          </div>

          <Link
            href={contactHref}
            className={`text-sm font-semibold tracking-wide ${
              isContactActive ? "text-[#111111] underline underline-offset-[6px]" : "text-[#2A2A26] hover:underline hover:underline-offset-[6px]"
            }`}
          >
            CONTACT US
          </Link>
        </nav>
      </div>
    </header>
  )
}
