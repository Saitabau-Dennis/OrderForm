"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlertModal } from "@/components/modals/alert-modal";
import { ProductsTable } from "@/components/dashboard/products-table";
import { ProductForm } from "@/components/dashboard/product-form";
import { deleteProduct } from "@/lib/actions/products";

interface ProductsClientProps {
  initialProducts: any[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

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
    // In a real app, we would refresh data here (e.g., router.refresh())
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => router.push("/products/new")} className="bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all rounded-xl h-11 px-6">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-none shadow-sm overflow-hidden">
        <ProductsTable
            products={initialProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={(open) => {
          if (!open) handleSheetClose();
          setIsSheetOpen(open);
      }}>
        <SheetContent className="w-full sm:max-w-[650px] p-0 bg-white border-l border-primary/10">
          <div className="h-full flex flex-col">
            <div className="bg-primary/5 px-8 py-6 border-b border-primary/10">
                <SheetHeader>
                <SheetTitle className="text-2xl font-medium font-raleway text-primary">
                    Edit Product
                </SheetTitle>
                <SheetDescription className="text-muted-foreground font-instrument-sans">
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

      <AlertModal
        isOpen={!!deleteProductData}
        onClose={() => setDeleteProductData(null)}
        onConfirm={confirmDelete}
        loading={isDeleteLoading}
        title="Delete Product?"
        description={`This action cannot be undone. This will permanently delete "${deleteProductData?.name}" and remove it from your store.`}
        variant="destructive"
        confirmText="Delete Product"
      />
    </div>
  );
}
