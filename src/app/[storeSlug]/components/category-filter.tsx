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
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide font-dm-sans">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "flex-shrink-0 h-9 px-4 rounded-full text-[13px] font-medium transition-all duration-300 border",
          !selectedCategory
            ? "text-white border-transparent shadow-sm"
            : "border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300 bg-transparent"
        )}
        style={!selectedCategory ? { backgroundColor: brandColor } : {}}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "flex-shrink-0 h-9 px-4 rounded-full text-[13px] font-medium transition-all duration-300 border",
            selectedCategory === category
              ? "text-white border-transparent shadow-sm"
              : "border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300 bg-transparent"
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
  );
}
