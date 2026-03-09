type ProductOptionsInput = {
  sizes: string | null
  variants: unknown
}

// Returns true when either comma-separated sizes or structured variant options exist.
export function hasProductOptions(product: ProductOptionsInput): boolean {
  const hasSizes =
    typeof product.sizes === "string" &&
    product.sizes
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean).length > 0

  if (hasSizes) return true

  if (!Array.isArray(product.variants)) return false

  return product.variants.some((variant) => {
    if (!variant || typeof variant !== "object") return false

    const candidate = variant as { options?: unknown[] }
    return Array.isArray(candidate.options) && candidate.options.length > 0
  })
}
