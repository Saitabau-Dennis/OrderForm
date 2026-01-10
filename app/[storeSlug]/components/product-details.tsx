"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-context";

interface ProductDetailsProps {
  product: any;
  store: any;
}

export function ProductDetails({
  product,
  store,
}: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = product.sizes ? product.sizes.split(",").map((s: string) => s.trim()) : [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      return;
    }
    addToCart(product, quantity, selectedSize || undefined);
    setQuantity(1);
    setSelectedSize(null);
  };

  return (
    <main className="container mx-auto px-4 py-8 pb-24">
      <Button
        variant="ghost"
        className="mb-8 pl-0 hover:bg-transparent hover:text-gray-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to store
      </Button>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <ShoppingBag className="h-20 w-20" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-raleway">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-medium text-gray-900 font-instrument-sans">
            {store.currency} {product.price.toLocaleString()}
          </p>

          <div className="mt-8 space-y-6">
            {product.description && (
              <div className="prose prose-sm text-gray-600">
                <p>{product.description}</p>
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition-all",
                        selectedSize === size
                          ? "border-transparent text-white shadow-md"
                          : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                      )}
                      style={
                        selectedSize === size
                          ? { backgroundColor: store.brandColor || "#30382F" }
                          : {}
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="w-full sm:w-32">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Quantity
                </label>
                <div className="flex h-12 items-center rounded-full border border-gray-200 bg-gray-50 px-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center font-medium text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                className="h-12 flex-1 rounded-full text-base font-semibold shadow-lg transition-transform active:scale-95"
                onClick={handleAddToCart}
                disabled={sizes.length > 0 && !selectedSize}
                style={{ backgroundColor: store.brandColor || "#30382F" }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
