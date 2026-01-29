"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductWizard } from "@/components/dashboard/product-wizard";

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/products");
    router.refresh();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-appear">
      <div className="flex items-center gap-4 mb-6">
        <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-primary" 
            onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <ProductWizard onSuccess={handleSuccess} />
    </div>
  );
}