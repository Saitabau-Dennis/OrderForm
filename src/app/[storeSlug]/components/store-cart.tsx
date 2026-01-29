"use client";

import { Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
        className="flex w-full flex-col sm:max-w-md p-0 gap-0 border-l-0 sm:border-l border-gray-100 shadow-2xl bg-white transition-all duration-500 ease-in-out"
      >
        <SheetHeader className="px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-white/80 backdrop-blur-md z-10 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <SheetTitle className="text-xl font-bold font-sora flex items-center gap-2">
                Your Bag
                <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-black text-[10px] font-bold text-white px-2">
                {cartCount}
                </span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          {cart.length === 0 ? (
            <div className="flex h-[70vh] flex-col items-center justify-center space-y-6 text-center">
              <div className="h-24 w-24 rounded-full bg-gray-50 flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-gray-300" />
              </div>
              <div className="space-y-2 max-w-[240px]">
                <h3 className="text-xl font-bold text-gray-900 font-sora">Your bag is empty</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Looks like you haven't added anything to your bag yet.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={closeCart}
                className="rounded-full px-8 h-12 border-gray-200"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 py-8 pb-32">
              {cart.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex gap-5 group relative">
                   <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="space-y-1.5 pr-8">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-semibold text-gray-900 text-base leading-tight font-sora">
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 text-sm">
                          {currency} {(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.variant && (
                          <>
                            <span className="text-gray-200">-</span>
                            <p className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                              {item.variant}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-black transition-all active:scale-95"
                          onClick={() => updateQuantity(item.id, -1, item.variant)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-black transition-all active:scale-95"
                          onClick={() => updateQuantity(item.id, 1, item.variant)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.variant)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-6 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-muted-foreground text-sm">
                    <span>Subtotal</span>
                    <span>{currency} {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-sm">
                    <span>Shipping</span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Calculated at checkout</span>
                </div>
                <Separator className="my-2 opacity-50" />
                <div className="flex items-center justify-between text-xl font-bold text-gray-900 font-sora">
                    <span>Total</span>
                    <span>{currency} {cartTotal.toLocaleString()}</span>
                </div>
            </div>

            <Button
              className="w-full h-14 text-base font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
              style={{
                backgroundColor: brandColor,
                color: "white"
              }}
              onClick={handleCheckout}
            >
                Secure Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}