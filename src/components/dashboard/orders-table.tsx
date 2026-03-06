"use client";

import { cn } from "@/lib/utils";
import { formatOrderId } from "@/lib/utils";
import { format } from "date-fns";

const STATUS_DOT: Record<string, string> = {
  pending: "bg-muted-foreground/40",
  processing: "bg-primary/60",
  completed: "bg-primary",
  cancelled: "bg-destructive/60",
};

export function OrdersTable({ orders, onView, selectedOrderId, onUpdateStatus }: any) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-t border-b text-xs uppercase tracking-wider text-muted-foreground">
          <th className="px-5 py-3 font-medium">Order No</th>
          <th className="px-5 py-3 font-medium">Customer</th>
          <th className="px-5 py-3 font-medium">Status</th>
          <th className="px-5 py-3 font-medium">Date</th>
          <th className="px-5 py-3 font-medium text-right">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order: any) => (
          <tr
            key={order.id}
            onClick={() => onView?.(order)}
            className={cn(
              "cursor-pointer transition-colors text-[15px]",
              selectedOrderId === order.id
                ? "bg-muted/40"
                : "hover:bg-muted/20"
            )}
          >
            <td className="px-5 py-4">
              <span className="font-normal text-foreground">
                {formatOrderId(order.displayId || order.orderNumber || order.id)}
              </span>
            </td>
            <td className="px-5 py-4">
              <span className="font-normal text-foreground">{order.customerName}</span>
            </td>
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT[order.status] || STATUS_DOT.pending)} />
                <span className="font-normal text-foreground capitalize text-sm">{order.status}</span>
              </div>
            </td>
            <td className="px-5 py-3.5">
              <span className="font-normal text-muted-foreground text-sm">
                {format(new Date(order.createdAt), "MMM d, yyyy")}
              </span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <span className="font-normal text-foreground">
                KSH {Number(order.totalAmount).toLocaleString()}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
