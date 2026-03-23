"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { Plus, Filter, FileDown, Settings } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/dashboard/dashboard-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";
import { ProductsTable } from "@/components/dashboard/products-table";
import { ProductForm } from "@/components/dashboard/product-form";
import { deleteProduct } from "@/lib/actions/products";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductRecord {
  id: string;
  name: string;
  imageUrl?: string | null;
  price?: number;
  stock?: number | null;
  optionStocks?: Array<{ optionValue: string; stock: number }>;
  isAvailable: boolean;
  category?: string | null;
  description?: string | null;
  sizes?: string;
  createdAt?: string;
  galleryImages?: string[];
  _count?: { orderItems?: number };
}

type TableProduct = ComponentProps<typeof ProductsTable>["products"][number];
type ProductFormInitialData = NonNullable<ComponentProps<typeof ProductForm>["initialData"]>;

interface ProductsClientProps {
  initialProducts: ProductRecord[];
  canAddProduct: boolean;
}

export function ProductsClient({ initialProducts, canAddProduct }: ProductsClientProps) {
  const router = useRouter();
  const topLoader = useTopLoader();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductFormInitialData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Delete State
  const [deleteProductData, setDeleteProductData] = useState<TableProduct | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleEdit = (product: TableProduct) => {
    const rawProduct = initialProducts.find((item) => item.id === product.id);
    if (!rawProduct) return;
    setSelectedProduct(toProductFormInitialData(rawProduct));
    setIsSheetOpen(true);
  };

  const handleDelete = (product: TableProduct) => {
    setDeleteProductData(product);
  };

  const confirmDelete = async () => {
    if (!deleteProductData) return;

    setIsDeleteLoading(true);
    try {
        const result = await deleteProduct(deleteProductData.id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Product deleted successfully");
            setDeleteProductData(null);
            router.refresh();
        }
    } catch {
        toast.error("Something went wrong");
    } finally {
        setIsDeleteLoading(false);
    }
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSuccess = () => {
    setIsSheetOpen(false);
    router.refresh();
  };

  const handleAddProductClick = () => {
    topLoader.start();
    router.push(canAddProduct ? `/products/new?fresh=${Date.now()}` : "/settings");
  };

  // Filter products by status
  const filteredProducts = initialProducts.filter((product) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return product.isAvailable === true;
    if (statusFilter === "draft") return product.isAvailable === false;
    return true;
  });
  const tableProducts = filteredProducts.map(toTableProduct);

  const activeCount = initialProducts.filter((p) => p.isAvailable).length;
  const draftCount = initialProducts.filter((p) => !p.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Title & Description */}
        <div className="space-y-1">
          <h2 className="text-2xl font-medium tracking-tight text-foreground font-poppins">
            Overview
          </h2>
          <p className="text-xs text-muted-foreground font-poppins">
            Manage your products and view their sales performance.
          </p>
        </div>

        {/* Right: Filter / Export / Add Product */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-xl border-border bg-card px-4 text-foreground hover:bg-muted hover:text-foreground"
              >
                <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setStatusFilter("all")}
                className={cn(statusFilter === "all" && "bg-primary/5 text-primary")}
              >
                All Products
                <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{initialProducts.length}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("active")}
                className={cn(statusFilter === "active" && "bg-primary/5 text-primary")}
              >
                Active
                <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{activeCount}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("draft")}
                className={cn(statusFilter === "draft" && "bg-primary/5 text-primary")}
              >
                Draft
                <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{draftCount}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
          >
            <FileDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            Export
          </Button>

          <Button
            onClick={handleAddProductClick}
            size="sm"
          >
            {canAddProduct ? (
              <Plus className="mr-2 h-3.5 w-3.5" />
            ) : (
              <Settings className="mr-2 h-3.5 w-3.5" />
            )}
            {canAddProduct ? "Add Product" : "Configure Store"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Products Table */}
      <div>
        <ProductsTable
            products={tableProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={(open) => {
          if (!open) handleSheetClose();
          setIsSheetOpen(open);
      }}>
        <SheetContent className="w-full border-l border-border bg-card p-0 sm:max-w-[860px]">
          <div className="flex h-full flex-col">
            <div className="sticky top-0 z-20 border-b border-border/80 bg-card px-6 py-5">
                <SheetHeader>
                <div className="flex items-start justify-between gap-4 pr-10">
                  <div>
                    <SheetTitle className="text-xl font-semibold tracking-tight text-foreground">
                        Edit Product
                    </SheetTitle>
                    <SheetDescription className="mt-1 text-xs text-muted-foreground">
                        Update product information, media, and availability without leaving the catalog.
                    </SheetDescription>
                  </div>
                  {selectedProduct ? (
                    <div className="rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
                      {selectedProduct.isAvailable ? "Active" : "Draft"}
                    </div>
                  ) : null}
                </div>
                </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <ProductForm
                initialData={selectedProduct}
                onSuccess={handleFormSuccess}
                onCancel={handleSheetClose}
                layout="sheet"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>



      {/* Delete Confirmation */}
      <AlertModal
        isOpen={!!deleteProductData}
        onClose={() => setDeleteProductData(null)}
        onConfirm={confirmDelete}
        loading={isDeleteLoading}
        title="Confirm deletion of product"
        description={`You are about to permanently delete "${deleteProductData?.name}" from your store. This action cannot be undone.`}
        variant="destructive"
        confirmText="Delete product"
      />
    </div>
  );
}

function toTableProduct(product: ProductRecord): TableProduct {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price ?? 0),
    imageUrl: product.imageUrl ?? undefined,
    isAvailable: product.isAvailable,
    category: product.category ?? undefined,
    sizes: product.sizes ?? undefined,
    createdAt: product.createdAt,
    _count: product._count,
  };
}

function toProductFormInitialData(product: ProductRecord): ProductFormInitialData {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    stock: typeof product.stock === "number" ? product.stock : "",
    optionStocks: Array.isArray(product.optionStocks)
      ? Object.fromEntries(
          product.optionStocks.map((row) => [row.optionValue, Math.max(0, Math.trunc(Number(row.stock)))])
        )
      : {},
    category: product.category ?? "",
    isAvailable: product.isAvailable,
    imageUrl: product.imageUrl ?? "",
    galleryImages: Array.isArray(product.galleryImages)
      ? product.galleryImages.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      : [],
    sizes: product.sizes ?? "",
  };
}
