import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { OrdersClient } from "@/components/dashboard/orders-client";
import dbConnect from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Store } from "@/lib/models/Store";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage your store orders",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const store = await Store.findOne({ userId: session.user.id });

  let ordersData: any[] = [];

  if (store) {
    const orders = await Order.find({ storeId: store._id }).sort({ createdAt: -1 });
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
