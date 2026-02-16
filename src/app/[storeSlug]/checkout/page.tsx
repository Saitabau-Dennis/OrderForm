"use client";

import { useStore } from "../components/store-context";
import { CheckoutForm, CheckoutFormData } from "../components/checkout-form";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { storeSlug } = useParams();
  const router = useRouter();
  const { cart, cartTotal, currency, brandColor, whatsappNumber, storeId, storeName } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-dm-sans bg-white">
        <ShoppingBag className="h-12 w-12 text-stone-200 mb-6" strokeWidth={1} />
        <h2 className="text-xl font-bold text-stone-900 mb-2">Your bag is empty</h2>
        <p className="text-sm text-stone-400 mb-8">Add some items before checking out.</p>
        <Link href={`/${storeSlug}`}>
          <Button className="rounded-xl h-12 px-8 text-sm font-semibold" style={{ backgroundColor: brandColor, color: "white" }}>
            Return to Store
          </Button>
        </Link>
      </div>
    );
  }

  const handleProcessCheckout = async (data: CheckoutFormData) => {
    setIsLoading(true);
    try {
      const orderData = {
        storeId,
        customerName: data.name,
        customerPhone: data.phone,
        deliveryAddress: data.address,
        totalAmount: cartTotal,
        notes: data.notes,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          variant: item.variant
        }))
      };

      const result = await createOrder(orderData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      const orderId = result.orderId;

      if (data.paymentMethod === 'whatsapp') {
        const message = `*NEW ORDER: ${storeName.toUpperCase()}*\n\n` +
          `*Order ID:* #${orderId}\n\n` +
          `*CUSTOMER DETAILS*\n` +
          `Name: ${data.name}\n` +
          `Phone: ${data.phone}\n` +
          `Address: ${data.address}\n` +
          `${data.notes ? `Notes: ${data.notes}\n` : ''}\n` +
          `*ORDER SUMMARY*\n` +
          `${cart.map(item =>
            `- ${item.name} x${item.quantity}${item.variant ? ` (${item.variant})` : ''} (${currency} ${(item.price * item.quantity).toLocaleString()})`
          ).join('\n')}\n\n` +
          `*TOTAL AMOUNT: ${currency} ${cartTotal.toLocaleString()}*\n\n` +
          `_Please confirm my order_`;

        let cleanPhone = whatsappNumber.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
          cleanPhone = '254' + cleanPhone.substring(1);
        }

        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        const newWindow = window.open(url, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-dm-sans">
      {/* Header */}
      <header className="border-b border-stone-100 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link href={`/${storeSlug}`} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </Link>
          <span className="text-sm font-bold text-stone-900">Checkout</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-12 max-w-5xl mx-auto">

          {/* Form */}
          <div className="lg:col-span-7">
            <CheckoutForm
              onSubmit={handleProcessCheckout}
              isLoading={isLoading}
              totalAmount={cartTotal}
              currency={currency}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="rounded-2xl border border-stone-100 p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400 mb-6">
                  Summary ({cart.length} {cart.length === 1 ? "item" : "items"})
                </h3>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex gap-3">
                      <div className="h-14 w-12 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-4 w-4 text-stone-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                          <p className="text-sm font-semibold text-stone-900 whitespace-nowrap">
                            {currency} {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-stone-400">
                          Qty: {item.quantity}{item.variant && ` · ${item.variant}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 mt-6 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Subtotal</span>
                    <span>{currency} {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Shipping</span>
                    <span className="text-xs font-medium" style={{ color: brandColor }}>Calculated next</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-stone-900 pt-3 border-t border-stone-100 mt-3">
                    <span>Total</span>
                    <span>{currency} {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
