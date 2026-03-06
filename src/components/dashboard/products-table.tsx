"use client";

import { Pencil, MoreHorizontal, Trash2, Package, ImageOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/dashboard/dashboard-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/dashboard/dashboard-data-table";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  category?: string;
  sizes?: string;
  createdAt?: string;
  _count?: { orderItems?: number };
}

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] space-y-3 rounded-xl border border-dashed border-border bg-card">
        <div className="p-4 rounded-xl bg-muted/50">
          <Package className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-medium text-foreground font-poppins">No products yet</h3>
          <p className="text-sm text-muted-foreground font-poppins">
            Get started by adding your first product.
          </p>
        </div>
      </div>
    );
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 rounded-xl border border-border/60 shrink-0">
              <AvatarImage src={product.imageUrl} alt={product.name} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                {product.imageUrl ? <ImageOff className="h-6 w-6 opacity-40" /> : product.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-normal text-foreground text-base">
              {product.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "isAvailable",
      header: "Status",
      cell: ({ row }) => {
        const isAvailable = row.getValue("isAvailable") as boolean;
        return (
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            isAvailable
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          )}>
            {isAvailable ? "Active" : "Draft"}
          </span>
        );
      },
    },

    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          KES {Number(row.getValue("price")).toLocaleString()}
        </span>
      ),
    },
    {
      id: "totalSales",
      header: "Total Sales",
      cell: ({ row }) => {
        const product = row.original;
        const sales = product._count?.orderItems ?? 0;
        return (
          <span className="text-sm text-muted-foreground tabular-nums">
            {sales}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        if (!createdAt) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted/80 transition-colors focus-visible:ring-1 focus-visible:ring-ring">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl border-2 border-border shadow-lg bg-white p-1.5">
                <DropdownMenuLabel className="font-normal text-xs text-muted-foreground px-3 py-1.5">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onEdit ? onEdit(product) : router.push(`/products/${product.id}`)}
                  className="cursor-pointer rounded-lg text-sm font-normal py-2 px-3 text-foreground hover:bg-muted/60 transition-colors"
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg text-sm font-normal py-2 px-3 text-foreground hover:bg-muted/60 transition-colors"
                  onClick={() => onDelete?.(product)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        placeholder="Search products..."
        title="Products"
        disableHover
        titleClassName="text-3xl font-medium"
    />
  );
}
