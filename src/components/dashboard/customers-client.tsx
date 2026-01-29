"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { ArrowUpDown, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CustomerColumn = {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: string;
  lastOrderDate: string;
};

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent hover:text-primary font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-bold">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone className="h-3 w-3" />
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground truncate max-w-[200px]">
        <MapPin className="h-3 w-3" />
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "totalOrders",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent hover:text-primary font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Orders
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    cell: ({ row }) => <div className="pl-4 font-mono">{row.getValue("totalOrders")}</div>,
  },
  {
    accessorKey: "totalSpent",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent hover:text-primary font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Spent
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    cell: ({ row }) => <div className="pl-4 font-mono font-bold text-green-600">{row.getValue("totalSpent")}</div>,
  },
  {
    accessorKey: "lastOrderDate",
    header: "Last Order",
    cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("lastOrderDate")}</div>,
  },
];

interface CustomersClientProps {
  data: CustomerColumn[];
}

export function CustomersClient({ data }: CustomersClientProps) {
  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-sora">Customers</h2>
            <p className="text-muted-foreground font-sans">
                Manage and view details of your {data.length} unique customers.
            </p>
        </div>
        <DataTable searchKey="name" columns={columns} data={data} placeholder="Search customers..." />
    </div>
  );
}
