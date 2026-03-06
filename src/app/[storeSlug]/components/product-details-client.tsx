"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { CheckCircle2, ChevronLeft, ChevronRight, Heart, Minus, Plus, Star } from "lucide-react"
import { useStore } from "./store-provider"

type VariantGroup = {
  name: string
  options: string[]
}

type ProductInfo = {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  sizes: string | null
  variants: unknown
  averageRating?: number
  reviewCount?: number
}

type StoreInfo = {
  logoUrl: string | null
  name: string
  brandColor: string
  currency: string
}

function parseVariantGroups(variants: unknown): VariantGroup[] {
  if (!Array.isArray(variants)) return []

  return variants
    .map((item) => {
      if (!item || typeof item !== "object") return null

      const value = item as { name?: unknown; options?: unknown[] }
      if (typeof value.name !== "string" || !Array.isArray(value.options)) return null

      const options = value.options
        .map((option) => {
          if (typeof option === "string") return option.trim()
          if (option && typeof option === "object") {
            const objectOption = option as { value?: unknown; label?: unknown; name?: unknown }
            if (typeof objectOption.value === "string") return objectOption.value.trim()
            if (typeof objectOption.label === "string") return objectOption.label.trim()
            if (typeof objectOption.name === "string") return objectOption.name.trim()
          }
          return ""
        })
        .filter(Boolean)

      if (options.length === 0) return null

      return {
        name: value.name.trim(),
        options: Array.from(new Set(options)),
      }
    })
    .filter((group): group is VariantGroup => Boolean(group))
}

function extractGalleryImages(primaryImage: string | null, variants: unknown): string[] {
  const images: string[] = []

  if (primaryImage) {
    images.push(primaryImage)
  }

  if (Array.isArray(variants)) {
    for (const item of variants) {
      if (!item || typeof item !== "object") continue

      const value = item as { options?: unknown[] }
      if (!Array.isArray(value.options)) continue

      for (const option of value.options) {
        if (option && typeof option === "object") {
          const objectOption = option as { imageUrl?: unknown }
          if (typeof objectOption.imageUrl === "string" && objectOption.imageUrl.trim() !== "") {
            images.push(objectOption.imageUrl)
          }
        }
      }
    }
  }

  return Array.from(new Set(images))
}

