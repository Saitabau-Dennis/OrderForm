"use client";

import { cn } from "@/lib/utils";

export function WaveLoader({ className, color = "#00311F" }: { className?: string, color?: string }) {

  return (
    <div className={cn("flex items-center justify-center h-12 w-full", className)}>
      <div className="relative flex items-center justify-center drop-shadow-md" style={{ color }}>
        <svg
          viewBox="0 0 100 60"
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Logo O */}
          <path className="O-path" d="M 25,10 A 20 20 0 1 0 25 50 A 20 20 0 1 0 25 10" />

          {/* Logo F */}
          <path className="F-stem" d="M 45,10 L 45,50" />
          <path className="F-top" d="M 45,10 L 70,10 L 75,5" />
          <path className="F-mid" d="M 45,30 L 65,30" />
        </svg>
      </div>

      <style jsx>{`
        .O-path { stroke-dasharray: 150; stroke-dashoffset: 150; animation: draw-O 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .F-stem { stroke-dasharray: 50; stroke-dashoffset: 50; animation: draw-F-stem 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .F-top  { stroke-dasharray: 40; stroke-dashoffset: 40; animation: draw-F-top 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .F-mid  { stroke-dasharray: 30; stroke-dashoffset: 30; animation: draw-F-mid 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

        @keyframes draw-O {
          0%, 5% { stroke-dashoffset: 150; opacity: 0; }
          6% { opacity: 1; stroke-dashoffset: 150; }
          30%, 75% { stroke-dashoffset: 0; opacity: 1; }
          90%, 100% { stroke-dashoffset: -150; opacity: 0; }
        }

        @keyframes draw-F-stem {
          0%, 25% { stroke-dashoffset: 50; opacity: 0; }
          26% { opacity: 1; stroke-dashoffset: 50; }
          45%, 75% { stroke-dashoffset: 0; opacity: 1; }
          90%, 100% { stroke-dashoffset: -50; opacity: 0; }
        }

        @keyframes draw-F-top {
          0%, 40% { stroke-dashoffset: 40; opacity: 0; }
          41% { opacity: 1; stroke-dashoffset: 40; }
          55%, 75% { stroke-dashoffset: 0; opacity: 1; }
          90%, 100% { stroke-dashoffset: -40; opacity: 0; }
        }

        @keyframes draw-F-mid {
          0%, 50% { stroke-dashoffset: 30; opacity: 0; }
          51% { opacity: 1; stroke-dashoffset: 30; }
          65%, 75% { stroke-dashoffset: 0; opacity: 1; }
          90%, 100% { stroke-dashoffset: -30; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
