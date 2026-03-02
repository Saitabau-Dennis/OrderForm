"use client";

import { cn } from "@/lib/utils";

export function StorefrontLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-5", className)}>
      {/* Spinner */}
      <div className="sl-wrap" aria-hidden="true">
        <span className="sl-arc sl-arc-outer" />
        <span className="sl-arc sl-arc-inner" />
        <span className="sl-dot" />
      </div>

      {/* Label */}
      <span className="[font-family:var(--font-instrument-serif)] text-xl tracking-wide font-normal sl-label">
        <span className="sl-ellipsis">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </span>

      <style>{`
        .sl-wrap {
          position: relative;
          width: 44px;
          height: 44px;
        }

        .sl-arc {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
        }

        /* Outer arc — clockwise */
        .sl-arc-outer {
          inset: 0;
          border-top-color: var(--primary, #00311F);
          border-right-color: color-mix(in srgb, var(--primary, #00311F) 20%, transparent);
          animation: sl-cw 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Inner arc — counter-clockwise, offset timing */
        .sl-arc-inner {
          inset: 9px;
          border-bottom-color: var(--primary, #00311F);
          border-left-color: color-mix(in srgb, var(--primary, #00311F) 20%, transparent);
          animation: sl-ccw 0.85s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Pulsing center dot */
        .sl-dot {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary, #00311F);
          animation: sl-pulse 1.1s ease-in-out infinite;
        }

        @keyframes sl-cw  { to { transform: rotate(360deg);  } }
        @keyframes sl-ccw { to { transform: rotate(-360deg); } }

        @keyframes sl-pulse {
          0%, 100% { transform: scale(0.5); opacity: 0.35; }
          50%       { transform: scale(1);   opacity: 1; }
        }

        /* Animated ellipsis dots */
        .sl-label {
          color: color-mix(in srgb, var(--primary, #00311F) 70%, transparent);
        }

        .sl-ellipsis span {
          opacity: 0;
          animation: sl-fade-dot 1.4s ease-in-out infinite;
        }
        .sl-ellipsis span:nth-child(1) { animation-delay: 0s; }
        .sl-ellipsis span:nth-child(2) { animation-delay: 0.2s; }
        .sl-ellipsis span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes sl-fade-dot {
          0%, 60%, 100% { opacity: 0; }
          30%            { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sl-arc-outer, .sl-arc-inner, .sl-dot { animation: none; }
          .sl-arc-outer { border-color: color-mix(in srgb, var(--primary, #00311F) 30%, transparent); border-top-color: var(--primary, #00311F); }
          .sl-arc-inner { border-color: color-mix(in srgb, var(--primary, #00311F) 30%, transparent); border-bottom-color: var(--primary, #00311F); }
          .sl-dot { opacity: 0.8; }
          .sl-ellipsis span { opacity: 1; animation: none; }
        }
      `}</style>
    </div>
  );
}
