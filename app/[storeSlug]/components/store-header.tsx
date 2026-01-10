"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreHeaderProps {
  name: string;
  logoUrl?: string;
  cartCount: number;
  onOpenCart: () => void;
}

export function StoreHeader({ name, logoUrl, cartCount, onOpenCart }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold"
              style={{ backgroundColor: "var(--store-brand)" }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-lg font-bold text-gray-900">{name}</h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={onOpenCart}
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: "var(--store-brand)" }}
            >
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
