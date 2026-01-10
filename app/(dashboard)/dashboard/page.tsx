import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CreditCard, DollarSign, Package, ShoppingBag } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersClient } from "@/components/dashboard/orders-client";

import dbConnect from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { Store } from "@/lib/models/Store";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Store overview",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const store = await Store.findOne({ userId: session.user.id });

  let stats = [
    { title: "Total Revenue", value: "KES 0", description: "No sales yet", icon: DollarSign },
    { title: "Orders", value: "0", description: "No orders yet", icon: ShoppingBag },
    { title: "Products", value: "0", description: "No products yet", icon: Package },
    { title: "Active Now", value: "0", description: "Real-time users", icon: CreditCard },
  ];

  let recentOrders: any[] = [];

  if (store) {
    // Fetch data in parallel
    const [orders, productsCount] = await Promise.all([
      Order.find({ storeId: store._id }).sort({ createdAt: -1 }),
      Product.countDocuments({ storeId: store._id })
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;

    stats = [
      {
        title: "Total Revenue",
        value: `KES ${totalRevenue.toLocaleString()}`,
        description: "Lifetime revenue",
        icon: DollarSign,
      },
      {
        title: "Orders",
        value: totalOrders.toString(),
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
        value: "+1", // Placeholder for now as we don't have real-time tracking
        description: "You are online",
        icon: CreditCard,
      },
    ];

    recentOrders = JSON.parse(JSON.stringify(orders.slice(0, 5)));
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
