"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface ProductsClientProps {
  initialProducts: any[];
  canAddProduct: boolean;
}

export function ProductsClient({ initialProducts, canAddProduct }: ProductsClientProps) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Delete State
  const [deleteProductData, setDeleteProductData] = useState<any | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  };

  const handleDelete = (product: any) => {
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
    } catch (error) {
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

  // Filter products by status
  const filteredProducts = initialProducts.filter((product) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return product.isAvailable === true;
    if (statusFilter === "draft") return product.isAvailable === false;
    return true;
  });

  const activeCount = initialProducts.filter((p) => p.isAvailable).length;
  const draftCount = initialProducts.filter((p) => !p.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Title & Description */}
        <div className="space-y-1">
          <h2 className="text-3xl font-medium tracking-tight text-foreground font-poppins">
            Overview
          </h2>
          <p className="text-sm text-muted-foreground font-poppins">
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
                className="rounded-lg h-9 px-3 text-sm border-border bg-background hover:bg-accent transition-colors font-medium"
              >
                <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border border-border/60 shadow-lg bg-card p-1">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50 my-1" />
              <DropdownMenuItem
                onClick={() => setStatusFilter("all")}
                className={cn("cursor-pointer rounded-lg text-sm font-medium px-2 py-1.5", statusFilter === "all" && "bg-accent text-accent-foreground")}
              >
                All Products
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{initialProducts.length}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("active")}
                className={cn("cursor-pointer rounded-lg text-sm font-medium px-2 py-1.5", statusFilter === "active" && "bg-accent text-accent-foreground")}
              >
                Active
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{activeCount}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("draft")}
                className={cn("cursor-pointer rounded-lg text-sm font-medium px-2 py-1.5", statusFilter === "draft" && "bg-accent text-accent-foreground")}
              >
                Draft
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{draftCount}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="rounded-lg h-9 px-3 text-sm border-border bg-background hover:bg-accent transition-colors font-medium"
          >
            <FileDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            Export
          </Button>

          <Button
            onClick={() => router.push(canAddProduct ? "/products/new" : "/settings")}
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 transition-all rounded-lg h-9 px-4 text-sm font-medium shadow-sm"
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
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={(open) => {
          if (!open) handleSheetClose();
          setIsSheetOpen(open);
      }}>
        <SheetContent className="w-full sm:max-w-[760px] p-0 bg-card border-l border-border">
          <div className="h-full flex flex-col">
            <div className="px-6 py-5 border-b border-border/80">
                <SheetHeader>
                <SheetTitle className="text-lg font-semibold text-foreground">
                    Edit Product
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                    Update product information, media, and availability.
                </SheetDescription>
                </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ProductForm
                initialData={selectedProduct}
                onSuccess={handleFormSuccess}
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
