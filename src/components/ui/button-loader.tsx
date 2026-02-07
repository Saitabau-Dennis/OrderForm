"use client";

import { cn } from "@/lib/utils";

interface ButtonLoaderProps {
  className?: string;
  dotClassName?: string;
}

export function ButtonLoader({ className, dotClassName }: ButtonLoaderProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-current animate-bounce",
            dotClassName
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
}
