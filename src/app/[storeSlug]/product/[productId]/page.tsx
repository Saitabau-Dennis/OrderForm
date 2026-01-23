import { notFound } from "next/navigation";
import db from "@/lib/db";
import { ProductDetails } from "../../components/product-details";
import { StoreProvider } from "../../components/store-context";
import { StoreHeader } from "../../components/store-header";
import { StoreCart } from "../../components/store-cart";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productId: string }>;
}) {
  const { storeSlug, productId } = await params;

  const store = await db.store.findUnique({
      where: { slug: storeSlug }
  });

  if (!store) {
    notFound();
  }

  const product = await db.product.findFirst({
      where: {
          id: productId,
          storeId: store.id
      }
  });

  if (!product) {
    notFound();
  }

  // Fetch similar products (same store, different ID)
  // 1. Try to get products in the same category
  let similarProducts = await db.product.findMany({
      where: {
          storeId: store.id,
          id: { not: productId },
          isAvailable: true,
          category: product.category || undefined
      },
      take: 4
  });

  // 2. If no products in category, just get any other products from the store
  if (similarProducts.length === 0) {
    similarProducts = await db.product.findMany({
        where: {
            storeId: store.id,
            id: { not: productId },
            isAvailable: true,
        },
        take: 4
    });
  }

  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedStore = JSON.parse(JSON.stringify(store));
  const serializedSimilar = JSON.parse(JSON.stringify(similarProducts));

  return (
    <StoreProvider 
        currency={store.currency} 
        brandColor={store.brandColor || "#000000"}
    >
        <div className="min-h-screen bg-white">
            <StoreHeader name={store.name} logoUrl={store.logoUrl} />
            <ProductDetails
                product={serializedProduct}
                store={serializedStore}
                similarProducts={serializedSimilar}
            />
            <StoreCart storeName={store.name} whatsappNumber={store.whatsappNumber} />
        </div>
    </StoreProvider>
  );
}
