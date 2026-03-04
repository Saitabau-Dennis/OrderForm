import { notFound } from "next/navigation"
import db from "@/lib/db"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
import { CheckoutClient } from "../components/checkout-client"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params

  const store = await db.store.findUnique({
    where: { slug: storeSlug },
    include: {
      deliveryZones: true,
    }
  })

  if (!store) {
    notFound()
  }

  // Serialize delivery zones
  const serializedZones = store.deliveryZones.map((z) => ({
    id: z.id,
    name: z.name,
    price: Number(z.price),
  }))

  const safeStore = {
    name: store.name,
    logoUrl: store.logoUrl,
    brandColor: store.brandColor,
    slug: store.slug,
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <StoreNavbar store={safeStore} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8 md:mb-12">
          Checkout
        </h1>

        <CheckoutClient
          storeId={store.id}
          storeSlug={store.slug}
          currency={store.currency}
          deliveryZones={serializedZones}
          brandColor={store.brandColor}
        />
      </main>

      <StoreFooter storeName={store.name} />
    </div>
  )
}
