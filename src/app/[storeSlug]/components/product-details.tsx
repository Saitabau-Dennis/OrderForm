"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, ArrowLeft, Check } from "lucide-react";
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
  const [addedToCart, setAddedToCart] = useState(false);

  const sizes = product.sizes ? product.sizes.split(",").map((s: string) => s.trim()) : [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) return;
    addToCart(product, quantity, selectedSize || undefined);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-dm-sans">
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-5 md:px-8 py-5">
          <nav className="flex items-center gap-2 text-xs text-stone-400">
            <button onClick={() => router.back()} className="hover:text-stone-800 transition-colors flex items-center gap-1.5 font-medium">
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
            <span>/</span>
            <span className="text-stone-600 font-medium truncate">{product.name}</span>
          </nav>
        </div>

        <div className="container mx-auto px-5 md:px-8 pb-32">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Image – constrained size */}
            <div className="lg:col-span-5">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-50 lg:sticky lg:top-24 max-w-[420px] mx-auto lg:mx-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-stone-200" strokeWidth={1} />
                  </div>
                )}
              </div>
            </div>

            {/* Product Info – takes more space */}
            <div className="lg:col-span-7 lg:py-4">
              <div className="max-w-lg space-y-7">
                {/* Category + Name + Price */}
                <div className="space-y-3">
                  {product.category && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                      {product.category}
                    </span>
                  )}
                  <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-[-0.02em] font-dm-sans leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xl font-bold" style={{ color: brandColor }}>
                    {currency} {product.price.toLocaleString()}
                  </p>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="border-t border-stone-100 pt-6">
                    <p className="text-sm text-stone-500 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Size Selector */}
                {sizes.length > 0 && (
                  <div className="border-t border-stone-100 pt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">Size</h3>
                      {!selectedSize && (
                        <span className="text-[11px] text-amber-600 font-medium">Select a size</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "h-10 min-w-[2.5rem] px-3.5 rounded-lg border text-sm font-semibold transition-all",
                            selectedSize === size
                              ? "text-white border-transparent shadow-sm"
                              : "border-stone-200 text-stone-600 hover:border-stone-400 bg-white"
                          )}
                          style={selectedSize === size ? { backgroundColor: brandColor } : {}}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div className="border-t border-stone-100 pt-6 hidden sm:block">
                  <div className="flex items-center gap-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden h-11">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-full w-10 flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-50 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold tabular-nums text-stone-900 border-x border-stone-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-full w-10 flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-50 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Add to bag */}
                    <button
                      className={cn(
                        "flex-1 h-11 rounded-lg text-sm font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                        addedToCart ? "bg-emerald-600" : "hover:opacity-90",
                        (sizes.length > 0 && !selectedSize) && "opacity-40 cursor-not-allowed"
                      )}
                      style={!addedToCart ? { backgroundColor: brandColor } : {}}
                      onClick={handleAddToCart}
                      disabled={sizes.length > 0 && !selectedSize}
                    >
                      {addedToCart ? (
                        <><Check className="h-4 w-4" /> Added!</>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          Add to Bag — {currency} {(product.price * quantity).toLocaleString()}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-20 pt-10 border-t border-stone-100">
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-xl font-extrabold text-stone-900 tracking-[-0.02em] font-dm-sans">
                  You may also like
                </h2>
                <button
                  onClick={() => router.push(`/${store.slug}`)}
                  className="text-xs font-semibold text-stone-500 underline underline-offset-4 decoration-stone-200 hover:decoration-stone-500 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {similarProducts.map((simProduct) => (
                  <ProductCard key={simProduct.id} product={simProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-100 p-4 sm:hidden font-dm-sans">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden h-11">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-full w-9 flex items-center justify-center text-stone-400">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold tabular-nums text-stone-900 border-x border-stone-200">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="h-full w-9 flex items-center justify-center text-stone-400">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            className={cn(
              "flex-1 h-11 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2",
              addedToCart ? "bg-emerald-600" : "",
              (sizes.length > 0 && !selectedSize) && "opacity-40"
            )}
            style={!addedToCart ? { backgroundColor: brandColor } : {}}
            onClick={handleAddToCart}
            disabled={sizes.length > 0 && !selectedSize}
          >
            {addedToCart ? (
              <><Check className="h-4 w-4" /> Added!</>
            ) : (
              <><ShoppingBag className="h-4 w-4" /> Add — {currency} {(product.price * quantity).toLocaleString()}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
