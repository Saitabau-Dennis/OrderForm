import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductsClient } from "@/components/dashboard/products-client";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your store products",
};

export default async function ProductsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
      where: { userId: session.user.id }
  });

  let productsData: any[] = [];
  const isStoreConfigured = Boolean(store?.whatsappNumber?.trim());

  if (store) {
    const products = await db.product.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { orderItems: true }
          }
        }
    });
    productsData = JSON.parse(JSON.stringify(products));
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-0 animate-appear">
      <ProductsClient initialProducts={productsData} canAddProduct={isStoreConfigured} />
    </div>
  );
}
