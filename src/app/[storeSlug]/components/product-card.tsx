"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useStore } from "./store-context";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { currency, addToCart, brandColor, secondaryColor } = useStore();
  const params = useParams();

  return (
    <div className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
      <Link href={`/${params.storeSlug}/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 bg-gray-50">
            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
          </div>
        )}

        {/* Hover Overlay with secondary color */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ backgroundColor: secondaryColor }}
        />
      </Link>

      <div className="p-3 space-y-3">
        <div className="space-y-1">
          <Link href={`/${params.storeSlug}/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-base font-bold" style={{ color: brandColor }}>
            {currency} {product.price.toLocaleString()}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all active:scale-95 text-white hover:opacity-90"
          style={{ backgroundColor: brandColor }}
        >
          <Plus className="h-4 w-4" />
          Add to Bag
        </button>
      </div>
    </div>
  );
}