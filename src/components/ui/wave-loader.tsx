"use client";

import { cn } from "@/lib/utils";

export function WaveLoader({ className, color = "#00311F" }: { className?: string, color?: string }) {
  return (
    <div className={cn("flex items-center gap-1 h-12", className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full animate-wave bg-gradient-to-b from-current to-current/60"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.15}s`,
            animationDuration: "1s",
            boxShadow: `0 0 10px ${color}40`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            height: 20%;
            opacity: 0.3;
            transform: scaleY(1);
          }
          50% {
            height: 70%;
            opacity: 1;
            transform: scaleY(1.2);
          }
        }
        .animate-wave {
          animation: wave 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
