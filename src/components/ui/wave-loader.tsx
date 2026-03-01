"use client";

import { cn } from "@/lib/utils";

export function WaveLoader({ className, color = "#00311F" }: { className?: string, color?: string }) {
  const bars = [0, 1, 2, 3, 4];
  return (
    <div className={cn("flex w-full items-center justify-center p-2", className)}>
      <div
        className="relative flex h-8 items-end gap-1.5"
        role="status"
        aria-label="Loading"
      >
        {bars.map((bar) => (
          <span
            key={bar}
            className="wave-bar block h-3 w-1.5 rounded-full"
            style={{
              backgroundColor: color,
              animationDelay: `${bar * 0.12}s`,
            }}
          />
        ))}
        <span
          className="pointer-events-none absolute -bottom-2 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full opacity-25 blur-sm"
          style={{ backgroundColor: color }}
        />
      </div>

      <style jsx>{`
        .wave-bar {
          transform-origin: center bottom;
          animation: wave-rise 0.85s ease-in-out infinite;
          opacity: 0.35;
        }

        @keyframes wave-rise {
          0%,
          100% {
            transform: scaleY(0.45);
            opacity: 0.35;
          }
          50% {
            transform: scaleY(1.55);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wave-bar {
            animation: none;
            opacity: 0.7;
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
