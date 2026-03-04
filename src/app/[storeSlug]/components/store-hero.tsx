import { StoreTextHighlight } from "./store-text-highlight"

type StoreHeroProps = {
  store: {
    name: string
    description: string | null
    brandColor: string
    secondaryColor: string
    slug: string
  }
}

export function StoreHero({ store }: StoreHeroProps) {
  const brandColor = store.brandColor || "#1A1A1A"

  const defaultDescription = `Welcome to ${store.name}. Discover carefully curated products, made to feel effortless to browse, compare, and buy in minutes.`

  const displayDescription = store.description && store.description.trim() !== ""
    ? store.description
    : defaultDescription

  return (
    <section className="w-full bg-[#F7F7F5] px-4 py-14 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: brandColor }}>
          Curated Storefront
        </p> */}
        <h1 className="max-w-4xl text-2xl font-semibold leading-[1.08] tracking-tight text-[#1A1A1A] md:text-4xl">
          {store.name}
        </h1>
        <p className="mt-6 max-w-4xl text-xl font-medium leading-relaxed text-[#31312D] md:text-3xl">
          <StoreTextHighlight text={displayDescription} highlightColor={brandColor} />
        </p>

        <div className="mt-8">
          <a
            href="#products"
            className="inline-flex h-12 items-center rounded-xl px-6 text-base font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            style={{ backgroundColor: brandColor }}
          >
            Shop now
          </a>
        </div>
      </div>
    </section>
  )
}
