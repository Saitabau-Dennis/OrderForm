import { notFound } from "next/navigation"
import db from "@/lib/db"
import { findStoreBySlug } from "@/lib/store-slug"
import { storefrontPath } from "@/lib/storefront-path"
import { StoreNavbar } from "../components/store-navbar"
import { StoreFooter } from "../components/store-footer"
import { StoreBreadcrumbs } from "../components/store-breadcrumbs"

export default async function ContactPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>
}) {
  const { storeSlug } = await params

  const store = await findStoreBySlug(storeSlug)

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

  const primaryPhone = store.contactPhone?.trim() || store.whatsappNumber?.trim() || ""
  const primaryEmail = store.contactEmail?.trim() || ""
  const primaryAddress = store.contactAddress?.trim() || "Not provided"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreNavbar store={safeStore} />

      <main className="flex-1 w-full px-3 py-12 sm:px-5 lg:px-7 md:py-16">
        <div className="mx-auto w-full max-w-[1500px]">
          <StoreBreadcrumbs
            items={[
              { label: "Home", href: storefrontPath(store.slug) },
              { label: "Contact" },
            ]}
          />

          <div className="grid items-start gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
          <aside className="pt-0 lg:pt-[84px]">
            <div className="border-t border-[#D8D8D3] py-8">
              <p className="text-[18px] leading-none text-[#151513] sm:text-[22px]">WHATSAPP</p>
              {primaryPhone ? (
                <a href={`tel:${primaryPhone}`} className="mt-3 block break-words text-[16px] leading-snug text-[#6D6D67] hover:underline">
                  {primaryPhone}
                </a>
              ) : (
                <p className="mt-3 text-[16px] leading-snug text-[#6D6D67]">Not provided</p>
              )}
            </div>

            <div className="border-t border-[#D8D8D3] py-8">
              <p className="text-[18px] leading-none text-[#151513] sm:text-[22px]">EMAIL US</p>
              {primaryEmail ? (
                <a
                  href={`mailto:${primaryEmail}`}
                  className="mt-3 block break-all text-[16px] leading-snug text-[#6D6D67] hover:underline"
                >
                  {primaryEmail}
                </a>
              ) : (
                <p className="mt-3 text-[16px] leading-snug text-[#6D6D67]">Not provided</p>
              )}
            </div>

            <div className="border-y border-[#D8D8D3] py-8">
              <p className="text-[18px] leading-none text-[#151513] sm:text-[22px]">ADDRESS</p>
              <p className="mt-3 break-words text-[16px] leading-snug text-[#6D6D67]">{primaryAddress}</p>
            </div>
          </aside>

          <section className="max-w-[1250px]">
            <h1 className="text-[34px] leading-none text-[#151513] sm:text-[44px] lg:text-[54px]">GET IN TOUCH</h1>

            <form className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Name*"
                  className="h-14 w-full border border-[#D0D0CB] bg-transparent px-4 text-sm text-[#1A1A1A] placeholder:text-[#74746E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                />
                <input
                  type="tel"
                  placeholder="Phone Number*"
                  className="h-14 w-full border border-[#D0D0CB] bg-transparent px-4 text-sm text-[#1A1A1A] placeholder:text-[#74746E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                />
                <input
                  type="email"
                  placeholder="Email*"
                  className="h-14 w-full border border-[#D0D0CB] bg-transparent px-4 text-sm text-[#1A1A1A] placeholder:text-[#74746E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
                />
              </div>

              <textarea
                rows={8}
                placeholder="Message"
                className="w-full resize-none border border-[#D0D0CB] bg-transparent p-4 text-sm text-[#1A1A1A] placeholder:text-[#74746E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
              />

              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center border border-[#111111] px-6 text-base font-semibold tracking-wide text-[#111111] transition-colors hover:bg-[#ECECE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 sm:h-14 sm:w-auto sm:min-w-[260px] sm:px-8 sm:text-lg"
              >
                SEND MESSAGE
              </button>
            </form>
          </section>
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
