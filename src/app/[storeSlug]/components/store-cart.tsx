"use client";

import { Minus, Plus, ShoppingBag, ArrowRight, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "./store-context";
import { useRouter, useParams } from "next/navigation";

interface StoreCartProps {
  storeName: string;
  whatsappNumber: string;
  storeId: string;
}

export function StoreCart({ storeName, whatsappNumber, storeId }: StoreCartProps) {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    currency,
    brandColor,
    cartCount
  } = useStore();

  const router = useRouter();
  const params = useParams();

  const handleCheckout = () => {
    closeCart();
    router.push(`/${params.storeSlug}/checkout`);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-[420px] p-0 gap-0 border-l border-stone-100 shadow-2xl bg-white font-dm-sans"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-stone-100 flex-shrink-0">
          <SheetTitle className="text-lg font-bold font-dm-sans text-stone-900 flex items-center gap-3">
            Bag
            {cartCount > 0 && (
              <span className="text-xs font-medium text-stone-400">
                ({cartCount} {cartCount === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {cart.length === 0 ? (
            <div className="flex h-[65vh] flex-col items-center justify-center space-y-5 text-center px-6">
              <ShoppingBag className="h-12 w-12 text-stone-200" strokeWidth={1} />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-900">Your bag is empty</h3>
                <p className="text-sm text-stone-400 max-w-[200px] mx-auto leading-relaxed">
                  Start shopping to add items to your bag
                </p>
              </div>
              <button
                onClick={closeCart}
                className="text-sm font-semibold underline underline-offset-4 decoration-stone-300 hover:decoration-stone-800 text-stone-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex gap-4 p-6">
                  {/* Image */}
                  <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-stone-50">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-stone-300" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-stone-900 truncate">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-xs text-stone-400 mt-0.5">{item.variant}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.variant)}
                        className="text-stone-300 hover:text-stone-600 transition-colors p-1 -mr-1 flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                        <button
                          className="h-8 w-8 flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-50 transition-colors"
                          onClick={() => updateQuantity(item.id, -1, item.variant)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums text-stone-800 border-x border-stone-200">
                          {item.quantity}
                        </span>
                        <button
                          className="h-8 w-8 flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-50 transition-colors"
                          onClick={() => updateQuantity(item.id, 1, item.variant)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-bold text-stone-900">
                        {currency} {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-stone-100 p-6 space-y-5 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">Total</span>
              <span className="text-xl font-bold text-stone-900 font-dm-sans">
                {currency} {cartTotal.toLocaleString()}
              </span>
            </div>

            <button
              className="w-full h-13 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-md"
              style={{ backgroundColor: brandColor }}
              onClick={handleCheckout}
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-[10px] text-stone-400 text-center">
              Shipping calculated at checkout
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}