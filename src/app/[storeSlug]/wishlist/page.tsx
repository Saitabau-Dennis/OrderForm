import { notFound } from "next/navigation"
import db from "@/lib/db"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
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
    }
  })

  // Serialize Decimal
  const serializedProducts = allProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }))

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <StoreNavbar store={store} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8 md:mb-12">
          Your Wishlist
        </h1>

        <WishlistClient
          storeSlug={store.slug}
          currency={store.currency}
          allProducts={serializedProducts}
          brandColor={store.brandColor}
        />
      </main>

      <StoreFooter storeName={store.name} />
    </div>
  )
}
