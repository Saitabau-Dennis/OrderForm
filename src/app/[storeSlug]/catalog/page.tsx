import { notFound } from "next/navigation"
import db from "@/lib/db"
import { hasProductOptions } from "@/lib/has-product-options"
import { findStoreBySlug } from "@/lib/store-slug"
import { storefrontPath } from "@/lib/storefront-path"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
import { ProductGrid } from "../components/product-grid"
import { StoreBreadcrumbs } from "../components/store-breadcrumbs"

export default async function AllProductsPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params
  const referenceTime = new Date().toISOString()

  const store = await findStoreBySlug(storeSlug)

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
    createdAt: product.createdAt.toISOString(),
  }))

  const categories = Array.from(
    new Set(
      products
        .map((product) => product.category?.trim() || "")
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))

  const safeStore = {
    name: store.name,
    brandColor: store.brandColor,
    slug: store.slug,
    currency: store.currency,
    categories,
    socialLinks: {
      instagramUrl: store.instagramUrl,
      facebookUrl: store.facebookUrl,
      tiktokUrl: store.tiktokUrl,
      xUrl: store.xUrl,
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreNavbar store={safeStore} />

      <main className="flex-1 w-full px-3 sm:px-5 lg:px-7 py-10 md:py-14">
        <div className="mx-auto w-full max-w-[1500px]">
          <StoreBreadcrumbs
            items={[
              { label: "Home", href: storefrontPath(store.slug) },
              { label: "Catalog" },
            ]}
          />

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
            referenceTime={referenceTime}
          />
        </div>
      </main>

      <StoreFooter
        storeName={store.name}
        socialLinks={safeStore.socialLinks}
      />
    </div>
  )
}
