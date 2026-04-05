"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/dashboard/dashboard-button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrdersTable } from "./orders-table";
import { OrderDetails } from "./order-details";
import { formatOrderId } from "@/lib/utils";
import { DashboardOrder, OrdersStats } from "./order-types";

interface OrdersClientProps {
  initialOrders: DashboardOrder[];
  stats: OrdersStats;
  standalone?: boolean;
  storeName: string;
  storePhone?: string | null;
}

export function OrdersClient({ initialOrders, stats, standalone = true, storeName, storePhone }: OrdersClientProps) {
  const [orders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const normalizedQuery = q.replace(/[^a-z0-9]/g, "");
      result = result.filter(
        (o) => {
          const formattedOrderId = formatOrderId(o.displayId || o.orderNumber || o.id).toLowerCase();
          const normalizedOrderId = formattedOrderId.replace(/[^a-z0-9]/g, "");
          return (
            o.customerName?.toLowerCase().includes(q) ||
            o.displayId?.toLowerCase().includes(q) ||
            formattedOrderId.includes(q) ||
            normalizedOrderId.includes(normalizedQuery) ||
            o.customerPhone?.includes(q)
          );
        }
      );
    }
    return result;
  }, [orders, statusFilter, searchQuery]);

  const handleExport = () => {
    const csv = [
      ["Order No", "Customer", "Phone", "Status", "Date", "Total Amount"].join(","),
      ...filteredOrders.map((o) =>
        [
          formatOrderId(o.displayId || o.orderNumber || o.id),
          o.customerName,
          o.customerPhone,
          o.status,
          new Date(o.createdAt).toLocaleDateString(),
          Number(o.totalAmount),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!standalone) {
    return (
      <OrdersTable
        orders={initialOrders}
        onView={setSelectedOrder}
      />
    );
  }

  const weeklyShare = stats.thisMonth > 0 ? Math.min(100, Math.round((stats.thisWeek / stats.thisMonth) * 100)) : 0;
  const monthlyPace = stats.total > 0 ? Math.min(100, Math.round((stats.thisMonthOrders / stats.total) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="grid items-start gap-6 xl:justify-start xl:grid-cols-[minmax(0,960px)_390px]">
        <div className="min-w-0 space-y-4">
          <div className="grid max-w-[960px] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="flex h-[238px] flex-col rounded-xl border bg-white px-6 py-6">
              <p className="text-xs font-normal leading-none text-foreground/80">Completed Order</p>
              <p className="mt-5 text-[44px] font-normal leading-none text-foreground">{stats.completed}</p>
            </div>

            <div className="flex h-[238px] flex-col rounded-xl border bg-white px-6 py-6">
              <p className="text-xs font-normal leading-none text-foreground/80">This Week</p>
              <p className="mt-5 text-[44px] font-normal leading-none text-foreground">KSH {stats.thisWeek.toLocaleString()}</p>
              <div className="mt-auto">
                <p className="text-xs text-muted-foreground">
                  From <span className="font-normal text-foreground">{stats.thisWeekOrders}</span> orders in last week
                </p>
                <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-muted/30">
                  <div className="h-full rounded-full bg-foreground/30 transition-all" style={{ width: `${weeklyShare}%` }} />
                </div>
              </div>
            </div>

            <div className="flex h-[238px] flex-col rounded-xl border bg-white px-6 py-6">
              <p className="text-xs font-normal leading-none text-foreground/80">This Month</p>
              <p className="mt-5 text-[44px] font-normal leading-none text-foreground">KSH {stats.thisMonth.toLocaleString()}</p>
              <div className="mt-auto">
                <p className="text-xs text-muted-foreground">
                  From <span className="font-normal text-foreground">{stats.thisMonthOrders}</span> orders this month
                </p>
                <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-muted/30">
                  <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${monthlyPace}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table Card */}
          <div className="max-w-[960px] rounded-xl border overflow-hidden">
            {/* Table Header */}
            <div className="p-5 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-normal text-foreground">Orders</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Recent orders from your store.</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-xl border-border bg-card font-normal text-foreground hover:bg-muted hover:text-foreground"
                      >
                        <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                        <ChevronDown className="ml-1 h-3 w-3 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel>Filter Orders</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["all", "pending", "processing", "completed", "cancelled", "abandoned"].map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={cn(
                            "capitalize",
                            statusFilter === s && "bg-primary/5 text-primary"
                          )}
                        >
                          {s === "all" ? "All Orders" : s}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* Export */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="h-8 rounded-xl font-normal"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </Button>
                </div>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Filter Order Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[280px] h-9 px-3 text-xs border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Table */}
            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-xs text-muted-foreground">
                  {searchQuery ? "No orders match your search" : statusFilter !== "all" ? `No ${statusFilter} orders` : "No orders yet"}
                </p>
              </div>
            ) : (
              <OrdersTable
                orders={filteredOrders}
                selectedOrderId={selectedOrder?.id}
                onView={setSelectedOrder}
              />
            )}
          </div>
        </div>

        {/* Right column — Detail Panel (full height) */}
        <div className="w-full shrink-0 self-start xl:mt-0 xl:w-[390px] xl:self-start">
          <div className="rounded-xl border overflow-hidden">
            {selectedOrder ? (
              <OrderDetails
                order={selectedOrder}
                storeName={storeName}
                storePhone={storePhone}
                onClose={() => setSelectedOrder(null)}
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center">
                <p className="text-xs text-muted-foreground">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
