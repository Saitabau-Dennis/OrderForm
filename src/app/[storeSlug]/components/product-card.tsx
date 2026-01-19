"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
  };
  currency: string;
  onAdd: (productId: string) => void;
}

export function ProductCard({ product, currency, onAdd }: ProductCardProps) {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/${storeSlug}/product/${product.id}`} className="flex-1">
        <div className="aspect-square overflow-hidden bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-1 font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {currency} {product.price.toLocaleString()}
          </p>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {product.description}
            </p>
          )}
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd(product.id);
          }}
          className="w-full rounded-lg font-medium shadow-sm transition-transform active:scale-95"
          size="sm"
          style={{ backgroundColor: "var(--store-brand)" }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
