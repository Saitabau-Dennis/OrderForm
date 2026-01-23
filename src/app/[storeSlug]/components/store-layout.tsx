"use client";

import { useState } from "react";
import { Package, Search, ShieldCheck, Truck, Clock, Heart, X, MessageCircle, Camera, Sparkles } from "lucide-react";
import { StoreHeader } from "./store-header";
import { StoreHero } from "./store-hero";
import { CategoryFilter } from "./category-filter";
import { ProductCard } from "./product-card";
import { StoreCart } from "./store-cart";
import { StoreProvider, useStore } from "./store-context";
import Link from "next/link";
import { useParams } from "next/navigation";

interface StoreLayoutProps {
  store: any;
  products: any[];
}

function StoreContent({ store, products }: StoreLayoutProps) {
  const { searchQuery, setSearchQuery, brandColor } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const params = useParams();

  // Extract unique categories
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  // Filter products
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || descMatch;
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader name={store.name} logoUrl={store.logoUrl} />
      
      <main>
        <StoreHero name={store.name} description={store.description} />

        {/* Stunning Share & Earn Banner */}
        <div className="container mx-auto px-4 md:px-6 mb-16">
            <Link href={`/${params.storeSlug}/share`}>
                <div 
                    className="group relative overflow-hidden rounded-[2rem] p-8 md:p-12 duration-500 border border-gray-100 shadow-sm"
                    style={{ backgroundColor: `${brandColor}08` }}
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div className="space-y-3 max-w-lg">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: brandColor }}>
                                Share & Earn
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sora tracking-tight leading-tight">
                                Show off your <span className="italic" style={{ color: brandColor }}>style.</span>
                            </h2>
                            <p className="text-gray-500 font-light text-base">
                                Upload a photo of your purchase and get featured in our gallery. {store.rewardConfig?.isEnabled && "Plus, get an exclusive discount for your next order."}
                            </p>
                        </div>
                        <div 
                            className="h-14 px-10 rounded-full text-sm font-bold uppercase tracking-widest text-white shadow-xl transition-all flex items-center justify-center gap-2"
                            style={{ backgroundColor: brandColor }}
                        >
                            Upload Photo
                            <Sparkles className="h-4 w-4" />
                        </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full opacity-[0.03] blur-3xl" style={{ backgroundColor: brandColor }} />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full opacity-[0.03] blur-3xl" style={{ backgroundColor: brandColor }} />
                </div>
            </Link>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
              <div className="space-y-1">
                  <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Our Catalog</h2>
                  <h3 className="text-4xl font-bold text-gray-900 font-sora">The Collection</h3>
              </div>

              <div className="relative group w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                  <input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-10 pr-10 bg-gray-50 border border-gray-100 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all shadow-sm focus:shadow-md"
                  />
                  {searchQuery && (
                      <button 
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors p-1"
                      >
                          <X className="h-4 w-4" />
                      </button>
                  )}
              </div>
          </div>

          <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
          />

          <div className="min-h-[40vh] pb-24 pt-4">
              {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                          <Package className="h-8 w-8 text-gray-200" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">No items found</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-xs font-light leading-relaxed">
                          Try adjusting your filters or search terms.
                      </p>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      {filteredProducts.map((product) => (
                          <ProductCard
                              key={product.id}
                              product={product}
                          />
                      ))}
                  </div>
              )}
          </div>
        </div>
      </main>

      <StoreCart storeName={store.name} whatsappNumber={store.whatsappNumber} />
      
      <footer className="py-12 border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-base font-bold text-gray-900 font-sora mb-2">{store.name}</h2>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                  Powered by OrderForm
              </p>
          </div>
      </footer>
    </div>
  );
}

export function StoreLayout({ store, products }: StoreLayoutProps) {
  return (
    <StoreProvider 
        currency={store.currency} 
        brandColor={store.brandColor || "#000000"}
    >
      <StoreContent store={store} products={products} />
    </StoreProvider>
  );
}