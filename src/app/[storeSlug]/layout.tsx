import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import db from "@/lib/db";
import { hasProductOptions } from "@/lib/has-product-options";

import { StoreProvider } from "./components/store-provider";
import { StoreActionModal } from "./components/store-action-modal";

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
      sizes: true,
      variants: true,
    }
  })

  // Serialize Decimal
  const serializedProducts = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
    description: p.description,
    isAvailable: p.isAvailable,
    hasOptions: hasProductOptions(p),
  }))

  const storefrontThemeVars: CSSProperties = {
    "--store-brand": store.brandColor || "#426BC2",
    "--store-secondary": store.secondaryColor || "#A6CFF2",
  } as CSSProperties

  return (
    <div
      className="min-h-screen bg-[#F7F7F5] theme-store font-clash-display antialiased"
      style={storefrontThemeVars}
    >
      <StoreProvider storeSlug={store.slug} availableProductIds={serializedProducts.map((product) => product.id)}>
        {children}
        <StoreActionModal storeSlug={store.slug} />
      </StoreProvider>
    </div>
  );
}
