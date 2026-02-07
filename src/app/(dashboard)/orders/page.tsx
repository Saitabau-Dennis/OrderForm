import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrdersClient } from "@/components/dashboard/orders-client";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage your store orders",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
      where: { userId: session.user.id }
  });

  let ordersData: any[] = [];

  if (store) {
    const orders = await db.order.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });
    ordersData = JSON.parse(JSON.stringify(orders));
  }

  return (
    <div className="animate-appear">
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <OrdersClient initialOrders={ordersData} />
      </div>
    </div>
  );
}