import { notFound } from "next/navigation";
import db from "@/lib/db";

import { StoreProvider } from "./components/store-provider";
import { StoreCartSheet } from "./components/store-cart-sheet";
import { StoreWishlistSheet } from "./components/store-wishlist-sheet";

export default async function StoreRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  const store = await db.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) {
    notFound();
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
    <div className="min-h-screen bg-[#F7F7F5] theme-store font-sans antialiased">
      <StoreProvider>
        {children}
        <StoreCartSheet storeSlug={store.slug} currency={store.currency} />
        <StoreWishlistSheet storeSlug={store.slug} currency={store.currency} allProducts={serializedProducts} />
      </StoreProvider>
    </div>
  );
}
