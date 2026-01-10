import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import { Store } from "@/lib/models/Store";
import { Product } from "@/lib/models/Product";
import { StoreHero } from "./components/store-hero";
import { StoreHome } from "./components/store-home";

export default async function StorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  await dbConnect();
  const { storeSlug } = await params;

  const store = await Store.findOne({ slug: storeSlug });

  if (!store) {
    notFound();
  }

  const products = await Product.find({ storeId: store._id, isAvailable: true }).lean();
  const serializedProducts = JSON.parse(JSON.stringify(products));
  const serializedStore = JSON.parse(JSON.stringify(store));

  return (
    <main className="container mx-auto px-4 py-8 pb-24">
      <StoreHero
        name={store.name}
        description={store.description}
        brandColor={store.brandColor || "#30382F"}
      />

      <StoreHome
        store={serializedStore}
        products={serializedProducts}
      />
    </main>
  );
}
