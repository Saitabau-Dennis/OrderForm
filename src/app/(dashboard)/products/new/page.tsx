"use client";

import { useRouter } from "next/navigation";

import { ProductWizard } from "@/components/dashboard/product-wizard";

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/products");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] animate-appear p-4 sm:p-6 md:p-8">
      <ProductWizard onSuccess={handleSuccess} />
    </div>
  );
}
