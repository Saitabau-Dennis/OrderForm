"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { ProductWizard } from "@/components/dashboard/product-wizard";

export function NewProductPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const freshToken = searchParams.get("fresh");

  const handleSuccess = () => {
    router.push("/products");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] animate-appear p-4 sm:p-6 md:p-8">
      <ProductWizard onSuccess={handleSuccess} freshToken={freshToken} />
    </div>
  );
}
