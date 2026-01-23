"use client";

import { cn } from "@/lib/utils";
import { useStore } from "./store-context";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { brandColor } = useStore();

  if (categories.length === 0) return null;

  return (
    <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "flex-shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300",
              !selectedCategory
                ? "text-white shadow-md transform scale-105"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
            style={!selectedCategory ? { backgroundColor: brandColor } : {}}
          >
            All Items
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                "flex-shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300",
                selectedCategory === category
                  ? "text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
              style={
                selectedCategory === category
                  ? { backgroundColor: brandColor }
                  : {}
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
