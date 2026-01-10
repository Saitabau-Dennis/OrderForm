import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import { Store } from "@/lib/models/Store";
import { Product } from "@/lib/models/Product";
import { ProductDetails } from "../../components/product-details";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productId: string }>;
}) {
  await dbConnect();
  const { storeSlug, productId } = await params;

  const store = await Store.findOne({ slug: storeSlug });

  if (!store) {
    notFound();
  }

  const product = await Product.findOne({
    _id: productId,
    storeId: store._id,
  });

  if (!product) {
    notFound();
  }

  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedStore = JSON.parse(JSON.stringify(store));

  return (
    <ProductDetails
      product={serializedProduct}
      store={serializedStore}
    />
  );
}
