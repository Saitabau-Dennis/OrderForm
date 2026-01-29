import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { startOfMonth, subMonths, startOfDay } from "date-fns";

import { authOptions } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersClient } from "@/components/dashboard/orders-client";

import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Overview",
  description: "Store overview",
};

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
      where: { userId: session.user.id }
  });

  // Default stats
  let totalRevenue = 0;
  let revenueChange = 0;
  let ordersCount = 0;
  let ordersToday = 0;
  let productsCount = 0;
  let activeProductsCount = 0;
  let recentOrders: any[] = [];

  if (store) {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const startOfToday = startOfDay(now);

    // 1. Revenue Stats (Current vs Previous Month)
    const currentMonthRevenueAgg = await db.order.aggregate({
        _sum: { totalAmount: true },
        where: { 
          storeId: store.id,
          status: "completed",
          createdAt: { gte: currentMonthStart }
        }
    });

    const prevMonthRevenueAgg = await db.order.aggregate({
        _sum: { totalAmount: true },
        where: { 
          storeId: store.id,
          status: "completed",
          createdAt: { gte: prevMonthStart, lt: currentMonthStart }
        }
    });

    // Total Revenue (All time)
    const totalRevenueAgg = await db.order.aggregate({
        _sum: { totalAmount: true },
        where: { 
          storeId: store.id,
          status: "completed"
        }
    });

    const currentMonthRev = Number(currentMonthRevenueAgg._sum.totalAmount || 0);
    const prevMonthRev = Number(prevMonthRevenueAgg._sum.totalAmount || 0);
    totalRevenue = Number(totalRevenueAgg._sum.totalAmount || 0);

    if (prevMonthRev > 0) {
        revenueChange = ((currentMonthRev - prevMonthRev) / prevMonthRev) * 100;
    } else if (currentMonthRev > 0) {
        revenueChange = 100;
    }

    // 2. Orders Stats
    const [totalOrders, todayOrders] = await Promise.all([
      db.order.count({ where: { storeId: store.id } }),
      db.order.count({ where: { storeId: store.id, createdAt: { gte: startOfToday } } })
    ]);
    ordersCount = totalOrders;
    ordersToday = todayOrders;

    // 3. Products Stats
    const [totalProds, activeProds] = await Promise.all([
      db.product.count({ where: { storeId: store.id } }),
      db.product.count({ where: { storeId: store.id, isAvailable: true } })
    ]);
    productsCount = totalProds;
    activeProductsCount = activeProds;
    
    // Fetch recent orders
    const orders = await db.order.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true }
    });
    recentOrders = JSON.parse(JSON.stringify(orders));
  }

  const formatTrend = (val: number) => {
      if (val === 0) return "No change";
      return `${val > 0 ? "+" : ""}${val.toFixed(0)}% vs last month`;
  };

  const stats = [
    {
      title: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      description: "Lifetime earnings",
      icon: DollarSign,
      color: "bg-[#00311F] text-white", // Brand Pine
      trend: formatTrend(revenueChange),
    },
    {
      title: "Total Orders",
      value: ordersCount.toString(),
      description: "Lifetime orders",
      icon: ShoppingBag,
      color: "bg-[#004D31] text-white", // Deep Sage
      trend: `+${ordersToday} new today`,
    },
    {
      title: "Products",
      value: productsCount.toString(),
      description: "Total inventory",
      icon: Package,
      color: "bg-[#006641] text-white", // Medium Pine
      trend: `${activeProductsCount} active`,
    },
    {
      title: "Customers",
      value: "Coming Soon",
      description: "Customer insights",
      icon: Users,
      color: "bg-[#008052] text-white", // Light Pine
      trend: "Feature locked",
      opacity: "opacity-75",
    },
  ];

  return (
    <div className="space-y-6 animate-appear">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={stat.title} className={`overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group rounded-2xl relative ${stat.opacity || ""}`}>
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
                <stat.icon className="w-24 h-24 text-current" />
            </div>
            
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl shadow-md ${stat.color} bg-opacity-90 backdrop-blur-sm`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.trend && (
                    <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.trend}
                    </span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide font-instrument-sans">
                    {stat.title}
                </h3>
                <div className="text-3xl font-medium font-sora text-foreground tracking-tight">
                    {stat.value}
                </div>
                <p className="text-xs text-muted-foreground/80 font-instrument-sans">
                  {stat.description}
                </p>
              </div>
            </CardContent>
            {/* Bottom accent line */}
            <div className={`h-1 w-full ${stat.color.split(" ")[0]}`} />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1">
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium tracking-tight text-primary font-raleway">Recent Orders</h3>
            </div>
            
            <div className="rounded-none border border-primary/5 bg-white shadow-xl overflow-hidden">
                 <OrdersClient initialOrders={recentOrders} />
            </div>
        </div>
      </div>
    </div>
  );
}