"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "./store-context";
import { ProductCard } from "./product-card";

interface ProductDetailsProps {
  product: any;
  store: any;
  similarProducts?: any[];
}

export function ProductDetails({
  product,
  store,
  similarProducts = [],
}: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart, currency, brandColor } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = product.sizes ? product.sizes.split(",").map((s: string) => s.trim()) : [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      return;
    }
    addToCart(product, quantity, selectedSize || undefined);
  };

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-32">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <button onClick={() => router.back()} className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Collection
          </button>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-start">
          
          {/* Gallery Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm w-full max-w-sm mx-auto lg:mx-0">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-200">
                  <ShoppingBag className="h-12 w-12" strokeWidth={1} />
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="max-w-xl space-y-8">
              {/* Header */}
              <div className="space-y-3 text-left">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white bg-black px-1.5 py-0.5 rounded">
                    {product.category || "New Arrival"}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-sora tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-xl font-bold text-gray-900">
                    {currency} {product.price.toLocaleString()}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Description</h3>
                  <div className="text-sm md:text-base text-gray-500 font-light leading-relaxed">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Selectors */}
              <div className="space-y-6">
                {/* Size Selector */}
                {sizes.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Select Size</h3>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size: string) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                "h-10 min-w-[2.5rem] px-4 rounded-lg border-2 font-bold text-[11px] transition-all duration-300",
                                selectedSize === size
                                    ? "border-gray-900 bg-gray-900 text-white shadow-md scale-105"
                                    : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                                )}
                            >
                                {size}
                            </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity & Actions - Hidden on mobile bottom, shown on desktop */}
                <div className="space-y-3 hidden sm:block">
                    <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Quantity</h3>
                    <div className="flex flex-row items-stretch gap-3">
                        <div className="flex h-11 w-32 items-center justify-between rounded-xl border-2 border-gray-100 bg-gray-50/50 px-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-base font-bold text-gray-900 font-sora tabular-nums">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>

                        <Button
                            size="lg"
                            className="h-11 flex-1 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] text-white flex items-center justify-center gap-2"
                            onClick={handleAddToCart}
                            disabled={sizes.length > 0 && !selectedSize}
                            style={{ backgroundColor: brandColor }}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Add to Bag
                        </Button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Recommendation</h2>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-sora tracking-tight">You May Also Like</h3>
              </div>
              <button 
                onClick={() => router.push(`/${store.slug}`)}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-900 underline underline-offset-8 decoration-gray-200 hover:decoration-gray-900 transition-all"
              >
                  View All
              </button>
          </div>
          
          {similarProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {similarProducts.map((simProduct) => (
                    <ProductCard
                        key={simProduct.id}
                        product={simProduct}
                    />
                ))}
            </div>
          ) : (
            <div className="py-10 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-400 font-light italic">No other items found.</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 sm:hidden pb-safe">
        <div className="flex items-center gap-3">
            <div className="flex h-12 w-28 items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-3">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold text-gray-900 font-sora tabular-nums">
                    {quantity}
                </span>
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            <Button
                size="lg"
                className="h-12 flex-1 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl text-white flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={sizes.length > 0 && !selectedSize}
                style={{ backgroundColor: brandColor }}
            >
                <ShoppingBag className="h-4 w-4" />
                Add to Bag
            </Button>
        </div>
      </div>
    </div>
  );
}
