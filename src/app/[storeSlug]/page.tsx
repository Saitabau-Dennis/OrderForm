import { notFound } from "next/navigation";
import Link from "next/link";
import db from "@/lib/db";
import { hasProductOptions } from "@/lib/has-product-options";
import { StoreNavbar } from "./components/store-navbar";
import { ProductGrid } from "./components/product-grid";
import { StoreFooter } from "./components/store-footer";

const HOMEPAGE_PRODUCTS_LIMIT = 8;

export default async function StorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;
  const referenceTime = new Date().toISOString();

  const store = await db.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) {
    notFound();
  }

  const [featuredProducts, categoryRows] = await Promise.all([
    db.product.findMany({
      where: { storeId: store.id, isAvailable: true },
      orderBy: { createdAt: "desc" },
      take: HOMEPAGE_PRODUCTS_LIMIT,
    }),
    db.product.findMany({
      where: { storeId: store.id, isAvailable: true, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
  ]);

  const categories = categoryRows
    .map((entry) => entry.category?.trim() || "")
    .filter(Boolean)

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
    createdAt: p.createdAt.toISOString(),
  }));

  const safeStore = {
    id: store.id,
    name: store.name,
    description: store.description,
    brandColor: store.brandColor,
    secondaryColor: store.secondaryColor,
    slug: store.slug,
    currency: store.currency,
    categories,
    socialLinks: {
      instagramUrl: store.instagramUrl,
      facebookUrl: store.facebookUrl,
      tiktokUrl: store.tiktokUrl,
      xUrl: store.xUrl,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <StoreNavbar store={safeStore} />
      <main className="flex-1 w-full px-3 sm:px-5 lg:px-7 py-10 md:py-14">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="mb-5">
            <h2 className="text-3xl font-medium tracking-tight text-[#1A1A1A] md:text-[40px]">Collections</h2>
          </div>

          <ProductGrid
            products={serializedProducts}
            currency={safeStore.currency}
            brandColor={safeStore.brandColor}
            storeSlug={safeStore.slug}
            mode="related"
            referenceTime={referenceTime}
          />

          <div className="mt-8 flex justify-center">
            <Link
              href={`/${safeStore.slug}/products`}
              className="inline-flex h-11 items-center rounded-none px-6 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              style={{
                backgroundColor: safeStore.brandColor || "var(--store-brand, #1A1A1A)",
                "--tw-ring-color": `${(safeStore.brandColor || "#1A1A1A")}66`,
              } as { [key: string]: string }}
            >
              Browse full catalog
            </Link>
          </div>
        </div>

      </main>
      <StoreFooter
        storeName={store.name}
        socialLinks={safeStore.socialLinks}
      />
    </div>
  );
}
