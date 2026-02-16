"use client";

import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { useParams } from "next/navigation";
import { useStore } from "./store-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { currency, addToCart, brandColor } = useStore();
  const params = useParams();

  return (
    <div className="group font-dm-sans">
      {/* Image */}
      <Link
        href={`/${params.storeSlug}/product/${product.id}`}
        className="relative block aspect-square overflow-hidden rounded-2xl bg-stone-100 mb-3.5"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-stone-300" strokeWidth={1} />
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick-add bar */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="absolute bottom-3 left-3 right-3 h-10 rounded-xl bg-white flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-stone-800 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-stone-50 active:scale-[0.97] shadow-lg"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Add to Bag
        </button>
      </Link>

      {/* Info below image */}
      <div className="px-0.5 space-y-1">
        <Link href={`/${params.storeSlug}/product/${product.id}`}>
          <h3 className="text-[13px] font-semibold text-stone-800 leading-snug line-clamp-2 group-hover:text-stone-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[13px] font-bold" style={{ color: brandColor }}>
          {currency} {product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}