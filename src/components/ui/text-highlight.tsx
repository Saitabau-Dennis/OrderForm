import { cn } from "@/lib/utils"
import React from "react"

interface TextHighlightProps {
  children: React.ReactNode
  className?: string
  color?: "yellow" | "purple" | "blue" | "green" | "orange" | "pink" | "teal" | "white" | "primary"
}

export function TextHighlight({ children, className, color = "yellow" }: TextHighlightProps) {
  const colors = {
    yellow: "text-[#FFD02F]",
    purple: "text-[#E0B6FF]",
    blue: "text-[#C4F5FC]",
    green: "text-[#C6F6D5]",
    orange: "text-[#FFC480]",
    pink: "text-[#FFC4D6]",
    teal: "text-[#99F6E4]",
    white: "text-card",
    primary: "text-primary",
  }

  return (
    <span className={cn("relative inline-block px-2", className)}>
      <svg
        className={cn("absolute left-0 top-0 h-full w-full -z-10", colors[color])}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z"
          fill="currentColor"
          className="scale-y-[0.85] origin-bottom "
        />
        <path
          d="M 5 45 Q 25 35 50 45 T 95 45
             Q 98 45 98 50 T 95 85
             Q 50 90 25 85 T 5 80
             Q 2 80 2 75 T 5 45 Z"
          fill="currentColor"
          className="opacity-90 origin-center scale-[1.05]"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </span>
  )
}
TextHighlight.displayName = "TextHighlight"
