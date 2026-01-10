"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/dashboard/product-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/products");
    router.refresh();
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight font-sans">Add New Product</h2>
      </div>

      <div className="mt-4">
        <ProductForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
