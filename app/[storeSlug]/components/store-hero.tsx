"use client";

import { ShoppingBag, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StoreHeroProps {
  name: string;
  description?: string;
  brandColor: string;
}

export function StoreHero({ name, description, brandColor }: StoreHeroProps) {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Calculate a lighter version of the brand color for the gradient
  // This is a simple approximation. For better results, we might want to use a color manipulation library
  // or just rely on opacity.

  return (
    <div
      className="relative overflow-hidden rounded-3xl mb-12 text-white shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)`,
      }}
    >
      {/* Abstract Background Patterns */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-black/10 blur-3xl" />

      <div className="relative flex flex-col items-center justify-center px-6 py-24 text-center sm:px-12 lg:px-16">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-inner">
          <ShoppingBag className="h-8 w-8 text-white" />
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-raleway">
          {name}
        </h1>

        {description && (
          <p className="mb-8 max-w-2xl text-lg text-white/90 sm:text-xl font-instrument-sans leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={scrollToProducts}
            className="group bg-white text-black hover:bg-white/90 border-0 font-semibold text-base h-12 px-8 rounded-full shadow-lg transition-all hover:scale-105"
            style={{ color: brandColor }}
          >
            Start Shopping
            <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
