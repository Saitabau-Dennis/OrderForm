"use client";

import { cn } from "@/lib/utils";

export function WaveLoader({
  className,
  color = "#00311F",
}: {
  className?: string;
  color?: string;
}) {
  const dots = [0, 1, 2,3];

  return (
    <div className={cn("flex w-full items-center justify-center p-4", className)}>
      <div className="wl-root" role="status" aria-label="Loading">
        {dots.map((i) => (
          <span
            key={i}
            className="wl-dot"
            style={{ animationDelay: `${i * 0.13}s` }}
          />
        ))}
      </div>

      <style jsx>{`
        .wl-root {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wl-dot {
          display: block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${color};
          animation: wl-bounce 1s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        @keyframes wl-bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          45% {
            transform: translateY(-22px) scale(0.9);
            opacity: 1;
          }
          60% {
            transform: translateY(-22px) scale(0.9);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wl-dot {
            animation: none;
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
