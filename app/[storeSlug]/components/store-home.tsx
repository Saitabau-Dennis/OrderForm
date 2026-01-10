"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "./category-filter";
import { ProductCard } from "./product-card";
import { useCart } from "./cart-context";

interface StoreHomeProps {
  store: any;
  products: any[];
}

export function StoreHome({ store, products }: StoreHomeProps) {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-all"
          />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          brandColor={store.brandColor || "#30382F"}
        />
      </div>

      <div id="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500 max-w-sm">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filter to find what you're looking for."
                : "This store hasn't added any products yet. Please check back later."}
            </p>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-2"
                style={{ color: store.brandColor || "#30382F" }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={{
                  id: product._id || product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  description: product.description,
                }}
                currency={store.currency}
                onAdd={(id) => {
                   // ProductCard passes id, but addToCart needs product object.
                   // We need to find the product.
                   const p = products.find(p => (p._id || p.id) === id);
                   if (p) addToCart(p, 1);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
