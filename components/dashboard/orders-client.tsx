"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { OrderDetails } from "@/components/dashboard/order-details";

interface OrdersClientProps {
  initialOrders: any[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const handleUpdateStatus = async (status: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating status:", status);

    // In a real app, we would update the local state or re-fetch data
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return (
    <>
      <OrdersTable orders={initialOrders} onView={handleViewOrder} />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
