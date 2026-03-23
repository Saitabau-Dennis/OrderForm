"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown } from "lucide-react"
import { storefrontPath } from "@/lib/storefront-path"
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
  const homeHref = storefrontPath(store.slug)
  const catalogHref = storefrontPath(store.slug, "/catalog")
  const contactHref = storefrontPath(store.slug, "/contact")
  const cartHref = storefrontPath(store.slug, "/cart")
  const wishlistHref = storefrontPath(store.slug, "/wishlist")
  const isHomeActive = pathname === homeHref || pathname === "/"
  const isCatalogActive = pathname.startsWith(catalogHref) || pathname.startsWith("/catalog")
  const isContactActive = pathname === contactHref || pathname === "/contact"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Search is handled by catalog page query param routing.
    const query = searchQuery.trim()
    const searchParams = query ? `?query=${encodeURIComponent(query)}` : ""
    router.push(`${catalogHref}${searchParams}`)
  }

  return (
    <header className="z-40 bg-background">
      <StoreTopBar socialLinks={store.socialLinks} />

      <div>
        <div className="mx-auto w-full max-w-[1460px] px-4 py-5 sm:px-6 sm:py-6 lg:hidden">
          <div className="relative flex items-center justify-center pb-6 pt-2">
            <Link
              href={homeHref}
              className="inline-flex min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              title={store.name}
            >
              <span className="block max-w-[min(76vw,280px)] break-words text-center [font-family:var(--font-adcure)] text-[clamp(21px,7.5vw,28px)] leading-[0.88] tracking-tight text-[#111111] line-clamp-2">
                {store.name}
              </span>
            </Link>

            <Link
              href={cartHref}
              aria-label="Open cart"
              className="absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#F0F0EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
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

          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((current) => {
                  const next = !current
                  if (!next) setMobileCatalogOpen(false)
                  return next
                })
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-9 w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#F0F0EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="mx-auto hidden w-full max-w-[1460px] items-center gap-4 px-8 pb-0 pt-10 lg:grid lg:h-[140px] lg:grid-cols-[320px_minmax(0,1fr)_220px]">
          <Link
            href={homeHref}
            className="relative inline-flex min-w-0 shrink-0 rounded-sm pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 lg:pr-8"
            title={store.name}
          >
            <span className="block max-w-[360px] [font-family:var(--font-adcure)] text-[44px] leading-[0.82] tracking-tight text-[#111111]">
              {store.name}
            </span>
          </Link>

          <form onSubmit={handleSearch} className="relative mx-auto w-full max-w-[640px]">
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

          <div className="flex items-center justify-end gap-3">
            <Link
              href={wishlistHref}
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
              href={cartHref}
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

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/5 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => {
              setMobileMenuOpen(false)
              setMobileCatalogOpen(false)
            }}
            className="absolute inset-0 h-full w-full cursor-default"
          />

          <div className="relative h-full w-[min(88vw,430px)] bg-[#E6EAE3] shadow-[6px_0_22px_rgba(0,0,0,0.12)]">
            <nav>
              <div className="grid grid-cols-[minmax(0,1fr)_44px] border-b border-[#D8D8D3]">
                <Link
                  href={homeHref}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileCatalogOpen(false)
                  }}
                  className={`block px-6 py-4 text-sm font-semibold tracking-wide ${
                    isHomeActive ? "text-[#111111]" : "text-[#2A2A26]"
                  }`}
                >
                  HOME
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileCatalogOpen(false)
                  }}
                  aria-label="Close menu"
                  className="inline-flex h-11 w-11 items-center justify-center bg-[#111111] text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="border-b border-[#D8D8D3]">
                <button
                  type="button"
                  onClick={() => setMobileCatalogOpen((current) => !current)}
                  aria-expanded={mobileCatalogOpen}
                  className="grid w-full grid-cols-[minmax(0,1fr)_56px] items-center text-left"
                >
                  <span className="px-6 py-4 text-sm font-semibold tracking-wide text-[#2A2A26]">
                    COLLECTIONS
                  </span>
                  <span className="inline-flex h-full items-center justify-center border-l border-[#D8D8D3] bg-[#EFEFED] text-[#6B6B65]">
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileCatalogOpen ? "rotate-180" : ""}`} />
                  </span>
                </button>

                {mobileCatalogOpen ? (
                  <div>
                    <Link
                      href={catalogHref}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setMobileCatalogOpen(false)
                      }}
                      className={`block border-t border-[#E3E3DE] px-6 py-4 text-sm ${
                        isCatalogActive ? "font-semibold text-[#111111]" : "text-[#2A2A26]"
                      }`}
                    >
                      All products
                    </Link>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category}
                          href={`${catalogHref}?category=${encodeURIComponent(category)}`}
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setMobileCatalogOpen(false)
                          }}
                          className="block border-t border-[#E3E3DE] px-6 py-4 text-sm text-[#2A2A26]"
                        >
                          {category}
                        </Link>
                      ))
                    ) : null}
                  </div>
                ) : null}
              </div>

              <Link
                href={contactHref}
                onClick={() => {
                  setMobileMenuOpen(false)
                  setMobileCatalogOpen(false)
                }}
                className={`block border-b border-[#D8D8D3] px-6 py-4 text-sm font-semibold tracking-wide ${
                  isContactActive ? "text-[#111111]" : "text-[#2A2A26]"
                }`}
              >
                CONTACT US
              </Link>
            </nav>
          </div>
        </div>
      ) : null}

      <div className="mx-auto hidden w-full max-w-[1460px] px-4 pb-6 sm:px-6 sm:pb-6 lg:flex lg:h-[180px] lg:items-end lg:justify-center lg:px-8 lg:pb-8">
        <nav className="flex items-center gap-6 overflow-visible pb-2 text-nowrap [scrollbar-width:none] sm:justify-center sm:gap-10 sm:pb-1 lg:gap-12">
          <Link
            href={homeHref}
            className={`text-sm font-semibold tracking-wide ${
              isHomeActive ? "text-[#111111] underline underline-offset-[6px]" : "text-[#2A2A26] hover:underline hover:underline-offset-[6px]"
            }`}
          >
            HOME
          </Link>

          <div className="group relative">
            <Link
              href={catalogHref}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-1 text-sm font-semibold tracking-wide ${
                isCatalogActive ? "text-[#111111] underline underline-offset-[6px]" : "text-[#2A2A26] hover:underline hover:underline-offset-[6px]"
              }`}
            >
              CATALOG
              <span>+</span>
            </Link>

            <div className="absolute left-0 top-full z-50 hidden w-[240px] pt-3 group-hover:block group-focus-within:block sm:left-1/2 sm:-translate-x-1/2">
              <div className="border border-[#D8D8D3] bg-background p-2 shadow-[0_10px_24px_rgba(20,20,18,0.08)]">
                <Link
                  href={catalogHref}
                  className="block px-3 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#ECECE7]"
                >
                  All products
                </Link>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category}
                      href={`${catalogHref}?category=${encodeURIComponent(category)}`}
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
