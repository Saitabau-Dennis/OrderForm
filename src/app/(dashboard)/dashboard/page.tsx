import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DollarSign, Package, ShoppingBag, TrendingUp, Users, ArrowUpRight, CalendarRange, ChevronDown } from "lucide-react";
import { startOfMonth, subMonths, startOfDay, subDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersClient } from "@/components/dashboard/orders-client";
import { SalesChart } from "@/components/dashboard/sales-chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/dashboard/dashboard-button";
import { SetupChecklist } from "@/components/dashboard/setup-checklist";
import Link from "next/link";

import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Store overview",
};

interface DashboardPageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const { range = "7d" } = await searchParams;

  if (!session?.user?.id) {
    redirect("/login");
  }

  let store: { id: string; name: string; slug: string; [key: string]: any } | null = null;
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

  const rangeLabels: Record<string, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "1y": "Last Year"
  };

  try {
    store = await db.store.findFirst({
        where: { userId: session.user.id }
    });

    if (store) {
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const prevMonthStart = startOfMonth(subMonths(now, 1));
      const startOfToday = startOfDay(now);

      // Batch 1: Revenue Stats
      const [currentMonthRevenueAgg, prevMonthRevenueAgg, totalRevenueAgg] = await Promise.all([
        db.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            storeId: store.id,
            status: "completed",
            createdAt: { gte: currentMonthStart }
          }
        }),
        db.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            storeId: store.id,
            status: "completed",
            createdAt: { gte: prevMonthStart, lt: currentMonthStart }
          }
        }),
        db.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            storeId: store.id,
            status: "completed"
          }
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

      // Batch 2: Counts
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

      // Calculate unique customers
      const uniqueCustomers = await db.order.groupBy({
        by: ['customerPhone'],
        where: { storeId: store.id },
      });
      customersCount = uniqueCustomers.length;

      // 4. Chart Data based on range
      let periods: { start: Date; end: Date; label: string }[] = [];

      if (range === "30d") {
        periods = [...Array(30)].map((_, i) => {
          const date = subDays(now, i);
          return {
            start: startOfDay(date),
            end: new Date(date.setHours(23, 59, 59, 999)),
            label: format(date, "MMM d")
          };
        }).reverse();
      } else if (range === "1y") {
        periods = [...Array(12)].map((_, i) => {
          const date = subMonths(now, i);
          return {
            start: startOfMonth(date),
            end: new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(23, 59, 59, 999)),
            label: format(date, "MMM")
          };
        }).reverse();
      } else {
        // Default 7d
        periods = [...Array(7)].map((_, i) => {
          const date = subDays(now, i);
          return {
            start: startOfDay(date),
            end: new Date(date.setHours(23, 59, 59, 999)),
            label: format(date, "EEE")
          };
        }).reverse();
      }

      const chartDailyAggs = await Promise.all(periods.map(period =>
          db.order.aggregate({
              _sum: { totalAmount: true },
              where: {
                  storeId: store!.id,
                  status: "completed",
                  createdAt: { gte: period.start, lte: period.end }
              }
          })
      ));

      salesData = periods.map((period, i) => ({
          label: period.label,
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

      // Batch 3: Recent Data
      const orders = await db.order.findMany({
          where: { storeId: store.id },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { items: true }
      });
      recentOrders = JSON.parse(JSON.stringify(orders));
    }
  } catch (error) {
    console.error("Dashboard DB Error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
        <div className="h-24 w-24 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 border-2 border-primary/10">
          <ShoppingBag className="w-10 h-10 text-primary opacity-20" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-poppins tracking-tight mb-3">
          We're having trouble reaching your store.
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed mb-8 font-poppins">
          Our systems are currently taking a moment to catch up. Your data is safe—please try refreshing the page in a few seconds.
        </p>
        <a
          href="/dashboard"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Refresh Page
        </a>
      </div>
    );
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

  const isStoreConfigured = Boolean(store?.whatsappNumber?.trim());
  const hasFirstProduct = productsCount > 0;
  const onboardingComplete = isStoreConfigured && hasFirstProduct;

  return (
    <div className="flex-1 space-y-4 p-8 pt-0 animate-appear">
      {!onboardingComplete && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <SetupChecklist
            storeName={store?.name}
            isStoreConfigured={isStoreConfigured}
            hasFirstProduct={hasFirstProduct}
          />
        </div>
      )}

      {onboardingComplete ? (
        <>
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="overflow-hidden border-2 border-border shadow-none rounded-xl bg-card relative">
                <CardContent className="p-6 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-normal text-muted-foreground">{stat.title}</p>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-3xl font-normal text-foreground tracking-tight">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-6">
            {/* Sales Chart */}
            <div className="lg:col-span-4">
                <div className="rounded-xl border-2 border-border bg-card overflow-hidden h-full">
                    <div className="px-7 pt-7 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-medium text-primary">Sales</h3>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-auto rounded-lg border bg-white px-3 py-2 text-sm font-normal text-foreground"
                          >
                            <CalendarRange className="h-4 w-4 text-muted-foreground" />
                            {rangeLabels[range]}
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl bg-card border border-border shadow-xl">
                          <DropdownMenuItem asChild className="focus:bg-primary/5 focus:text-primary cursor-pointer rounded-xl m-1 px-3 py-2">
                            <Link href="?range=7d" scroll={false} className="w-full text-xs font-medium uppercase tracking-wider">Last 7 Days</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="focus:bg-primary/5 focus:text-primary cursor-pointer rounded-xl m-1 px-3 py-2">
                            <Link href="?range=30d" scroll={false} className="w-full text-xs font-medium uppercase tracking-wider">Last 30 Days</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="focus:bg-primary/5 focus:text-primary cursor-pointer rounded-xl m-1 px-3 py-2">
                            <Link href="?range=1y" scroll={false} className="w-full text-xs font-medium uppercase tracking-wider">Last Year</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <SalesChart data={salesData} className="border-none shadow-none" rangeLabel={rangeLabels[range]} />
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="lg:col-span-2">
                <Card className="h-full border-2 border-border shadow-none rounded-xl bg-card overflow-hidden">
                    <CardHeader className="p-7 pb-2">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            Best Sellers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-7">
                        <div className="space-y-6 mt-2">
                            {topProducts.length > 0 ? topProducts.map((product, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                                            {i + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-primary truncate max-w-[120px]">
                                                {product.name}
                                            </span>
                                            <span className="text-[10px] text-primary/40 uppercase tracking-wider font-medium">
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
        </>
      ) : null}
    </div>
  );
}
