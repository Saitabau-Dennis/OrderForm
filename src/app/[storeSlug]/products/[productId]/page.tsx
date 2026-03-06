import { notFound } from "next/navigation"
import db from "@/lib/db"
import { hasProductOptions } from "@/lib/has-product-options"
import { StoreNavbar } from "../../components/store-navbar"
import { StoreFooter } from "../../components/store-footer"
import { ProductDetailsClient } from "../../components/product-details-client"
import { ProductGrid } from "../../components/product-grid"

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

  const product = await db.product.findUnique({
    where: { id: productId, storeId: store.id },
  })

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <StoreNavbar store={store} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-10 md:py-16">
        {/* Upper: Product Details */}
        <ProductDetailsClient key={serializedProduct.id} product={serializedProduct} store={store} />

        {/* Lower: You May Also Like */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-lg md:text-xl font-bold text-[#2D2D2A] mb-6">
            You may also like
          </h2>
          {serializedRelatedProducts.length > 0 ? (
            <ProductGrid
              products={serializedRelatedProducts}
              currency={store.currency}
              brandColor={store.brandColor}
              storeSlug={store.slug}
            />
          ) : (
            <p className="text-[#737373] text-[13px]">No related products at this time.</p>
          )}
        </div>
      </main>

      <StoreFooter storeName={store.name} />
    </div>
  )
}
