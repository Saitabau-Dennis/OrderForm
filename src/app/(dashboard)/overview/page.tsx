import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CreditCard, DollarSign, Package, ShoppingBag } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersClient } from "@/components/dashboard/orders-client";

import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Store overview",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
      where: { userId: session.user.id }
  });

  let stats = [
    { title: "Total Revenue", value: "KES 0", description: "No sales yet", icon: DollarSign },
    { title: "Orders", value: "0", description: "No orders yet", icon: ShoppingBag },
    { title: "Products", value: "0", description: "No products yet", icon: Package },
    { title: "Active Now", value: "0", description: "Real-time users", icon: CreditCard },
  ];

  let recentOrders: any[] = [];

  if (store) {
    const revenueAgg = await db.order.aggregate({
        _sum: { totalAmount: true },
        where: { storeId: store.id }
    });

    const [ordersCount, productsCount] = await Promise.all([
      db.order.count({ where: { storeId: store.id } }),
      db.product.count({ where: { storeId: store.id } })
    ]);

    const totalRevenue = revenueAgg._sum.totalAmount || 0;
    
    // Fetch recent orders
    const orders = await db.order.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true }
    });

    stats = [
      {
        title: "Total Revenue",
        value: `KES ${Number(totalRevenue).toLocaleString()}`,
        description: "Lifetime revenue",
        icon: DollarSign,
      },
      {
        title: "Orders",
        value: ordersCount.toString(),
        description: "Lifetime orders",
        icon: ShoppingBag,
      },
      {
        title: "Products",
        value: productsCount.toString(),
        description: "Active in store",
        icon: Package,
      },
      {
        title: "Active Now",
        value: "+1", 
        description: "You are online",
        icon: CreditCard,
      },
    ];

    recentOrders = JSON.parse(JSON.stringify(orders));
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-sans">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersClient initialOrders={recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}