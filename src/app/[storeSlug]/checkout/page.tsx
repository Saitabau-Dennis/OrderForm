import { notFound } from "next/navigation"
import db from "@/lib/db"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
import { StoreBreadcrumbs } from "../components/store-breadcrumbs"
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

  const categoryRows = await db.product.findMany({
    where: { storeId: store.id, isAvailable: true, category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  })

  const categories = categoryRows
    .map((entry) => entry.category?.trim() || "")
    .filter(Boolean)

  // Serialize delivery zones
  const serializedZones = store.deliveryZones.map((z) => ({
    id: z.id,
    name: z.name,
    price: Number(z.price),
  }))

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
              { label: "Cart", href: `/${store.slug}/cart` },
              { label: "Checkout" },
            ]}
          />

          <h1 className="mb-8 text-2xl font-semibold text-[#1A1A1A] md:mb-10 md:text-3xl">Checkout</h1>

          <CheckoutClient
            storeId={store.id}
            storeSlug={store.slug}
            currency={store.currency}
            deliveryZones={serializedZones}
            brandColor={store.brandColor}
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
