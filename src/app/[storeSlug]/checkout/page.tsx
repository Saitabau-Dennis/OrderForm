"use client";

import { useStore } from "../components/store-context";
import { CheckoutForm, CheckoutFormData } from "../components/checkout-form";
import { ArrowLeft, Loader2, ShieldCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { storeSlug } = useParams();
  const router = useRouter();
  const { cart, cartTotal, currency, brandColor, whatsappNumber, storeId } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // If cart is empty, redirect or show empty state
  if (cart.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full space-y-6">
                 <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="h-10 w-10 text-gray-300" />
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-sora text-gray-900">Your bag is empty</h2>
                    <p className="text-gray-500 text-sm">Add some items to your bag to proceed to checkout.</p>
                 </div>
                 <Link href={`/${storeSlug}`}>
                    <Button className="w-full h-12 rounded-xl text-base font-bold" style={{ backgroundColor: brandColor }}>
                        Return to Store
                    </Button>
                 </Link>
            </div>
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
          const message = `*NEW ORDER: ${useStore().storeName.toUpperCase()}*\n\n` +
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

          // Clean the store's whatsapp number (remove spaces, dashes, etc.)
          let cleanPhone = whatsappNumber.replace(/\D/g, '');
          
          // Handle Kenyan numbers starting with 0
          if (cleanPhone.startsWith('0')) {
              cleanPhone = '254' + cleanPhone.substring(1);
          }

          const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
          
          // Try opening in new tab, fallback to same tab if blocked (common after async await)
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
      <div className="min-h-screen bg-gray-50/50">
        {/* Simple Header */}
        <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-10">
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                <Link href={`/${storeSlug}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider hidden md:block">Back to Store</span>
                </Link>
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
                </div>
                <div className="w-20" /> {/* Spacer for balance */}
            </div>
        </header>

        <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
            <div className="grid lg:grid-cols-12 gap-8 md:gap-12 max-w-6xl mx-auto">

                {/* Left Column: Form */}
                <div className="lg:col-span-7 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold font-sora text-gray-900 mb-2">Checkout</h1>
                        <p className="text-gray-500">Complete your details to place the order.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                       <CheckoutForm
                            onSubmit={handleProcessCheckout}
                            isLoading={isLoading}
                            totalAmount={cartTotal}
                            currency={currency}
                            hideSummary={true}
                        />
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden p-6 md:p-8">
                            <h3 className="text-lg font-bold font-sora text-gray-900 mb-6">Order Summary</h3>

                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.variant}`} className="flex gap-4">
                                        <div className="h-16 w-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                    <ShoppingBag className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-medium text-gray-900 truncate pr-2">{item.name}</h4>
                                                <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                    {currency} {(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} {item.variant && `- ${item.variant}`}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-gray-100 my-6" />

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>{currency} {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Calculated next</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-100 mt-4">
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
