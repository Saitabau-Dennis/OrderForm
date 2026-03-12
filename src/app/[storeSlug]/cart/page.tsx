import { notFound } from "next/navigation"
import Link from "next/link"
import db from "@/lib/db"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
import { CartClient } from "../components/cart-client"

export default async function CartPage({
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

  const [products, categoryRows] = await Promise.all([
    db.product.findMany({
      where: { storeId: store.id, isAvailable: true },
      select: { id: true, category: true },
    }),
    db.product.findMany({
      where: { storeId: store.id, isAvailable: true, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
  ])

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

      <main className="flex-1 w-full px-3 py-10 sm:px-5 lg:px-7 md:py-14">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-[30px] font-medium tracking-wide text-[#111111] md:text-[36px]">Your cart</h1>
            <Link
              href={`/${store.slug}/catalog`}
              className="text-base underline underline-offset-4 text-[#1A1A1A] hover:text-[#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 md:text-lg"
            >
              Continue shopping
            </Link>
          </div>

          <CartClient
            storeSlug={store.slug}
            currency={store.currency}
            productMeta={products}
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
