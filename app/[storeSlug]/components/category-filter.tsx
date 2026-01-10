"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  brandColor: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  brandColor,
}: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-2 p-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectCategory(null)}
            className={cn(
              "rounded-full border-transparent px-4 font-medium transition-all",
              !selectedCategory
                ? "text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
            style={
              !selectedCategory
                ? { backgroundColor: brandColor }
                : {}
            }
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onSelectCategory(category)}
              className={cn(
                "rounded-full border-transparent px-4 font-medium transition-all",
                selectedCategory === category
                  ? "text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              style={
                selectedCategory === category
                  ? { backgroundColor: brandColor }
                  : {}
              }
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
