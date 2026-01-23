import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { OrdersClient } from "@/components/dashboard/orders-client";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage your store orders",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-sans">Orders</h2>
      </div>
      <OrdersClient initialOrders={ordersData} />
    </div>
  );
}