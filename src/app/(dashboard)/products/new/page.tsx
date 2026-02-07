"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/dashboard/button";
import { ProductWizard } from "@/components/dashboard/product-wizard";

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/products");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col animate-appear">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground rounded-lg h-9 px-3"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <ProductWizard onSuccess={handleSuccess} />
    </div>
  );
}