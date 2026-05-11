"use client";

import { format } from "date-fns";
import { Button } from "@/components/dashboard/dashboard-button";
import { Printer, X } from "lucide-react";
import { formatOrderId } from "@/lib/utils";
import { DashboardOrder, DashboardOrderItem } from "./order-types";

export function OrderDetails({
  order,
  storeName,
  storePhone,
  onClose,
}: {
  order: DashboardOrder;
  storeName: string;
  storePhone?: string | null;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col print-area">
      {/* Receipt Header */}
      <div className="relative px-6 pt-6 pb-5">
        <p className="mb-1 text-[11px] uppercase tracking-widest text-muted-foreground">{storeName}</p>
        <h2 className="text-[30px] font-normal leading-tight text-foreground">
          Order ID: {formatOrderId(order.displayId || order.orderNumber || order.id)}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {format(new Date(order.createdAt), "MMM d, yyyy · h:mm a")}
        </p>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 rounded-xl border bg-background hover:bg-muted no-print"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Order Items */}
      <div className="px-6 py-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Order Details</p>
        <div className="space-y-2.5">
          {order.items?.map((item: DashboardOrderItem, i: number) => (
            <div key={i} className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <p className="text-xs text-foreground">
                  {item.name}
                  {item.variant && <span className="text-muted-foreground"> ({item.variant})</span>}
                </p>
                <p className="text-[11px] text-muted-foreground">Qty: {item.quantity} × Ksh {Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <span className="text-xs text-foreground shrink-0">
                Ksh {(Number(item.price) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Totals */}
      <div className="px-6 py-4 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">Ksh {Number(order.subtotal || order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        {Number(order.deliveryFee) > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-foreground">Ksh {Number(order.deliveryFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Tax</span>
          <span className="text-foreground">Ksh 0.00</span>
        </div>
      </div>

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Grand Total */}
      <div className="px-6 py-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-medium text-foreground">Ksh {Number(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <>
          <div className="mx-5 border-t border-dashed" />
          <div className="px-6 py-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Notes</p>
            <p className="text-xs text-muted-foreground italic">&ldquo;{order.notes}&rdquo;</p>
          </div>
        </>
      )}

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-[10px] text-muted-foreground">Thank you for your order!</p>
        <p className="mt-2 text-[10px] text-muted-foreground">{storeName}</p>
        {storePhone ? <p className="mt-2 text-[10px] text-muted-foreground">{storePhone}</p> : null}
      </div>

      {/* Actions bar — hidden on print */}
      <div className="border-t p-4 flex items-center gap-2 no-print">
        <div className="h-8 flex-1 rounded-md border px-3 text-xs flex items-center capitalize text-muted-foreground">
          Status: {order.status}
        </div>
        <Button
          onClick={() => window.print()}
          variant="outline"
          size="sm"
          className="h-8 rounded-xl font-normal shrink-0"
        >
          <Printer className="w-3.5 h-3.5 mr-1.5" />
          Print
        </Button>
      </div>
    </div>
  );
}
