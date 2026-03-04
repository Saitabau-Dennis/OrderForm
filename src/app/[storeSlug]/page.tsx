import { notFound } from "next/navigation";
import db from "@/lib/db";
import { StoreNavbar } from "./components/store-navbar";
import { StoreHero } from "./components/store-hero";
import { ProductGrid } from "./components/product-grid";
import { StoreFooter } from "./components/store-footer";

export default async function StorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;

  const store = await db.store.findUnique({
    where: { slug: storeSlug },
    include: {
      products: {
        where: { isAvailable: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!store) {
    notFound();
  }

  // Serialize Decimal fields to plain numbers for the client component
  const serializedProducts = store.products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
    isAvailable: p.isAvailable,
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
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <ProductGrid
          products={serializedProducts}
          currency={safeStore.currency}
          brandColor={safeStore.brandColor}
          storeSlug={safeStore.slug}
        />
      </main>
      <StoreFooter storeName={store.name} />
    </div>
  );
}
