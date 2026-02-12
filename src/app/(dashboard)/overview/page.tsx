import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DollarSign, Package, ShoppingBag, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { startOfMonth, subMonths, startOfDay, subDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersClient } from "@/components/dashboard/orders-client";
import { SalesChart } from "@/components/dashboard/sales-chart";

import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Overview",
  description: "Store overview",
};

export default async function OverviewPage() {
  const session = await auth();

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
  let customersCount = 0;
  let recentOrders: any[] = [];
  let salesData: { label: string; value: number }[] = [];
  let topProducts: any[] = [];

  if (store) {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const startOfToday = startOfDay(now);

    // 1. Revenue Stats
    const [currentMonthRevenueAgg, prevMonthRevenueAgg, totalRevenueAgg] = await Promise.all([
        db.order.aggregate({
            _sum: { totalAmount: true },
            where: { storeId: store.id, status: "completed", createdAt: { gte: currentMonthStart } }
        }),
        db.order.aggregate({
            _sum: { totalAmount: true },
            where: { storeId: store.id, status: "completed", createdAt: { gte: prevMonthStart, lt: currentMonthStart } }
        }),
        db.order.aggregate({
            _sum: { totalAmount: true },
            where: { storeId: store.id, status: "completed" }
        })
    ]);

    const currentMonthRev = Number(currentMonthRevenueAgg._sum.totalAmount || 0);
    const prevMonthRev = Number(prevMonthRevenueAgg._sum.totalAmount || 0);
    totalRevenue = Number(totalRevenueAgg._sum.totalAmount || 0);

    if (prevMonthRev > 0) {
        revenueChange = ((currentMonthRev - prevMonthRev) / prevMonthRev) * 100;
    } else if (currentMonthRev > 0) {
        revenueChange = 100;
    }

    // 2. Orders & Products Stats
    const [totalOrders, todayOrders, totalProds, activeProds] = await Promise.all([
      db.order.count({ where: { storeId: store.id } }),
      db.order.count({ where: { storeId: store.id, createdAt: { gte: startOfToday } } }),
      db.product.count({ where: { storeId: store.id } }),
      db.product.count({ where: { storeId: store.id, isAvailable: true } })
    ]);
    ordersCount = totalOrders;
    ordersToday = todayOrders;
    productsCount = totalProds;
    activeProductsCount = activeProds;

    // 3. Customers Count
    const uniqueCustomers = await db.order.groupBy({
        by: ['customerPhone'],
        where: { storeId: store.id },
    });
    customersCount = uniqueCustomers.length;

    // 4. Chart Data (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = subDays(now, i);
        return {
            start: startOfDay(date),
            end: new Date(date.setHours(23, 59, 59, 999)),
            label: format(date, "EEE")
        };
    }).reverse();

    const chartDailyAggs = await Promise.all(last7Days.map(day =>
        db.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                storeId: store.id,
                status: "completed",
                createdAt: { gte: day.start, lte: day.end }
            }
        })
    ));

    salesData = last7Days.map((day, i) => ({
        label: day.label,
        value: Number(chartDailyAggs[i]._sum.totalAmount || 0)
    }));

    // 5. Top Selling Products
    const topSellingItems = await db.orderItem.groupBy({
        by: ['productId', 'name'],
        where: {
            order: { storeId: store.id, status: "completed" }
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
    });

    topProducts = topSellingItems.map(item => ({
        name: item.name,
        sales: item._sum.quantity || 0
    }));

    // 6. Recent orders
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
      color: "bg-[#00311F] text-primary-foreground",
      trend: formatTrend(revenueChange),
    },
    {
      title: "Total Orders",
      value: ordersCount.toString(),
      description: "Lifetime orders",
      icon: ShoppingBag,
      color: "bg-[#004D31] text-primary-foreground",
      trend: `+${ordersToday} new today`,
    },
    {
      title: "Products",
      value: productsCount.toString(),
      description: "Total inventory",
      icon: Package,
      color: "bg-[#006641] text-primary-foreground",
      trend: `${activeProductsCount} active`,
    },
    {
      title: "Customers",
      value: customersCount.toString(),
      description: "Total unique customers",
      icon: Users,
      color: "bg-[#008052] text-primary-foreground",
      trend: `${customersCount > 0 ? "+"+customersCount : "0"} total`,
    },
  ];

  return (
    <div className="space-y-8 animate-appear">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={stat.title} className="overflow-hidden border-2 border-border shadow-none rounded-3xl bg-card relative">
            <CardContent className="p-7 relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.trend && (
                    <span className="flex items-center text-[10px] font-bold text-primary/70 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10 uppercase tracking-wider">
                        <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                        {stat.trend}
                    </span>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">
                    {stat.title}
                </p>
                <div className="text-4xl font-semibold text-primary tracking-tighter">
                    {stat.value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-6">
        {/* Sales Chart */}
        <div className="lg:col-span-4">
            <div className="rounded-3xl border-2 border-border bg-card overflow-hidden">
                <SalesChart data={salesData} className="border-none shadow-none" />
            </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-2">
            <Card className="h-full border-2 border-border shadow-none rounded-3xl bg-card overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Best Sellers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 mt-4">
                        {topProducts.length > 0 ? topProducts.map((product, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {i + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-primary truncate max-w-[120px]">
                                            {product.name}
                                        </span>
                                        <span className="text-[10px] text-primary/40 uppercase tracking-wider font-bold">
                                            {product.sales} sold
                                        </span>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-primary/20 group-hover:text-primary transition-colors" />
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                                <Package className="h-10 w-10 mb-2" />
                                <p className="text-xs font-medium uppercase tracking-widest">No sales yet</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium tracking-tight text-primary font-poppins">Recent Orders</h3>
          </div>

          <div className="rounded-3xl border-2 border-border bg-card overflow-hidden">
               <OrdersClient initialOrders={recentOrders} standalone={false} />
          </div>
      </div>
    </div>
  );
}