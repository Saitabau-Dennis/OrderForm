"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from "lucide-react"
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
  stock?: number | null
  optionStocks?: Array<{ optionValue: string; stock: number }>
  imageUrl: string | null
  galleryImages?: unknown
  category: string | null
  sizes: string | null
  variants: unknown
}

type StoreInfo = {
  name: string
  brandColor: string
  currency: string
}

// Parses flexible variant JSON from DB/editor into a UI-safe structure.
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

// Builds a deduplicated gallery from primary image, gallery array, and variant images.
function extractGalleryImages(primaryImage: string | null, galleryImages: unknown, variants: unknown): string[] {
  const images: string[] = []

  if (primaryImage) {
    images.push(primaryImage)
  }

  if (Array.isArray(galleryImages)) {
    for (const image of galleryImages) {
      if (typeof image === "string" && image.trim() !== "") {
        images.push(image)
      }
    }
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
  const { addToCart, wishlist, toggleWishlist, showActionModal } = useStore()

  const sizeList = useMemo(
    () => (product.sizes ? product.sizes.split(",").map((value) => value.trim()).filter(Boolean) : []),
    [product.sizes]
  )

  const variantGroups = useMemo(() => {
    const parsedGroups = parseVariantGroups(product.variants)
    const hasSizeGroup = parsedGroups.some((group) =>
      group.name.toLowerCase().includes("size")
    )

    // Backfill "Size" options from legacy comma-separated sizes when variants omit it.
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
    () => extractGalleryImages(product.imageUrl, product.galleryImages, product.variants),
    [product.imageUrl, product.galleryImages, product.variants]
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const activeImage = galleryImages[activeImageIndex] || null

  const isWishlisted = wishlist.includes(product.id)
  const [quantity, setQuantity] = useState(1)
  const globalStock = typeof product.stock === "number" && Number.isFinite(product.stock)
    ? Math.max(0, Math.trunc(product.stock))
    : null

  const selectedVariantLabel = Object.entries(selectedOptions)
    .filter(([, value]) => Boolean(value))
    .map(([name, value]) => `${name}: ${value}`)
    .join(" / ")

  const optionStockMap = useMemo(
    () =>
      new Map(
        (product.optionStocks || []).map((row) => [row.optionValue.trim().toLowerCase(), row.stock])
      ),
    [product.optionStocks]
  )
  const selectedOptionStockValues = Object.values(selectedOptions)
    .map((value) => optionStockMap.get(value.trim().toLowerCase()))
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
  const selectedOptionStock = selectedOptionStockValues.length > 0 ? Math.min(...selectedOptionStockValues) : null
  const effectiveStock = selectedOptionStock ?? globalStock
  const canPurchase = effectiveStock === null ? true : effectiveStock > 0
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: store.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const description = product.description?.trim() || ""
  // Rich text entered in dashboard is stored as HTML.
  const hasRichTextDescription = description.includes("<") && description.includes(">")

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return
    setActiveImageIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1))
  }

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return
    setActiveImageIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1))
  }

  const addItemToCart = () => {
    if (!canPurchase) return

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      variant: selectedVariantLabel || null,
      quantity,
    })
    showActionModal({
      type: "cart",
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
    })
  }

  const handleAddToCart = () => addItemToCart()
  const handleBuyNow = () => addItemToCart()

  const handleToggleWishlist = () => {
    const nextIsWishlisted = !isWishlisted
    toggleWishlist(product.id)
    if (nextIsWishlisted) {
      showActionModal({
        type: "wishlist",
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        category: product.category,
      })
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-start gap-9 pb-24 lg:grid-cols-[minmax(0,56%)_minmax(0,44%)] lg:gap-8 lg:pb-0">
      <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
        <div className="mx-auto w-full max-w-[620px]">
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#DADAD4] bg-white">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 56vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-[#AAAAAA]">
              <p className="text-xs uppercase tracking-[0.2em]">No product image</p>
            </div>
          )}

          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Show previous image"
                className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Show next image"
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}
          </div>
        </div>

        {galleryImages.length > 1 ? (
          <div className="mx-auto grid w-full max-w-[620px] grid-cols-5 gap-2 sm:grid-cols-6">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`relative aspect-square overflow-hidden border transition ${
                  activeImageIndex === index
                    ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A]"
                    : "border-[#E2E2DD] hover:border-[#BEBEB8]"
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
        <div className="border-b border-[#DEDED8] pb-6">
          {product.category ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E68]">{product.category}</p>
          ) : null}

          <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-[#171715] md:text-5xl">
            {product.name}
          </h1>

          {description ? (
            hasRichTextDescription ? (
              <div
                className="prose prose-sm mt-3 max-w-none text-[#4A4A4A]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[#4A4A4A]">{description}</p>
            )
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-[#696963]">
              Designed and curated by {store.name} with quality and everyday use in mind.
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <p className="text-2xl font-medium text-[#1A1A1A]">{formatPrice(product.price)}</p>
          </div>
          <p className="mt-2 text-sm text-[#696963]">
            {selectedOptionStock !== null
              ? `${selectedOptionStock.toLocaleString()} available for selected option`
              : globalStock !== null
                ? (canPurchase ? `${globalStock.toLocaleString()} in stock` : "Out of stock")
                : "Available"}
          </p>
        </div>

        {variantGroups.length > 0 ? (
          <div className="space-y-4 border-b border-[#DEDED8] py-6">
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
                        className={`inline-flex h-9 items-center border px-2.5 text-sm font-medium transition-colors ${
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

        <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-[#DEDED8] pb-6">
          <div className="inline-flex h-10 items-center border border-[#D9D9D4] bg-white px-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="inline-flex h-8 w-8 items-center justify-center text-[#666661] transition-colors hover:bg-[#F3F3F0] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold text-[#1A1A1A]" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() =>
                setQuantity((current) => {
                  if (!canPurchase) return 1
                  if (effectiveStock === null) return current + 1
                  return Math.min(effectiveStock, current + 1)
                })
              }
              disabled={!canPurchase || (effectiveStock !== null && quantity >= effectiveStock)}
              className="inline-flex h-8 w-8 items-center justify-center text-[#666661] transition-colors hover:bg-[#F3F3F0] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canPurchase}
            className="inline-flex h-10 min-w-[170px] items-center justify-center bg-[#1A1A1A] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            Add to Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!canPurchase}
            className="inline-flex h-10 min-w-[130px] items-center justify-center border border-[#1A1A1A] bg-transparent px-5 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F4F4F0] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            Buy Now
          </button>

          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
            aria-pressed={isWishlisted}
            className={`inline-flex h-10 items-center justify-center gap-2 border px-4 text-sm font-medium transition-colors ${
              isWishlisted
                ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                : "border-[#D9D9D4] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-white" : ""}`} />
            <span>{isWishlisted ? "Added to wishlist" : "Add to wishlist"}</span>
          </button>
        </div>

        <div className="mt-6 space-y-6" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#DEDED8] bg-white/95 p-3 backdrop-blur-sm md:hidden">
        <div className="flex w-full items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-[#6F6F69]">{selectedVariantLabel || "Selected item"}</p>
            <p className="text-sm font-semibold text-[#1A1A1A]">
              {formatPrice(product.price)} x {quantity}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canPurchase}
            className="ml-auto inline-flex h-11 items-center justify-center bg-[#1A1A1A] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
