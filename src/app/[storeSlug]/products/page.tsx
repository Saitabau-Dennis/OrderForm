import { notFound } from "next/navigation"
import db from "@/lib/db"
import { hasProductOptions } from "@/lib/has-product-options"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
import { ProductGrid } from "../components/product-grid"

export default async function AllProductsPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params

  const store = await db.store.findUnique({
    where: { slug: storeSlug },
  })

  if (!store) {
    notFound()
  }

  const products = await db.product.findMany({
    where: { storeId: store.id, isAvailable: true },
    orderBy: { createdAt: "desc" },
  })

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    category: product.category,
    isAvailable: product.isAvailable,
    hasOptions: hasProductOptions(product),
  }))

  const safeStore = {
    name: store.name,
    logoUrl: store.logoUrl,
    brandColor: store.brandColor,
    slug: store.slug,
    currency: store.currency,
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <StoreNavbar store={safeStore} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-10 md:py-14">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1A1A1A]">All Products</h1>
          <p className="mt-1 text-sm text-[#6D6D67]">
            Browse the full catalog from {store.name}. {serializedProducts.length} item
            {serializedProducts.length === 1 ? "" : "s"} available.
          </p>
        </div>

        <ProductGrid
          products={serializedProducts}
          currency={safeStore.currency}
          brandColor={safeStore.brandColor}
          storeSlug={safeStore.slug}
        />
      </main>

      <StoreFooter storeName={store.name} />
    </div>
  )
}
