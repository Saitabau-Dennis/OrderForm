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
    <div className="animate-appear">
      <ProductsClient initialProducts={productsData} />
    </div>
  );
}
