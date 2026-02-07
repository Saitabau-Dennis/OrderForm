"use client";

import { ShoppingBag, Search, ArrowLeft, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "./store-context";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

interface StoreHeaderProps {
  name: string;
  logoUrl?: string;
}

export function StoreHeader({ name, logoUrl }: StoreHeaderProps) {
  const { openCart, cartCount, brandColor, secondaryColor, searchQuery, setSearchQuery } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const isProductPage = pathname.includes("/product/");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative flex items-center justify-between gap-4">

          {/* Left: Back Button or Search Trigger */}
          <div className="flex items-center min-w-[100px] flex-1">
            {isProductPage ? (
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center gap-2 text-gray-900 hover:text-gray-600 transition-colors group h-11 w-11 -ml-2 rounded-full hover:bg-black/5"
                >
                    <ArrowLeft className="h-5 w-5 md:h-4 md:w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Back</span>
                </button>
            ) : (
                <div className={cn(
                    "flex items-center transition-all duration-500 relative",
                    isSearchOpen ? "flex-1 max-w-md" : "w-10"
                )}>
                    <div className={cn(
                        "flex items-center w-full transition-all duration-500 rounded-full border border-transparent",
                        isSearchOpen && "bg-gray-50 border-gray-100 pl-3 pr-1 py-1"
                    )}>
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={cn(
                                "transition-colors shrink-0 flex items-center justify-center",
                                isSearchOpen ? "text-gray-400" : "text-gray-900 hover:text-gray-600 h-10 w-10"
                            )}
                        >
                            <Search className={cn("transition-all", isSearchOpen ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </button>

                        {isSearchOpen && (
                            <>
                                <input
                                    autoFocus
                                    placeholder="Search collection..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-[13px] w-full px-2 h-7 placeholder:text-gray-400 text-gray-900 font-medium"
                                    onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
                                />
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setIsSearchOpen(false);
                                    }}
                                    className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-all"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
          </div>

          {/* Center: Brand Identity */}
          <div className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10",
            isSearchOpen ? "hidden lg:flex opacity-0 lg:opacity-100" : "flex"
          )}>
            <Link
                href={`/${params.storeSlug}`}
                className="flex items-center gap-2 md:gap-3 group"
            >
                {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={name}
                    className={cn(
                        "rounded-full object-cover border border-gray-100 transition-all duration-500",
                        scrolled ? "h-7 w-7" : "h-9 w-9 md:h-11 md:w-11"
                    )}
                />
                ) : (
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full text-white font-black transition-all duration-500 shadow-sm",
                        scrolled ? "h-7 w-7 text-[8px]" : "h-9 w-9 md:h-11 md:w-11 text-[10px]"
                    )}
                    style={{ backgroundColor: brandColor }}
                >
                    {name.charAt(0).toUpperCase()}
                </div>
                )}
                <h1 className={cn(
                    "font-bold tracking-tighter text-gray-900 font-sora transition-all duration-500 whitespace-nowrap",
                    scrolled ? "text-sm" : "text-base md:text-xl"
                )}>
                {name}
                </h1>
            </Link>
          </div>

          {/* Right: Cart Action */}
          <div className="flex items-center justify-end flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className={cn(
                "relative h-12 w-12 rounded-full transition-all duration-300 group/cart",
                !scrolled && !isSearchOpen ? "bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white" : "hover:bg-black/5"
              )}
            >
              <ShoppingCart className="h-6 w-6 text-gray-900 transition-transform duration-300 group-hover/cart:scale-110" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-lg ring-2 ring-white animate-in zoom-in group-hover/cart:-translate-y-0.5 group-hover/cart:translate-x-0.5 transition-transform"
                  style={{ backgroundColor: brandColor }}
                >
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
}