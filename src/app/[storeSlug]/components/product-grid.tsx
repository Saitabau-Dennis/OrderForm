"use client"

import Image from "next/image"
import Link from "next/link"
import { storefrontPath } from "@/lib/storefront-path"

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

const NEW_PRODUCT_WINDOW_DAYS = 7
const ABOVE_FOLD_PRODUCT_IMAGE_COUNT = 4

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
  storeSlug,
  mode = "default",
  referenceTime,
}: ProductGridProps) {
  const isRelatedMode = mode === "related"
  const hasProducts = products.length > 0

  return (
    <div id="products">
      {!hasProducts ? (
        <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-[#D8D8D2] px-6 py-20 text-center">
          <p className="text-lg font-semibold text-[#1A1A1A]">No products yet</p>
          <p className="mt-2 max-w-md text-sm text-[#737373]">
            This store is still being curated. Check back soon for new arrivals.
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 ${isRelatedMode ? "lg:grid-cols-4 lg:gap-5" : "lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"}`}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              storeSlug={storeSlug}
              referenceTime={referenceTime}
              prioritizeImage={index < ABOVE_FOLD_PRODUCT_IMAGE_COUNT}
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
  prioritizeImage,
}: {
  product: Product
  currency: string
  storeSlug: string
  referenceTime: string
  prioritizeImage: boolean
}) {
  const description = formatCardDescription(product.description)
  const showNewBadge = isNewProduct(referenceTime, product.createdAt)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-none border border-[#E6E6E1]">
      <Link
        href={storefrontPath(storeSlug, `/catalog/${product.id}`)}
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
              priority={prioritizeImage}
              loading={prioritizeImage ? "eager" : "lazy"}
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
          href={storefrontPath(storeSlug, `/catalog/${product.id}`)}
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
            href={storefrontPath(storeSlug, `/catalog/${product.id}`)}
            className="text-[11px] font-semibold uppercase tracking-wide text-[#575751] underline decoration-[#BDBDB6] underline-offset-4 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 sm:text-xs"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}
