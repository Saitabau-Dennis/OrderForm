"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/dashboard/button";
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
import { cn } from "@/lib/utils";

interface ProductsClientProps {
  initialProducts: any[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Delete State
  const [deleteProductData, setDeleteProductData] = useState<any | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Edit confirmation state
  const [editProductData, setEditProductData] = useState<any | null>(null);

  const handleEdit = (product: any) => {
    setEditProductData(product);
  };

  const confirmEdit = () => {
    if (!editProductData) return;
    setSelectedProduct(editProductData);
    setIsSheetOpen(true);
    setEditProductData(null);
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
          <h2 className="text-xl font-semibold tracking-tight text-foreground font-poppins">
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
                className="rounded-lg h-9 px-3 text-sm border-border bg-background hover:bg-accent transition-colors"
              >
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl border border-border shadow-lg bg-card">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setStatusFilter("all")}
                className={cn("cursor-pointer rounded-lg text-sm", statusFilter === "all" && "bg-accent")}
              >
                All Products
                <span className="ml-auto text-xs text-muted-foreground">{initialProducts.length}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("active")}
                className={cn("cursor-pointer rounded-lg text-sm", statusFilter === "active" && "bg-accent")}
              >
                Active
                <span className="ml-auto text-xs text-muted-foreground">{activeCount}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("draft")}
                className={cn("cursor-pointer rounded-lg text-sm", statusFilter === "draft" && "bg-accent")}
              >
                Draft
                <span className="ml-auto text-xs text-muted-foreground">{draftCount}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => router.push("/products/new")}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-lg h-9 px-4 text-sm"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Product
          </Button>
        </div>
      </div>

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
        <SheetContent className="w-full sm:max-w-[650px] p-0 bg-card border-l border-border">
          <div className="h-full flex flex-col">
            <div className="bg-primary/5 px-8 py-6 border-b border-border">
                <SheetHeader>
                <SheetTitle className="text-2xl font-medium font-poppins text-primary">
                    Edit Product
                </SheetTitle>
                <SheetDescription className="text-muted-foreground font-poppins">
                    Make changes to your product details and settings.
                </SheetDescription>
                </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <ProductForm
                initialData={selectedProduct}
                onSuccess={handleFormSuccess}
                layout="sheet"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Confirmation */}
      <AlertModal
        isOpen={!!editProductData}
        onClose={() => setEditProductData(null)}
        onConfirm={confirmEdit}
        loading={false}
        title="Edit product"
        description={`You are about to edit "${editProductData?.name}". Any unsaved changes will modify this product in your store.`}
        variant="default"
        confirmText="Continue"
      />

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
