'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, X } from 'lucide-react';
import Link from 'next/link';

// Mock data for now, would fetch from API in real app
const store = {
  name: "Boutique Store",
  whatsappNumber: "254700000000",
  currency: "KES"
};

const products = [
  { id: '1', name: 'Vintage Dress', price: 2500, imageUrl: 'https://placehold.co/400x400' },
  { id: '2', name: 'Leather Bag', price: 4500, imageUrl: 'https://placehold.co/400x400' },
  { id: '3', name: 'Summer Hat', price: 1200, imageUrl: 'https://placehold.co/400x400' },
];

export default function StorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  // Unwrap params using React.use() or await in async component (this is a client component so we can't await params directly in props)
  // But for Next.js 15, params is a promise.
  // Since this is a client component, we need to handle the promise.
  // However, the easiest way is to make the page async server component and pass data to a client component.
  // For simplicity in this single file, I'll assume we can use `use` or just ignore the slug for the mock.

  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const product = products.find(p => p.id === id);
    return total + (product ? product.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleCheckout = () => {
    const message = `Hi, I'd like to order:\n\n${Object.entries(cart).map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      return `- ${product?.name} x${qty} (${store.currency} ${product?.price! * qty})`;
    }).join('\n')}\n\nTotal: ${store.currency} ${cartTotal}`;

    const url = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 px-4 py-4 backdrop-blur-md">
        <h1 className="text-center text-xl font-bold text-primary">{store.name}</h1>
      </header>

      {/* Product Grid */}
      <div className="mx-auto max-w-md p-4">
        <div className="grid gap-4">
          {products.map(product => (
            <div key={product.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{store.currency} {product.price}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer / Bottom Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white p-4 shadow-lg">
          {!isCartOpen ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex w-full items-center justify-between rounded-lg bg-primary px-4 py-3 text-white"
            >
              <span className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Cart ({cartCount})
              </span>
              <span className="font-bold">{store.currency} {cartTotal}</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)}><X className="h-6 w-6" /></button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3">
                {Object.entries(cart).map(([id, qty]) => {
                  const product = products.find(p => p.id === id);
                  if (!product) return null;
                  return (
                    <div key={id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{store.currency} {product.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => removeFromCart(id)} className="rounded-full bg-gray-100 p-1"><Minus className="h-4 w-4" /></button>
                        <span className="w-4 text-center">{qty}</span>
                        <button onClick={() => addToCart(id)} className="rounded-full bg-gray-100 p-1"><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="mb-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{store.currency} {cartTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-lg bg-[#25D366] py-3 font-bold text-white hover:bg-[#20bd5a]"
                >
                  Order on WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-primary">
        <p>Powered by <Link href="/" className="font-bold hover:underline">OrderForm.store</Link></p>
      </footer>
    </div>
  );
}
