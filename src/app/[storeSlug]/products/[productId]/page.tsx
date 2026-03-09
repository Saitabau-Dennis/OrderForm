import { notFound } from "next/navigation"
import db from "@/lib/db"
import { hasProductOptions } from "@/lib/has-product-options"
import { StoreNavbar } from "../../components/store-navbar"
import { StoreFooter } from "../../components/store-footer"
import { ProductDetailsClient } from "../../components/product-details-client"
import { ProductGrid } from "../../components/product-grid"

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productId: string }>
}) {
  const { storeSlug, productId } = await params

  // 1. Fetch store and product
  const store = await db.store.findUnique({
    where: { slug: storeSlug },
  })

  if (!store) {
    notFound()
  }

  let product = await db.product.findFirst({
    where: { id: productId, storeId: store.id },
  })

  // Backward compatibility: support slug-like product URLs (e.g. /products/beanie-hat-beige)
  if (!product) {
    const requestedSlug = decodeURIComponent(productId)
    const productsForSlugMatch = await db.product.findMany({
      where: { storeId: store.id, isAvailable: true },
      select: { id: true, name: true },
      take: 200,
    })

    const matched = productsForSlugMatch.find((item) => slugify(item.name) === requestedSlug)
    if (matched) {
      product = await db.product.findFirst({
        where: { id: matched.id, storeId: store.id },
      })
    }
  }

  if (!product) {
    notFound()
  }

  // Serialize Decimal to number since we're passing it to a Client Component
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    // Ensure JSON variant fields are typed correctly (handled in the client component)
  }

  // 2. Fetch strictly related products: same category only (no random fallback)
  const normalizedCategory = product.category?.trim() || null
  const relatedProducts = normalizedCategory
    ? await db.product.findMany({
        where: {
          storeId: store.id,
          isAvailable: true,
          id: { not: product.id },
          category: normalizedCategory,
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      })
    : []

  const serializedRelatedProducts = relatedProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    hasOptions: hasProductOptions(p),
  }))

  const categoryRows = await db.product.findMany({
    where: { storeId: store.id, isAvailable: true, category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  })

  const categories = categoryRows
    .map((entry) => entry.category?.trim() || "")
    .filter(Boolean)

  const safeStore = {
    name: store.name,
    brandColor: store.brandColor,
    slug: store.slug,
    categories,
    socialLinks: {
      instagramUrl: store.instagramUrl,
      facebookUrl: store.facebookUrl,
      tiktokUrl: store.tiktokUrl,
      xUrl: store.xUrl,
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <StoreNavbar store={safeStore} />

      <main className="flex-1 w-full px-3 py-10 sm:px-5 lg:px-7 md:py-16">
        <div className="mx-auto w-full max-w-[1500px]">
          {/* Upper: Product Details */}
          <ProductDetailsClient key={serializedProduct.id} product={serializedProduct} store={store} />

          {/* Lower: You May Also Like */}
          <div className="mt-14 border-t border-[#DEDED8] pt-10 md:mt-16 md:pt-12">
            <h2 className="mb-2 text-2xl font-medium text-[#2D2D2A] md:text-xl">You may also like</h2>
            <p className="mb-7 text-sm text-[#6D6D67]">More picks curated from this collection.</p>
            {serializedRelatedProducts.length > 0 ? (
              <ProductGrid
                products={serializedRelatedProducts}
                currency={store.currency}
                brandColor={store.brandColor}
                storeSlug={store.slug}
                mode="related"
              />
            ) : (
              <p className="text-[13px] text-[#737373]">No related products at this time.</p>
            )}
          </div>
        </div>
      </main>

      <StoreFooter
        storeName={store.name}
        socialLinks={safeStore.socialLinks}
      />
    </div>
  )
}
