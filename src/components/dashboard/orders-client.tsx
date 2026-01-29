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
import { updateOrderStatus } from "@/lib/actions/orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder) return;

    try {
      const result = await updateOrderStatus(selectedOrder.id, status);
      
      if (result.error) {
        toast.error(result.error);
        throw new Error(result.error);
      }
      
      // Update local state for immediate feedback in the sheet
      setSelectedOrder((prev: any) => prev ? { ...prev, status } : null);
      
      // Refresh the page to update the table
      router.refresh();
      
    } catch (error) {
      console.error("Failed to update status:", error);
      // Re-throw so the child component knows it failed
      throw error;
    }
  };

  return (
    <>
      <OrdersTable orders={initialOrders} onView={handleViewOrder} />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto p-0 border-l border-primary/10">
          <div className="bg-primary/5 px-6 py-5 border-b border-primary/10 sticky top-0 z-10 backdrop-blur-md">
            <SheetHeader>
                <SheetTitle className="text-xl font-medium font-raleway text-primary">Order Details</SheetTitle>
            </SheetHeader>
          </div>
          
          <div className="p-6">
            {selectedOrder && (
                <OrderDetails
                order={selectedOrder}
                onUpdateStatus={handleUpdateStatus}
                />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}