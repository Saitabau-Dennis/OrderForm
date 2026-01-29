"use client";

import { Eye, MoreHorizontal, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatOrderId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";

interface Order {
  id: string;
  orderNumber?: number;
  displayId?: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

interface OrdersTableProps {
  orders: Order[];
  onView?: (order: Order) => void;
}

export function OrdersTable({ orders, onView }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/5">
        <div className="p-6 rounded-full bg-primary/5 ring-1 ring-primary/10">
          <ShoppingBag className="h-10 w-10 text-primary/40" />
        </div>
        <div className="text-center space-y-1">
            <h3 className="text-lg font-medium text-foreground font-raleway">No orders yet</h3>
            <p className="text-sm text-muted-foreground font-instrument-sans">
            When you receive orders, they will appear here.
            </p>
        </div>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": 
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": 
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered": 
        return "bg-green-100 text-green-800 border-green-200";
      case "completed": 
        return "bg-primary/10 text-primary border-primary/20 font-semibold";
      case "cancelled": 
        return "bg-red-100 text-red-800 border-red-200";
      default: 
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "displayId", // fallback handled in cell
      header: "Order ID",
      cell: ({ row }) => {
        const order = row.original;
        return (
            <span className="font-semibold text-foreground font-sora">
                {order.displayId ?? formatOrderId(order.orderNumber ?? order.id)}
            </span>
        );
      },
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        return (
            <div className="flex flex-col">
                <span className="font-medium text-foreground">{order.customerName}</span>
                <span className="text-xs text-muted-foreground font-mono">{order.customerPhone}</span>
            </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
            <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
                getStatusStyles(status)
            )}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        return (
            <span className="font-medium font-sora text-foreground">
                KES {amount.toLocaleString()}
            </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        return (
            <span className="text-muted-foreground text-sm">
                {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
            </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
            <div className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem 
                        onClick={() => onView?.(order)}
                        className="cursor-pointer focus:bg-primary/5 focus:text-primary"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
      },
    },
  ];

  return (
    <DataTable columns={columns} data={orders} searchKey="customerName" placeholder="Search customers..." />
  );
}
