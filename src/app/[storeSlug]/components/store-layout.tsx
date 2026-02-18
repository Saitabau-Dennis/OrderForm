"use client";

import { useState } from "react";
import { Package, Sparkles, ArrowUpRight } from "lucide-react";
import { StoreHeader } from "./store-header";
import { StoreHero } from "./store-hero";
import { CategoryFilter } from "./category-filter";
import { ProductCard } from "./product-card";
import { useStore } from "./store-context";
import Link from "next/link";
import { useParams } from "next/navigation";

interface StoreLayoutProps {
  store: {
    name: string;
    logoUrl?: string | null;
    description?: string | null;
    rewardConfig?: { isEnabled?: boolean | null } | null;
    [key: string]: unknown;
  };
  products: Array<{
    id: string;
    name: string;
    category?: string | null;
    description?: string | null;
    [key: string]: unknown;
  }>;
}

export function StoreContent({ store, products }: StoreLayoutProps) {
  const { searchQuery, brandColor } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const params = useParams();
  const normalizedQuery = searchQuery.toLowerCase();

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const filteredProducts = products.filter((product) => {
    const plainDescription = (product.description || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
    const descMatch = plainDescription.includes(normalizedQuery);
    const matchesSearch = nameMatch || descMatch;
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen font-jakarta bg-[#F8F6F3]">
      <StoreHeader name={store.name} logoUrl={store.logoUrl || undefined} />

      <main>
        <StoreHero name={store.name} description={store.description} />

        {/* ===== Products Card — curved top, overlaps the hero ===== */}
        <section
          id="products-section"
          className="relative bg-white rounded-t-[2.5rem] -mt-8 z-10 shadow-[0_-4px_30px_rgba(0,0,0,0.04)]"
        >
          <div className="container mx-auto px-5 md:px-8 pt-12 pb-6">
            {/* Share banner */}
            <Link href={`/${params.storeSlug}/share`}>
              <div
                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl transition-all duration-500 hover:shadow-md border border-stone-100 overflow-hidden mb-10"
                style={{ backgroundColor: "#F8F6F3" }}
              >
                <div className="flex items-start sm:items-center gap-4 relative z-10">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: brandColor + "12" }}
                  >
                    <Sparkles className="h-4.5 w-4.5" style={{ color: brandColor }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Share your purchase, get featured</h3>
                    <p className="text-[13px] text-stone-500 mt-0.5">
                      Upload a photo and join our gallery
                      {store.rewardConfig?.isEnabled && " — plus earn rewards"}
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 h-9 px-5 rounded-full text-[11px] font-semibold text-white transition-all group-hover:gap-3 flex-shrink-0"
                  style={{ backgroundColor: brandColor }}
                >
                  Share Now
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>

            {/* Catalog header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-[-0.02em] font-jakarta">
                  {selectedCategory || "All Products"}
                </h2>
                <span className="text-sm text-stone-400 font-medium">
                  ({filteredProducts.length})
                </span>
              </div>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Product Grid */}
            <div className="pb-16">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-stone-50 flex items-center justify-center mb-4">
                    <Package className="h-7 w-7 text-stone-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold text-stone-800">No products found</h3>
                  <p className="text-sm text-stone-400 mt-1 max-w-xs">
                    Try a different category or search term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== Footer Card — curved top, overlaps the products section ===== */}
        <footer
          className="relative bg-stone-900 rounded-t-[2.5rem] -mt-6 z-20 py-16 font-jakarta"
        >
          <div className="container mx-auto px-5 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: brandColor }}
                >
                  {store.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-white text-sm">{store.name}</span>
              </div>
              <p className="text-xs text-stone-500">
                Powered by <span className="font-semibold text-stone-400">OrderForm</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export function StoreLayout({ store, products }: StoreLayoutProps) {
  return <StoreContent store={store} products={products} />;
}
