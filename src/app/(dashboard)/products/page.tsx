import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ProductsClient } from "@/components/dashboard/products-client";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your store products",
};

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
      where: { userId: session.user.id }
  });

  let productsData: any[] = [];

  if (store) {
    const products = await db.product.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' }
    });
    productsData = JSON.parse(JSON.stringify(products));
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductsClient initialProducts={productsData} />
    </div>
  );
}