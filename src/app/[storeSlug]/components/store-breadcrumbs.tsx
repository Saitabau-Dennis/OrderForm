import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type StoreBreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function StoreBreadcrumbs({ items, className }: StoreBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-5 flex flex-wrap items-center gap-1.5 text-xs text-[#6D6D67] md:mb-7 ${className || ""}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-semibold text-[#1A1A1A]" : ""}>{item.label}</span>
            )}
            {!isLast ? <ChevronRight className="h-3.5 w-3.5 text-[#9A9A94]" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
