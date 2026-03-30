"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import { storefrontPath } from "@/lib/storefront-path"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type CatalogFiltersProps = {
  storeSlug: string
  productCount: number
  selectedCategory: string
  selectedQuery: string
  selectedAvailability: string
  selectedPrice: string
  selectedSort: string
}

type FilterOption = {
  value: string
  label: string
}

const AVAILABILITY_OPTIONS: FilterOption[] = [
  { value: "available", label: "Available" },
  { value: "all", label: "All" },
  { value: "unavailable", label: "Unavailable" },
]

const PRICE_OPTIONS: FilterOption[] = [
  { value: "all", label: "Any price" },
  { value: "under-1000", label: "Under KES 1,000" },
  { value: "1000-5000", label: "KES 1,000 - 5,000" },
  { value: "above-5000", label: "Above KES 5,000" },
]

const SORT_OPTIONS: FilterOption[] = [
  { value: "alpha-asc", label: "Alphabetically, A-Z" },
  { value: "alpha-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "newest", label: "Newest first" },
]

function findLabel(options: FilterOption[], selectedValue: string) {
  return options.find((option) => option.value === selectedValue)?.label ?? options[0]?.label ?? ""
}

export function CatalogFilters({
  storeSlug,
  productCount,
  selectedCategory,
  selectedQuery,
  selectedAvailability,
  selectedPrice,
  selectedSort,
}: CatalogFiltersProps) {
  const router = useRouter()
  const [isApplyingFilters, startApplyFiltersTransition] = useTransition()
  const catalogHref = storefrontPath(storeSlug, "/catalog")

  const buildCatalogHref = ({
    category,
    query,
    availability,
    price,
    sort,
  }: {
    category: string
    query: string
    availability: string
    price: string
    sort: string
  }) => {
    const params = new URLSearchParams()
    const trimmedCategory = category.trim()
    const trimmedQuery = query.trim()

    if (trimmedCategory) params.set("category", trimmedCategory)
    if (trimmedQuery) params.set("query", trimmedQuery)
    if (availability && availability !== "available") params.set("availability", availability)
    if (price && price !== "all") params.set("price", price)
    if (sort && sort !== "alpha-asc") params.set("sort", sort)

    const paramString = params.toString()
    return `${catalogHref}${paramString ? `?${paramString}` : ""}`
  }

  const availabilityLabel = findLabel(AVAILABILITY_OPTIONS, selectedAvailability)
  const priceLabel = findLabel(PRICE_OPTIONS, selectedPrice)
  const sortLabel = findLabel(SORT_OPTIONS, selectedSort)
  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedQuery) ||
    selectedAvailability !== "available" ||
    selectedPrice !== "all" ||
    selectedSort !== "alpha-asc"

  const applyFilters = ({
    category,
    query,
    availability,
    price,
    sort,
  }: {
    category: string
    query: string
    availability: string
    price: string
    sort: string
  }) => {
    startApplyFiltersTransition(() => {
      router.replace(
        buildCatalogHref({
          category,
          query,
          availability,
          price,
          sort,
        }),
        { scroll: false }
      )
    })
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-[#E5E5E0] py-3 font-sans text-[#1A1A1A]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          Filter:
          {isApplyingFilters ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6D6D67]" /> : null}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 font-sans text-sm text-[#1F1F1C] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2">
            {availabilityLabel}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 [font-family:var(--font-geist-mono)]">
            {AVAILABILITY_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() =>
                  applyFilters({
                    category: selectedCategory,
                    query: selectedQuery,
                    availability: option.value,
                    price: selectedPrice,
                    sort: selectedSort,
                  })
                }
                disabled={isApplyingFilters}
                className={cn(
                  "[font-family:var(--font-geist-mono)]",
                  selectedAvailability === option.value && "font-semibold text-[#111111]"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 font-sans text-sm text-[#1F1F1C] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2">
            {priceLabel}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 [font-family:var(--font-geist-mono)]">
            {PRICE_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() =>
                  applyFilters({
                    category: selectedCategory,
                    query: selectedQuery,
                    availability: selectedAvailability,
                    price: option.value,
                    sort: selectedSort,
                  })
                }
                disabled={isApplyingFilters}
                className={cn(
                  "[font-family:var(--font-geist-mono)]",
                  selectedPrice === option.value && "font-semibold text-[#111111]"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => {
              applyFilters({
                category: "",
                query: "",
                availability: "available",
                price: "all",
                sort: "alpha-asc",
              })
            }}
            disabled={isApplyingFilters}
            className="text-sm font-medium text-[#6D6D67] underline decoration-[#BDBDB6] underline-offset-4 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
          >
            {isApplyingFilters ? "Applying..." : "Clear filters"}
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 font-sans text-sm text-[#1F1F1C] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2">
              {sortLabel}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 [font-family:var(--font-geist-mono)]">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() =>
                    applyFilters({
                      category: selectedCategory,
                      query: selectedQuery,
                      availability: selectedAvailability,
                      price: selectedPrice,
                      sort: option.value,
                    })
                  }
                  disabled={isApplyingFilters}
                  className={cn(
                    "[font-family:var(--font-geist-mono)]",
                    selectedSort === option.value && "font-semibold text-[#111111]"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-[#6D6D67]">
          {productCount} product{productCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  )
}
