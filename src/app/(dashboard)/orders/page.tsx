import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrdersClient } from "@/components/dashboard/orders-client";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const store = await db.store.findFirst({
    where: { userId: session.user.id }
  });

  if (!store) return null;

  const orders = await db.order.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });

  const weekCompleted = orders.filter(o =>
    new Date(o.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
    o.status === 'completed'
  );

  const monthCompleted = orders.filter(o =>
    new Date(o.createdAt).getMonth() === new Date().getMonth() &&
    o.status === 'completed'
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    thisWeek: weekCompleted.reduce((sum, o) => sum + Number(o.totalAmount), 0),
    thisWeekOrders: weekCompleted.length,
    thisMonth: monthCompleted.reduce((sum, o) => sum + Number(o.totalAmount), 0),
    thisMonthOrders: monthCompleted.length,
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-0 animate-appear">
      <OrdersClient
        initialOrders={JSON.parse(JSON.stringify(orders))}
        stats={stats}
        storeName={store.name}
      />
    </div>
  );
}
