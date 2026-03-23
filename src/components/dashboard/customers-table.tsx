"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Users } from "lucide-react";

import { Button } from "@/components/dashboard/dashboard-button";
import { DataTable } from "@/components/dashboard/dashboard-data-table";

export type CustomerColumn = {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: string;
  lastOrderDate: string;
};

interface CustomersTableProps {
  data: CustomerColumn[];
}

export function CustomersTable({ data }: CustomersTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] space-y-3 rounded-xl border border-dashed border-border bg-card">
        <div className="p-4 rounded-xl bg-muted/50">
          <Users className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-xs font-medium text-foreground font-poppins">No customers yet</h3>
          <p className="text-xs text-muted-foreground font-poppins">
            Customers will appear here once they place an order.
          </p>
        </div>
      </div>
    );
  }

  const columns: ColumnDef<CustomerColumn>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent hover:text-primary font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {row.getValue("phone")}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm truncate max-w-[200px]">
          <span className="truncate">{row.getValue("address")}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalOrders",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent hover:text-primary font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Orders
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4 text-sm text-muted-foreground">
          {row.getValue("totalOrders")}
        </div>
      ),
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent hover:text-primary font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Spent
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4 text-sm text-muted-foreground">
          {row.getValue("totalSpent")}
        </div>
      ),
    },
    {
      accessorKey: "lastOrderDate",
      header: "Last Order",
      cell: ({ row }) => {
        const date = row.getValue("lastOrderDate") as string;
        return (
          <div className="text-muted-foreground text-sm">
            {date}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      searchKey="name"
      columns={columns}
      data={data}
      placeholder="Filter Customer Name..."
      title="Customers"
      layout="nested"
    />
  );
}
