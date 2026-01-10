"use client";

import { ReactNode } from "react";
import { CartProvider, useCart } from "./cart-context";
import { StoreThemeProvider } from "./store-provider";
import { StoreHeader } from "./store-header";
import { StoreCart } from "./store-cart";

interface StoreWrapperProps {
  children: ReactNode;
  store: any;
}

// We need a separate component to use the hook
function StoreContentWithContext({ children, store }: StoreWrapperProps) {
    const { openCart, cartCount, isCartOpen, closeCart, cart, updateQuantity, cartTotal } = useCart();

    const handleCheckout = () => {
        const message = `Hi, I'd like to order from ${store.name}:\n\n${cart.map(item =>
          `- ${item.name} x${item.quantity}${item.variant ? ` (${item.variant})` : ''} (${store.currency} ${(item.price * item.quantity).toLocaleString()})`
        ).join('\n')}\n\nTotal: ${store.currency} ${cartTotal.toLocaleString()}`;

        const url = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      };

    return (
        <StoreThemeProvider brandColor={store.brandColor || "#30382F"}>
            <StoreHeader
                name={store.name}
                logoUrl={store.logoUrl}
                cartCount={cartCount}
                onOpenCart={openCart}
            />
            {children}
            <StoreCart
                isOpen={isCartOpen}
                onClose={closeCart}
                cartItems={cart}
                currency={store.currency}
                onUpdateQuantity={(id, delta, variant) => updateQuantity(id, delta, variant)}
                onCheckout={handleCheckout}
            />
        </StoreThemeProvider>
    );
}

export function StoreWrapper({ children, store }: StoreWrapperProps) {
  return (
    <CartProvider>
      <StoreContentWithContext store={store}>
        {children}
      </StoreContentWithContext>
    </CartProvider>
  );
}
