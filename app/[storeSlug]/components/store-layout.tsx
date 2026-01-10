"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoreThemeProvider } from "./store-provider";
import { StoreHeader } from "./store-header";
import { StoreHero } from "./store-hero";
import { CategoryFilter } from "./category-filter";
import { ProductCard } from "./product-card";
import { StoreCart } from "./store-cart";

interface StoreLayoutProps {
  store: any;
  products: any[];
}

export function StoreLayout({ store, products }: StoreLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const newQty = (newCart[productId] || 0) + delta;

      if (newQty <= 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = newQty;
      }

      return newCart;
    });
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = products.find((p) => p._id === id || p.id === id);
    return {
      id,
      name: product?.name || "Unknown Product",
      price: product?.price || 0,
      quantity: qty,
      imageUrl: product?.imageUrl,
    };
  });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleCheckout = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const message = `Hi, I'd like to order from ${store.name}:\n\n${cartItems.map(item =>
      `- ${item.name} x${item.quantity} (${store.currency} ${(item.price * item.quantity).toLocaleString()})`
    ).join('\n')}\n\nTotal: ${store.currency} ${total.toLocaleString()}`;

    const url = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <StoreThemeProvider brandColor={store.brandColor || "#30382F"}>
      <StoreHeader
        name={store.name}
        logoUrl={store.logoUrl}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="container mx-auto px-4 py-8 pb-24">
        <StoreHero
          name={store.name}
          description={store.description}
          brandColor={store.brandColor || "#30382F"}
        />

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
                onAdd={addToCart}
              />
            ))}
          </div>
        )}
        </div>
      </main>

      <StoreCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={store.currency}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
    </StoreThemeProvider>
  );
}
