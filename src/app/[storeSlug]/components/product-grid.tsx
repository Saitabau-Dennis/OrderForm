"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react"

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  isAvailable: boolean
  hasOptions?: boolean
  createdAt?: string
}

type ProductGridProps = {
  products: Product[]
  currency: string
  brandColor: string
  storeSlug: string
  mode?: "default" | "related"
  referenceTime: string
}

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc"

const NEW_PRODUCT_WINDOW_DAYS = 7

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `${currency} ${price.toLocaleString()}`
  }
}

function formatCardDescription(description: string | null): string {
  if (!description) return ""

  return description
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function isNewProduct(referenceTime: string, createdAt?: string): boolean {
  if (!createdAt) return false

  const postedAt = new Date(createdAt)
  if (Number.isNaN(postedAt.getTime())) return false

  const comparedAt = new Date(referenceTime)
  if (Number.isNaN(comparedAt.getTime())) return false

  const ageInMs = comparedAt.getTime() - postedAt.getTime()
  return ageInMs >= 0 && ageInMs <= NEW_PRODUCT_WINDOW_DAYS * 24 * 60 * 60 * 1000
}

export function ProductGrid({
  products,
  currency,
  brandColor,
  storeSlug,
  mode = "default",
  referenceTime,
}: ProductGridProps) {
  const isRelatedMode = mode === "related"
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get("query") || ""
  const activeCategory = searchParams.get("category") || "All"
  const sort = (searchParams.get("sort") as SortOption) || "featured"

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    return params.toString()
  }

  const setQuery = (newQuery: string) => {
    router.replace(`${pathname}?${createQueryString("query", newQuery)}`, { scroll: false })
  }

  const setActiveCategory = (newCategory: string) => {
    router.replace(
      `${pathname}?${createQueryString("category", newCategory === "All" ? "" : newCategory)}`,
      { scroll: false }
    )
  }

  const setSort = (newSort: SortOption) => {
    router.replace(`${pathname}?${createQueryString("sort", newSort === "featured" ? "" : newSort)}`, {
      scroll: false,
    })
  }

  const categories = useMemo(() => {
    const counts = new Map<string, number>()

    for (const product of products) {
      const key = product.category?.trim() || "Uncategorized"
      counts.set(key, (counts.get(key) || 0) + 1)
    }

    return [
      { name: "All", count: products.length },
      ...Array.from(counts.entries()).map(([name, count]) => ({ name, count })),
    ]
  }, [products])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      const normalizedCategory = product.category?.trim() || "Uncategorized"
      const normalizedDescription = formatCardDescription(product.description).toLowerCase()
      const matchesCategory =
        activeCategory === "All" || normalizedCategory === activeCategory
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        normalizedDescription.includes(normalizedQuery) ||
        normalizedCategory.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [products, activeCategory, query])

  const filteredAndSorted = useMemo(() => {
    const sorted = [...filtered]

    switch (sort) {
      case "newest":
        sorted.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return bTime - aTime
        })
        break
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return sorted
  }, [filtered, sort])

  const hasActiveFilters = query.trim().length > 0 || activeCategory !== "All" || sort !== "featured"
  const hasProducts = products.length > 0
  const visibleProducts = isRelatedMode ? products : filteredAndSorted

  const clearFilters = () => {
    router.replace(pathname, { scroll: false })
  }

  return (
    <div id="products">
      {!isRelatedMode ? (
        <div className="mb-8 space-y-5 md:mb-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-lg">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D8D88]" />
              <span
                aria-hidden="true"
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#6C6C66] sm:inline-flex"
              >
                Search
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, category or keyword..."
                className="h-12 w-full rounded-none border border-[#DFDFDA] bg-transparent pl-11 pr-4 text-sm text-[#1A1A1A] placeholder:text-[#8D8D88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
                style={{ "--tw-ring-color": `${brandColor}66` } as { [key: string]: string }}
              />
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 self-start sm:w-auto md:self-auto">
              <div className="inline-flex h-11 items-center gap-2 rounded-none border border-[#DFDFDA] px-3 text-[11px] font-semibold uppercase tracking-wide text-[#666661] sm:text-xs">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort
              </div>
              <div className="relative min-w-[180px] flex-1 sm:flex-none">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-11 w-full appearance-none rounded-none border border-[#DFDFDA] bg-transparent px-4 pr-10 text-sm font-medium text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2"
                  style={{ "--tw-ring-color": `${brandColor}66` } as { [key: string]: string }}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7A73]" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                aria-pressed={activeCategory === cat.name}
                className="inline-flex h-9 max-w-full items-center gap-2 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 sm:px-4 sm:text-sm"
                style={
                  activeCategory === cat.name
                    ? {
                        color: brandColor,
                        borderColor: `${brandColor}66`,
                      }
                    : {
                        color: "#575751",
                        borderColor: "#DFDFDA",
                      }
                }
              >
                <span className="truncate">{cat.name}</span>
                <span className="rounded-none px-1.5 py-0.5 text-[11px]">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#666661]" aria-live="polite">
              Showing <span className="font-semibold text-[#1A1A1A]">{filteredAndSorted.length}</span> of{" "}
              <span className="font-semibold text-[#1A1A1A]">{products.length}</span> products
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium underline decoration-[#B0B0AA] underline-offset-4 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Product Grid */}
      {!hasProducts ? (
        <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-[#D8D8D2] px-6 py-20 text-center">
          <p className="text-lg font-semibold text-[#1A1A1A]">No products yet</p>
          <p className="mt-2 max-w-md text-sm text-[#737373]">
            This store is still being curated. Check back soon for new arrivals.
          </p>
        </div>
      ) : !isRelatedMode && filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-[#D8D8D2] px-6 py-20 text-center">
          <p className="text-lg font-semibold text-[#1A1A1A]">No matches found</p>
          <p className="mt-2 max-w-md text-sm text-[#737373]">
            Try a different keyword or change the category and sort options.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 inline-flex h-10 items-center rounded-none px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            style={{ backgroundColor: "var(--store-brand, #1A1A1A)" }}
          >
            Reset discovery
          </button>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 ${isRelatedMode ? "lg:grid-cols-4 lg:gap-5" : "lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"}`}>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              storeSlug={storeSlug}
              referenceTime={referenceTime}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({
  product,
  currency,
  storeSlug,
  referenceTime,
}: {
  product: Product
  currency: string
  storeSlug: string
  referenceTime: string
}) {
  const description = formatCardDescription(product.description)
  const showNewBadge = isNewProduct(referenceTime, product.createdAt)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-none border border-[#E6E6E1]">
      <Link
        href={`/${storeSlug}/products/${product.id}`}
        className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-inset"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#EEECEA] sm:aspect-[4/5]">
          {showNewBadge ? (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-none border border-white/70 bg-[#1A1A1A] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-sm">
              New
            </span>
          ) : null}
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1400px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.2em] text-[#AAAAAA]">No image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link
          href={`/${storeSlug}/products/${product.id}`}
          className="space-y-2 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
        >
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-[#2D2D2A] sm:text-[15px]">
            {product.name}
          </h3>
          {description ? (
            <p className="line-clamp-2 text-[12px] leading-relaxed text-[#6F6F69] sm:text-[13px]">
              {description}
            </p>
          ) : null}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-sm font-bold text-[#1A1A1A] sm:text-base">
            {formatPrice(product.price, currency)}
          </p>
          <Link
            href={`/${storeSlug}/products/${product.id}`}
            className="text-[11px] font-semibold uppercase tracking-wide text-[#575751] underline decoration-[#BDBDB6] underline-offset-4 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 sm:text-xs"
          >
            Details
          </Link>
        </div>

      </div>
    </article>
  )
}
