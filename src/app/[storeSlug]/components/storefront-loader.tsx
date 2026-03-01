"use client";

import { cn } from "@/lib/utils";

export function StorefrontLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-[bounce_1.4s_infinite_0ms] shadow-sm" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-[bounce_1.4s_infinite_200ms] shadow-sm" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-[bounce_1.4s_infinite_400ms] shadow-sm" />
      </div>
      <span className="[font-family:var(--font-instrument-serif)] text-2xl text-primary/80 tracking-tight font-normal animate-pulse">
          Loading store...
      </span>
    </div>
  );
}
