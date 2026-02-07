import { notFound } from "next/navigation";
import db from "@/lib/db";
import { ShareClient } from "../components/share-client";
import { StoreProvider } from "../components/store-context";
import { StoreHeader } from "../components/store-header";
import { StoreCart } from "../components/store-cart";

export default async function SharePage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  const store = await db.store.findUnique({
      where: { slug: storeSlug }
  });

  if (!store) {
    notFound();
  }

  const products = await db.product.findMany({
      where: {
          storeId: store.id,
          isAvailable: true
      },
      orderBy: { name: 'asc' }
  });

  const serializedStore = JSON.parse(JSON.stringify(store));
  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <StoreProvider 
        currency={store.currency} 
        brandColor={store.brandColor || "#000000"}
        storeName={store.name}
        whatsappNumber={store.whatsappNumber || ""}
        storeId={store.id}
    >
        <div className="min-h-screen bg-white">
            <StoreHeader name={store.name} logoUrl={store.logoUrl || undefined} />
            <ShareClient
                store={serializedStore}
                products={serializedProducts}
            />
            <StoreCart storeName={store.name} whatsappNumber={store.whatsappNumber || ""} storeId={store.id} />
        </div>
    </StoreProvider>
  );
}
