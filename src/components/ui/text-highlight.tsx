import { cn } from "@/lib/utils"
import React from "react"

interface TextHighlightProps {
  children: React.ReactNode
  className?: string
  color?: "yellow" | "purple" | "blue" | "green" | "orange" | "pink" | "teal" | "white" | "primary"
}

export function TextHighlight({ children, className, color = "yellow" }: TextHighlightProps) {
  const fillColors = {
    yellow: "bg-[#ffd86a]",
    purple: "bg-[#dcb7ff]",
    blue: "bg-[#b9ecff]",
    green: "bg-[#b7f0c7]",
    orange: "bg-[#ffc17b]",
    pink: "bg-[#ffbfd8]",
    teal: "bg-[#98f0df]",
    white: "bg-[#ffffff]",
    primary: "bg-primary/25",
  }

  const strokeColors = {
    yellow: "bg-[#f8bd2a]",
    purple: "bg-[#c28df8]",
    blue: "bg-[#82d4ff]",
    green: "bg-[#7cd49a]",
    orange: "bg-[#f4a44f]",
    pink: "bg-[#f395be]",
    teal: "bg-[#59d5bf]",
    white: "bg-[#d9d9d9]",
    primary: "bg-primary/35",
  }

  return (
    <span className={cn("relative inline-block px-1.5", className)}>
      <span
        aria-hidden
        className={cn(
          "absolute -z-10 left-0 right-0 bottom-[0.04em] h-[0.52em] rounded-[0.45rem] rotate-[-1.4deg] opacity-80",
          fillColors[color]
        )}
      />
      <span
        aria-hidden
        className={cn(
          "absolute -z-10 left-[3%] right-[3%] bottom-[-0.02em] h-[0.14em] rounded-full opacity-90",
          strokeColors[color]
        )}
      />
      <span className="relative z-10">{children}</span>
    </span>
  )
}
TextHighlight.displayName = "TextHighlight"