export function ProductDetailsClient({ product, store }: { product: ProductInfo; store: StoreInfo }) {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen } = useStore()

  const sizeList = useMemo(
    () => (product.sizes ? product.sizes.split(",").map((value) => value.trim()).filter(Boolean) : []),
    [product.sizes]
  )

  const variantGroups = useMemo(() => {
    const parsedGroups = parseVariantGroups(product.variants)
    const hasSizeGroup = parsedGroups.some((group) => group.name.toLowerCase() === "size")

    if (sizeList.length > 0 && !hasSizeGroup) {
      return [{ name: "Size", options: sizeList }, ...parsedGroups]
    }

    return parsedGroups
  }, [product.variants, sizeList])

  const defaultSelectedOptions = useMemo(
    () =>
      Object.fromEntries(
        variantGroups
          .filter((group) => group.options.length > 0)
          .map((group) => [group.name, group.options[0]])
      ),
    [variantGroups]
  )

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(defaultSelectedOptions)

  const galleryImages = useMemo(
    () => extractGalleryImages(product.imageUrl, product.variants),
    [product.imageUrl, product.variants]
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const activeImage = galleryImages[activeImageIndex] || null

  const isWishlisted = wishlist.includes(product.id)
  const [quantity, setQuantity] = useState(1)

  const selectedVariantLabel = Object.entries(selectedOptions)
    .filter(([, value]) => Boolean(value))
    .map(([name, value]) => `${name}: ${value}`)
    .join(" / ")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: store.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const averageRating = Number(product.averageRating || 0)
  const reviewCount = Number(product.reviewCount || 0)
  const hasRatings = reviewCount > 0

  const description = product.description?.trim() || ""
  const hasRichTextDescription = description.includes("<") && description.includes(">")

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return
    setActiveImageIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1))
  }

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return
    setActiveImageIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1))
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      variant: selectedVariantLabel || null,
      quantity,
    })
    setIsCartOpen(true)
    toast.success(`${product.name} added to cart`)
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
    toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist")
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-7 pb-24 md:grid-cols-[0.9fr_1.05fr] md:gap-9 md:pb-0">
      <div className="space-y-3 md:sticky md:top-20 md:max-w-[430px] md:self-start">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#E7E7E2] bg-[#EEECEA]">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-[#AAAAAA]">
              {store.logoUrl ? (
                <Image
                  src={store.logoUrl}
                  alt={`${store.name} logo`}
                  width={60}
                  height={60}
                  className="rounded-md object-cover opacity-50"
                />
              ) : null}
              <p className="text-xs uppercase tracking-[0.2em]">No product image</p>
            </div>
          )}

          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Show previous image"
                className="absolute left-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Show next image"
                className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>

        {galleryImages.length > 1 ? (
          <div className="grid grid-cols-5 gap-1.5">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border transition ${
                  activeImageIndex === index ? "border-[#1A1A1A]" : "border-[#E2E2DD]"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2`}
                aria-label={`Show image ${index + 1}`}
              >
                <Image src={image} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <div className="mb-5">
          {product.category ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E68]">{product.category}</p>
          ) : null}

          <h1 className="text-xl font-semibold leading-tight tracking-tight text-[#2D2D2A] md:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <p className="text-lg font-bold text-[#1A1A1A] md:text-xl">{formatPrice(product.price)}</p>
            <span className="h-1 w-1 rounded-full bg-[#C6C6C1]" />
            <div className="flex items-center gap-1 text-[#666661]">
              <Star className={`h-4 w-4 ${hasRatings ? "fill-[#F5B100] text-[#F5B100]" : "text-[#B6B6AF]"}`} />
              <span className="text-sm font-medium">
                {hasRatings ? `${averageRating.toFixed(1)} (${reviewCount})` : "No reviews yet"}
              </span>
            </div>
          </div>
        </div>

        {variantGroups.length > 0 ? (
          <div className="space-y-4 border-y border-[#E8E8E5] py-4">
            {variantGroups.map((group) => (
              <div key={group.name}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6A6A65]">{group.name}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const isSelected = selectedOptions[group.name] === option

                    return (
                      <button
                        key={`${group.name}-${option}`}
                        type="button"
                        onClick={() =>
                          setSelectedOptions((current) => ({
                            ...current,
                            [group.name]: option,
                          }))
                        }
                        aria-pressed={isSelected}
                        className={`inline-flex h-9 items-center rounded-lg border px-2.5 text-sm font-medium transition-colors ${
                          isSelected
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                            : "border-[#D9D9D4] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]"
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex items-center gap-3">
          <div className="inline-flex h-10 items-center rounded-lg border border-[#D9D9D4] bg-white px-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded text-[#666661] transition-colors hover:bg-[#F3F3F0] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold text-[#1A1A1A]" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((current) => current + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded text-[#666661] transition-colors hover:bg-[#F3F3F0] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-[#1A1A1A] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
            aria-pressed={isWishlisted}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
              isWishlisted
                ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                : "border-[#D9D9D4] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* <div className="mt-6 grid grid-cols-1 gap-2 rounded-xl border border-[#E8E8E5] bg-[#FAFAF8] p-4 sm:grid-cols-3">
          <TrustItem icon={Truck} title="Fast delivery" description="1-3 business days in most areas" />
          <TrustItem icon={Undo2} title="Easy returns" description="Returns accepted within 14 days" />
          <TrustItem icon={ShieldCheck} title="Secure checkout" description="Protected order processing" />
        </div> */}

        <div className="mt-6 space-y-4">
          <section className="rounded-xl border border-[#E8E8E5] bg-white p-4">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Product Details</h2>
            {description ? (
              hasRichTextDescription ? (
                <div
                  className="prose prose-sm mt-2.5 max-w-none text-[#4A4A4A]"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className="mt-2.5 text-sm leading-relaxed text-[#4A4A4A]">{description}</p>
              )
            ) : (
              <p className="mt-2.5 text-sm leading-relaxed text-[#696963]">
                Designed and curated by {store.name} with quality and everyday use in mind.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-[#E8E8E5] bg-white p-4">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Shipping & Returns</h2>
            <ul className="mt-2.5 space-y-2 text-sm text-[#4A4A4A]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1A1A1A]" />
                Orders are processed within 24 hours after confirmation.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1A1A1A]" />
                Delivery timelines may vary based on your selected area.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1A1A1A]" />
                Returns are accepted within 14 days for unused items in original condition.
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-[#E8E8E5] bg-white p-4">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Customer Reviews</h2>
            {hasRatings ? (
              <p className="mt-2.5 text-sm text-[#4A4A4A]">
                Rated <span className="font-semibold">{averageRating.toFixed(1)} / 5</span> from {reviewCount} verified reviews.
              </p>
            ) : (
              <p className="mt-2.5 text-sm text-[#696963]">
                No reviews yet. Be the first customer to share your experience after purchase.
              </p>
            )}
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#DEDED8] bg-white/95 p-3 backdrop-blur-sm md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-[#6F6F69]">{selectedVariantLabel || "Selected item"}</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">
              {formatPrice(product.price)} x {quantity}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="ml-auto inline-flex h-11 items-center justify-center rounded-lg bg-[#1A1A1A] px-5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
