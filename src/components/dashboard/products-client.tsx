"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProductsTable } from "@/components/dashboard/products-table";
import { ProductForm } from "@/components/dashboard/product-form";

interface ProductsClientProps {
  initialProducts: any[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);



  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
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
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-sans">Products</h2>
        <Button onClick={() => router.push("/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="mt-4">
        <ProductsTable products={initialProducts} onEdit={handleEdit} />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Edit Product
            </SheetTitle>
            <SheetDescription>
              Make changes to your product here.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ProductForm
              initialData={selectedProduct}
              onSuccess={handleFormSuccess}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
