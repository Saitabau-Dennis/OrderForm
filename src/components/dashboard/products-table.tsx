"use client";

import { Edit, MoreHorizontal, Trash2, Plus, ImageOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  category?: string;
  sizes?: string;
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
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/5">
        <div className="p-6 rounded-full bg-primary/5 ring-1 ring-primary/10">
          <Plus className="h-10 w-10 text-primary/40" />
        </div>
        <div className="text-center space-y-1">
            <h3 className="text-lg font-medium text-foreground font-raleway">No products found</h3>
            <p className="text-sm text-muted-foreground font-instrument-sans">
            Get started by creating your first product.
            </p>
        </div>
      </div>
    );
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original;
        return (
            <Avatar className="h-12 w-12 rounded-xl border border-primary/10 shadow-sm">
                <AvatarImage src={product.imageUrl} alt={product.name} className="object-cover" />
                <AvatarFallback className="rounded-xl bg-primary/5 text-primary">
                {product.imageUrl ? <ImageOff className="h-4 w-4 opacity-50" /> : product.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground font-raleway text-base">
            {row.getValue("name")}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium font-sora text-foreground">
            KES {Number(row.getValue("price")).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return category ? (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-secondary-foreground/10">
                {category}
            </span>
        ) : (
            <span className="text-muted-foreground text-sm italic">Uncategorized</span>
        );
      },
    },
    {
      accessorKey: "sizes",
      header: "Sizes",
      cell: ({ row }) => {
        const sizes = row.getValue("sizes") as string;
        return (
            <div className="flex flex-wrap gap-1 max-w-[150px]">
                {sizes ? (
                    sizes.split(',').slice(0, 3).map((size, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground border uppercase">
                            {size.trim()}
                        </span>
                    ))
                ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                )}
                {sizes && sizes.split(',').length > 3 && (
                    <span className="text-[10px] text-muted-foreground self-center">...</span>
                )}
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
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm transition-all",
                isAvailable 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "bg-gray-100 text-gray-500 border-gray-200"
            )}>
                {isAvailable ? (
                    <>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
                        Active
                    </>
                ) : (
                    "Draft"
                )}
            </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
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
                      onClick={() => onEdit ? onEdit(product) : router.push(`/products/${product.id}`)}
                      className="cursor-pointer focus:bg-primary/5 focus:text-primary"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                      onClick={() => onDelete?.(product)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
      },
    },
  ];

  return (
    <DataTable columns={columns} data={products} searchKey="name" placeholder="Search products..." />
  );
}
