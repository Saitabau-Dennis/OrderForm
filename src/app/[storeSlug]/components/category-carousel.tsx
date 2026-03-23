"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  autoScrollDelayMs?: number;
};

export function CategoryCarousel({
  storeSlug,
  categories,
  autoScrollDelayMs = 2000,
}: CategoryCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasMultipleCategories = categories.length > 1;
  const sectionLabel = useMemo(() => `${storeSlug} shop categories`, [storeSlug]);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const card = scroller.children[index] as HTMLElement | undefined;
    if (!card) return;

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
    if (!hasMultipleCategories || isPaused) return;

    const intervalId = window.setInterval(() => {
      goNext();
    }, autoScrollDelayMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoScrollDelayMs, goNext, hasMultipleCategories, isPaused]);

  useEffect(() => {
    currentIndexRef.current = 0;
    scrollToIndex(0);
  }, [categories.length, scrollToIndex]);

  if (categories.length === 0) return null;

  return (
    <section aria-label={sectionLabel} className="mb-10 md:mb-14">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-[#1A1A1A] md:text-2xl">
          Shop by Categories
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevious}
            disabled={!hasMultipleCategories}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D8D8D2] bg-card text-[#44443F] transition hover:bg-[#F1F1ED] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!hasMultipleCategories}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D8D8D2] bg-card text-[#44443F] transition hover:bg-[#F1F1ED] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative block h-[320px] min-w-[70%] snap-start overflow-hidden rounded-none bg-[#E9E7DF] sm:min-w-[52%] lg:h-[520px] lg:min-w-[30%]"
          >
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-contain transition duration-500 group-hover:scale-[1.01]"
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 52vw, 30vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#EFEDE4] to-[#DBD7CC]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 inline-flex items-center rounded-md bg-card/95 px-4 py-2 text-sm font-medium text-[#1A1A1A]">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
