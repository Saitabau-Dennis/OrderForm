"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CategoryItem = {
  name: string;
  imageUrl: string | null;
  href: string;
};

type CategoryCarouselProps = {
  storeSlug: string;
  categories: CategoryItem[];
};

export function CategoryCarousel({
  storeSlug,
  categories,
}: CategoryCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);

  const hasMultipleCategories = categories.length > 1;
  const sectionDescription = useMemo(
    () =>
      categories.length > 1
        ? `${categories.length} categories available`
        : "Browse the store by category",
    [categories.length],
  );
  const sectionLabel = useMemo(() => `${storeSlug} shop categories`, [storeSlug]);
  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const card = scroller.children[index] as HTMLElement | undefined;
    if (!card) return;

    currentIndexRef.current = index;
    scroller.scrollTo({
      left: Math.max(0, card.offsetLeft - 12),
      behavior: "smooth",
    });
  }, []);

  const goNext = useCallback(() => {
    if (!hasMultipleCategories) return;
    const next = (currentIndexRef.current + 1) % categories.length;
    currentIndexRef.current = next;
    scrollToIndex(next);
  }, [categories.length, hasMultipleCategories, scrollToIndex]);

  const goPrevious = useCallback(() => {
    if (!hasMultipleCategories) return;
    const next = (currentIndexRef.current - 1 + categories.length) % categories.length;
    currentIndexRef.current = next;
    scrollToIndex(next);
  }, [categories.length, hasMultipleCategories, scrollToIndex]);

  useEffect(() => {
    currentIndexRef.current = 0;
    scrollToIndex(0);
  }, [categories.length, scrollToIndex]);

  if (categories.length === 0) return null;

  return (
    <section
      aria-label={sectionLabel}
      className="mb-10 md:mb-14"
    >
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1A1A1A] md:text-[2rem]">
            Shop by Categories
          </h2>
          <p className="mt-1 text-sm text-[#6E6A64]">{sectionDescription}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevious}
            disabled={!hasMultipleCategories}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD8D1] bg-white text-[#3D3A35] hover:bg-[#F3F1EC] disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!hasMultipleCategories}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD8D1] bg-white text-[#3D3A35] hover:bg-[#F3F1EC] disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible"
      >
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group min-w-[84%] snap-start sm:min-w-[58%] lg:min-w-0"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-none border border-[#E6E6E1] bg-[#EEECEA] sm:aspect-[4/5]">
              {category.imageUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 84vw, (max-width: 1024px) 58vw, 31vw"
                  />
                </div>
              ) : (
                <div className="h-full w-full bg-[#EEECEA]" />
              )}
            </div>

            <h3 className="mt-3 text-xl font-medium tracking-tight text-[#1A1A1A] md:text-2xl">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>

    </section>
  );
}
