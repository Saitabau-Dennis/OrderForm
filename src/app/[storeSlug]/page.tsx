import { notFound } from "next/navigation";
import Link from "next/link";
import db from "@/lib/db";
import { hasProductOptions } from "@/lib/has-product-options";
import { StoreNavbar } from "./components/store-navbar";
import { StoreHero } from "./components/store-hero";
import { ProductGrid } from "./components/product-grid";
import { StoreFooter } from "./components/store-footer";

const HOMEPAGE_PRODUCTS_LIMIT = 8;

export default async function StorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;

  const store = await db.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) {
    notFound();
  }

  const [featuredProducts, totalAvailableProducts] = await Promise.all([
    db.product.findMany({
      where: { storeId: store.id, isAvailable: true },
      orderBy: { createdAt: "desc" },
      take: HOMEPAGE_PRODUCTS_LIMIT,
    }),
    db.product.count({
      where: { storeId: store.id, isAvailable: true },
    }),
  ]);

  // Serialize Decimal fields to plain numbers for the client component
  const serializedProducts = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
    isAvailable: p.isAvailable,
    hasOptions: hasProductOptions(p),
  }));

  const safeStore = {
    id: store.id,
    name: store.name,
    description: store.description,
    logoUrl: store.logoUrl,
    brandColor: store.brandColor,
    secondaryColor: store.secondaryColor,
    slug: store.slug,
    currency: store.currency,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StoreNavbar store={safeStore} />
      <StoreHero store={safeStore} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-10 md:py-14">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Featured products</h2>
            <p className="text-sm text-[#6D6D67]">
              Showing {Math.min(totalAvailableProducts, HOMEPAGE_PRODUCTS_LIMIT)} of {totalAvailableProducts}
            </p>
          </div>
          <Link
            href={`/${safeStore.slug}/products`}
            className="inline-flex h-10 items-center rounded-none border border-[#DADAD5] px-4 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F4F4F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            View all products
          </Link>
        </div>

        <ProductGrid
          products={serializedProducts}
          currency={safeStore.currency}
          brandColor={safeStore.brandColor}
          storeSlug={safeStore.slug}
        />

        <div className="mt-8 flex justify-center">
          <Link
            href={`/${safeStore.slug}/products`}
            className="inline-flex h-11 items-center rounded-none bg-[#1A1A1A] px-6 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            Browse full catalog
          </Link>
        </div>
      </main>
      <StoreFooter storeName={store.name} />
    </div>
  );
}
