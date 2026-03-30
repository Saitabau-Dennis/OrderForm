import { notFound } from "next/navigation"
import db from "@/lib/db"
import { hasProductOptions } from "@/lib/has-product-options"
import { findStoreBySlug } from "@/lib/store-slug"
import { storefrontPath } from "@/lib/storefront-path"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
import { ProductGrid } from "../components/product-grid"
import { StoreBreadcrumbs } from "../components/store-breadcrumbs"
import { CatalogFilters } from "../components/catalog-filters"

export default async function AllProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeSlug: string }>
  searchParams?: Promise<{
    category?: string
    query?: string
    availability?: string
    price?: string
    sort?: string
  }>
}) {
  const { storeSlug } = await params
  const resolvedSearchParams = (await searchParams) ?? {}
  const referenceTime = new Date().toISOString()

  const store = await findStoreBySlug(storeSlug)

  if (!store) {
    notFound()
  }

  const selectedCategory = (resolvedSearchParams.category ?? "").trim()
  const selectedQuery = (resolvedSearchParams.query ?? "").trim()
  const queryTerms = selectedQuery
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)
  const selectedAvailability = ["available", "unavailable", "all"].includes((resolvedSearchParams.availability ?? "").trim())
    ? (resolvedSearchParams.availability ?? "").trim()
    : "available"
  const selectedPrice = ["all", "under-1000", "1000-5000", "above-5000"].includes((resolvedSearchParams.price ?? "").trim())
    ? (resolvedSearchParams.price ?? "").trim()
    : "all"
  const selectedSort = ["alpha-asc", "alpha-desc", "price-asc", "price-desc", "newest"].includes((resolvedSearchParams.sort ?? "").trim())
    ? (resolvedSearchParams.sort ?? "").trim()
    : "alpha-asc"

  const priceFilter =
    selectedPrice === "under-1000"
      ? { lt: 1000 }
      : selectedPrice === "1000-5000"
        ? { gte: 1000, lte: 5000 }
        : selectedPrice === "above-5000"
          ? { gt: 5000 }
          : undefined

  const orderBy =
    selectedSort === "alpha-desc"
      ? { name: "desc" as const }
      : selectedSort === "price-asc"
        ? { price: "asc" as const }
        : selectedSort === "price-desc"
          ? { price: "desc" as const }
          : selectedSort === "newest"
            ? { createdAt: "desc" as const }
            : { name: "asc" as const }

  const [products, categoryRows] = await Promise.all([
    db.product.findMany({
      where: {
        storeId: store.id,
        ...(selectedAvailability === "all"
          ? {}
          : {
              isAvailable: selectedAvailability === "available",
            }),
        ...(selectedCategory
          ? {
              category: {
                equals: selectedCategory,
                mode: "insensitive",
              },
            }
          : {}),
        ...(selectedQuery
          ? {
              AND: queryTerms.map((term) => ({
                OR: [
                  {
                    name: {
                      contains: term,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: term,
                      mode: "insensitive",
                    },
                  },
                  {
                    category: {
                      contains: term,
                      mode: "insensitive",
                    },
                  },
                ],
              })),
            }
          : {}),
        ...(priceFilter ? { price: priceFilter } : {}),
      },
      orderBy,
    }),
    db.product.findMany({
      where: {
        storeId: store.id,
        ...(selectedAvailability === "all"
          ? {}
          : {
              isAvailable: selectedAvailability === "available",
            }),
        category: { not: null },
      },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
  ])

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
      categoryRows
        .map((row) => row.category?.trim() || "")
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
              { label: "Catalog", href: storefrontPath(store.slug, "/catalog") },
              ...(selectedCategory ? [{ label: selectedCategory }] : []),
            ]}
          />

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
              {selectedCategory ? `${selectedCategory} Products` : "All Products"}
            </h1>
            <p className="mt-1 text-sm text-[#6D6D67]">
              {selectedCategory
                ? `Showing ${selectedCategory} products from ${store.name}.`
                : `Browse the full catalog from ${store.name}.`}{" "}
              {serializedProducts.length} item
              {serializedProducts.length === 1 ? "" : "s"} found.
            </p>
          </div>

          <CatalogFilters
            storeSlug={safeStore.slug}
            productCount={serializedProducts.length}
            selectedCategory={selectedCategory}
            selectedQuery={selectedQuery}
            selectedAvailability={selectedAvailability}
            selectedPrice={selectedPrice}
            selectedSort={selectedSort}
          />

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
