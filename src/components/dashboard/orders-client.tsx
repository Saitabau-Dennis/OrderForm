"use client";

import { useState, useMemo } from "react";
import { OrdersTable } from "./orders-table";
import { OrderDetails } from "./order-details";
import { updateOrderStatus } from "@/lib/actions/orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export function OrdersClient({ initialOrders, stats, standalone = true, storeName }: any) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const result = await updateOrderStatus(orderId, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Order status updated");
      setOrders((prev: any[]) =>
        prev.map((o: any) => (o.id === orderId ? { ...o, status } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status }));
      }
      router.refresh();
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") {
      result = result.filter((o: any) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o: any) =>
          o.customerName?.toLowerCase().includes(q) ||
          o.displayId?.toLowerCase().includes(q) ||
          o.customerPhone?.includes(q)
      );
    }
    return result;
  }, [orders, statusFilter, searchQuery]);

  const handleExport = () => {
    const csv = [
      ["Order No", "Customer", "Phone", "Status", "Date", "Total Amount"].join(","),
      ...filteredOrders.map((o: any) =>
        [
          o.displayId || o.orderNumber,
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
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-medium tracking-tight text-foreground font-poppins">
          Orders
        </h2>
        <p className="text-sm text-muted-foreground font-poppins">
          Manage and track your store orders.
        </p>
      </div>

      <Separator />

      {/* Two-column layout: left (cards + table), right (detail panel) */}
      <div className="flex gap-5 items-start">
        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 py-8 rounded-xl bg-white border">
              <p className="text-sm font-normal text-muted-foreground mb-2">Completed Orders</p>
              <p className="text-4xl font-normal text-foreground">{stats.completed}</p>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Out of <span className="font-medium text-foreground">{stats.total}</span> total orders
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-foreground">{stats.pending}</span> pending · <span className="font-medium text-foreground">{stats.processing}</span> processing
                </p>
              </div>
            </div>
            <div className="p-5 py-8 rounded-xl bg-white border">
              <p className="text-sm font-normal text-muted-foreground mb-2">This Week</p>
              <p className="text-4xl font-normal text-foreground">KSH {stats.thisWeek.toLocaleString()}</p>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  From <span className="font-medium text-foreground">{stats.thisWeekOrders}</span> orders in the last 7 days
                </p>
              </div>
            </div>
            <div className="p-5 py-8 rounded-xl bg-white border">
              <p className="text-sm font-normal text-muted-foreground mb-2">This Month</p>
              <p className="text-4xl font-normal text-foreground">KSH {stats.thisMonth.toLocaleString()}</p>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  From <span className="font-medium text-foreground">{stats.thisMonthOrders}</span> orders this month
                </p>
              </div>
            </div>
          </div>

          {/* Orders Table Card */}
          <div className="rounded-xl bg-white border overflow-hidden">
            {/* Table Header */}
            <div className="p-5 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-normal text-foreground">Orders</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Recent orders from your store.</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className="h-8 px-3 text-xs font-normal border rounded-md hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filter
                    </button>
                    {showFilterMenu && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-white border rounded-lg shadow-lg z-10 py-1">
                        {["all", "pending", "processing", "completed", "cancelled"].map((s) => (
                          <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setShowFilterMenu(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors capitalize ${statusFilter === s ? "font-medium text-foreground bg-muted/30" : "text-muted-foreground"}`}
                          >
                            {s === "all" ? "All Orders" : s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Export */}
                  <button
                    onClick={handleExport}
                    className="h-8 px-3 text-xs font-normal border rounded-md hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Filter Order Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[280px] h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Table */}
            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No orders match your search" : statusFilter !== "all" ? `No ${statusFilter} orders` : "No orders yet"}
                </p>
              </div>
            ) : (
              <OrdersTable
                orders={filteredOrders}
                selectedOrderId={selectedOrder?.id}
                onView={setSelectedOrder}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        </div>

        {/* Right column — Detail Panel (full height) */}
        <div className="w-[380px] shrink-0 sticky top-24">
          <div className="rounded-xl bg-white border overflow-hidden">
            {selectedOrder ? (
              <OrderDetails
                order={selectedOrder}
                storeName={storeName}
                onUpdateStatus={handleUpdateStatus}
                onClose={() => setSelectedOrder(null)}
              />
            ) : (
              <div className="h-full flex items-center justify-center min-h-[400px]">
                <p className="text-xs text-muted-foreground">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}