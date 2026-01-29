import { cn } from "@/lib/utils"
import React from "react"

interface TextHighlightProps {
  children: React.ReactNode
  className?: string
  color?: "yellow" | "purple" | "blue" | "green" | "orange" | "pink" | "teal" | "white" | "primary"
}

export function TextHighlight({ children, className, color = "yellow" }: TextHighlightProps) {
  const colors = {
    yellow: "bg-[#FFD02F] text-black",
    purple: "bg-[#E0B6FF] text-black",
    blue: "bg-[#C4F5FC] text-black",
    green: "bg-[#C6F6D5] text-black",
    orange: "bg-[#FFC480] text-black",
    pink: "bg-[#FFC4D6] text-black",
    teal: "bg-[#99F6E4] text-black",
    white: "bg-white text-black",
    primary: "bg-primary text-primary-foreground",
  }

  return (
    <span className={cn("relative inline-block px-2 py-1 mx-1 rounded-none transform -rotate-2 shadow-sm", colors[color], className)}>
      <span className="relative z-10 font-medium">{children}</span>
    </span>
  )
}
TextHighlight.displayName = "TextHighlight"
