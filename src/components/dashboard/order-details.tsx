"use client";

import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function OrderDetails({
  order,
  storeName,
  onUpdateStatus,
  onClose,
}: {
  order: any;
  storeName: string;
  onUpdateStatus: (orderId: string, status: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col print-area">
      {/* Receipt Header */}
      <div className="relative px-6 pt-6 pb-5">
        <p className="mb-1 text-[11px] uppercase tracking-widest text-muted-foreground">{storeName}</p>
        <h2 className="text-[30px] font-normal leading-tight text-foreground">
          Order ID: {order.displayId || order.orderNumber}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {format(new Date(order.createdAt), "MMM d, yyyy · h:mm a")}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-muted transition-colors no-print"
          >
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Order Items */}
      <div className="px-6 py-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Order Details</p>
        <div className="space-y-2.5">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <p className="text-sm text-foreground">
                  {item.name}
                  {item.variant && <span className="text-muted-foreground"> ({item.variant})</span>}
                </p>
                <p className="text-[11px] text-muted-foreground">Qty: {item.quantity} × Ksh {Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <span className="text-sm text-foreground shrink-0">
                Ksh {Number(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Totals */}
      <div className="px-6 py-4 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">Ksh {Number(order.subtotal || order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        {Number(order.deliveryFee) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-foreground">Ksh {Number(order.deliveryFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="text-foreground">Ksh 0.00</span>
        </div>
      </div>

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Grand Total */}
      <div className="px-6 py-4">
        <div className="flex justify-between text-base">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-medium text-foreground">Ksh {Number(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Customer Info */}
      <div className="px-6 py-4 space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Customer Information</p>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Customer</span>
          <span className="text-foreground">{order.customerName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phone</span>
          <span className="text-foreground">{order.customerPhone}</span>
        </div>
        {order.deliveryAddress && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground shrink-0">Address</span>
            <span className="text-foreground text-right max-w-[200px]">{order.deliveryAddress}</span>
          </div>
        )}
        {order.deliveryZone && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Zone</span>
            <span className="text-foreground">{order.deliveryZone}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <>
          <div className="mx-5 border-t border-dashed" />
          <div className="px-6 py-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Notes</p>
            <p className="text-sm text-muted-foreground italic">&ldquo;{order.notes}&rdquo;</p>
          </div>
        </>
      )}

      {/* Dashed divider */}
      <div className="mx-5 border-t border-dashed" />

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-[10px] text-muted-foreground">Thank you for your order!</p>
      </div>

      {/* Actions bar — hidden on print */}
      <div className="border-t p-4 flex items-center gap-2 no-print">
        <Select defaultValue={order.status} onValueChange={(val) => onUpdateStatus(order.id, val)}>
          <SelectTrigger className="h-8 flex-1 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={() => window.print()}
          className="h-8 px-3 text-xs font-normal border rounded-md hover:bg-muted/50 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </div>
    </div>
  );
}
