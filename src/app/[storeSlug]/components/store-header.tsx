"use client";

import { ShoppingBag, Search, ArrowLeft, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "./store-context";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

interface StoreHeaderProps {
  name: string;
  logoUrl?: string;
}

export function StoreHeader({ name, logoUrl }: StoreHeaderProps) {
  const { openCart, cartCount, brandColor, searchQuery, setSearchQuery } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const isProductPage = pathname.includes("/product/");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] font-dm-sans",
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        )}
      >
        {/* Colored accent bar at top */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${brandColor}, ${brandColor}88, transparent)` }} />

        <div className={cn("container mx-auto px-5 md:px-8 transition-all duration-500", scrolled ? "py-3" : "py-4 md:py-5")}>
          <div className="flex items-center justify-between">

            {/* Left */}
            <div className="flex items-center gap-3 flex-1">
              {isProductPage ? (
                <button
                  onClick={() => router.back()}
                  className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span className="text-xs font-semibold tracking-wide uppercase hidden sm:inline">Back</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all"
                >
                  <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </button>
              )}
            </div>

            {/* Center: Brand */}
            <Link
              href={`/${params.storeSlug}`}
              className="flex items-center gap-2.5 group absolute left-1/2 -translate-x-1/2"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={name}
                  className={cn(
                    "rounded-full object-cover ring-2 ring-stone-100 transition-all duration-500",
                    scrolled ? "h-7 w-7" : "h-8 w-8"
                  )}
                />
              ) : (
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center text-white font-bold transition-all duration-500",
                    scrolled ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-[11px]"
                  )}
                  style={{ backgroundColor: brandColor }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={cn(
                "font-bold text-stone-900 tracking-[-0.02em] transition-all duration-500 whitespace-nowrap",
                scrolled ? "text-[15px]" : "text-base"
              )}>
                {name}
              </span>
            </Link>

            {/* Right: Cart */}
            <div className="flex items-center justify-end flex-1">
              <button
                onClick={openCart}
                className="relative h-9 w-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] flex items-center justify-center rounded-full text-[9px] font-bold text-white px-1 ring-2 ring-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white animate-in fade-in duration-300 font-dm-sans">
          <div className="container mx-auto px-5 md:px-8 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full h-14 pl-8 pr-4 text-xl font-medium text-stone-900 placeholder:text-stone-300 border-b-2 border-stone-900 bg-transparent focus:outline-none font-dm-sans"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchOpen(false);
                    }
                    if (e.key === "Enter") {
                      setIsSearchOpen(false);
                    }
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="h-10 w-10 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {searchQuery && (
              <p className="mt-6 text-sm text-stone-400">
                Press <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-600 font-mono text-xs">Enter</kbd> or close to see results
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}