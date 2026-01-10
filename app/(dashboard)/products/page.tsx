
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ProductsClient } from "@/components/dashboard/products-client";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Store } from "@/lib/models/Store";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your store products",
};

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const store = await Store.findOne({ userId: session.user.id });

  let productsData: any[] = [];

  if (store) {
    const products = await Product.find({ storeId: store._id }).sort({ createdAt: -1 });
    productsData = JSON.parse(JSON.stringify(products));
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductsClient initialProducts={productsData} />
    </div>
  );
}
