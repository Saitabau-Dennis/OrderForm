"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatOrderId } from "@/lib/utils";

interface OrderDetailsProps {
  order: any;
  onUpdateStatus: (status: string) => Promise<void>;
}

export function OrderDetails({ order, onUpdateStatus }: OrderDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      await onUpdateStatus(newStatus);
      setStatus(newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <Package className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{order.displayId ?? formatOrderId(order.orderNumber ?? order.id)}</h3>
          <p className="text-sm text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "PPP p")}
          </p>
        </div>
        <Badge variant={status === "completed" ? "default" : "outline"} className="capitalize flex gap-2 items-center px-3 py-1">
          {getStatusIcon(status)}
          {status}
        </Badge>
      </div>

      <Separator />

      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-6 py-6">
          {/* Status Control */}
          <div className="space-y-2">
            <Label>Update Status</Label>
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
            <h4 className="font-medium">Customer Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{order.customerPhone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Delivery Address</p>
                <p className="font-medium">{order.deliveryAddress || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="font-medium">Items</h4>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        {item.quantity} x KES {item.price.toLocaleString()}
                        {item.variant && ` - ${item.variant}`}
                      </p>
                    </div>
                    <p className="font-medium">
                      KES {(item.quantity * item.price).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No items (Mock Data)</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Financials */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>KES {order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span>KES 0</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2">
              <span>Total</span>
              <span>KES {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="pt-4 mt-auto border-t">
        <Button 
          className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200" 
          variant="outline" 
          onClick={() => window.print()}
        >
          Print Invoice
        </Button>
      </div>
    </div>
  );
}
