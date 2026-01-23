import { notFound } from "next/navigation";
import db from "@/lib/db";
import { StoreLayout } from "./components/store-layout";

export default async function StorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;

  const store = await db.store.findUnique({
      where: { slug: storeSlug },
      include: { deliveryZones: true }
  });

  if (!store) {
    notFound();
  }

  const products = await db.product.findMany({
      where: { 
          storeId: store.id,
          isAvailable: true 
      }
  });

  const serializedProducts = JSON.parse(JSON.stringify(products));
  const serializedStore = JSON.parse(JSON.stringify(store));

  return (
    <StoreLayout
      store={serializedStore}
      products={serializedProducts}
    />
  );
}
