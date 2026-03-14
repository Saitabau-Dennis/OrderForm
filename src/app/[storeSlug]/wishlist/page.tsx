import { notFound } from "next/navigation"
import db from "@/lib/db"
import { hasProductOptions } from "@/lib/has-product-options"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
import { StoreBreadcrumbs } from "../components/store-breadcrumbs"
import { WishlistClient } from "../components/wishlist-client"

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params

  // 1. Find store
  const store = await db.store.findUnique({
    where: { slug: storeSlug },
  })

  if (!store) {
    notFound()
  }

  // Fetch all available products so the client can filter by IDs in localStorage
  const allProducts = await db.product.findMany({
    where: { storeId: store.id, isAvailable: true },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
      description: true,
      isAvailable: true,
      sizes: true,
      variants: true,
    }
  })

  // Serialize Decimal
  const serializedProducts = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
    description: p.description,
    isAvailable: p.isAvailable,
    hasOptions: hasProductOptions(p),
  }))

  const categories = Array.from(
    new Set(
      allProducts
        .map((product) => product.category?.trim() || "")
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))

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

      <main className="flex-1 w-full px-3 sm:px-5 lg:px-7 py-10 md:py-16">
        <div className="mx-auto w-full max-w-[1500px]">
          <StoreBreadcrumbs
            items={[
              { label: "Home", href: `/${store.slug}` },
              { label: "Wishlist" },
            ]}
          />

          <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8 md:mb-12">
            Your Wishlist
          </h1>

          <WishlistClient
            storeSlug={store.slug}
            currency={store.currency}
            allProducts={serializedProducts}
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
