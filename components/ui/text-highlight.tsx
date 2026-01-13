import { cn } from "@/lib/utils"
import React from "react"

interface TextHighlightProps {
  children: React.ReactNode
  className?: string
  color?: "yellow" | "purple" | "blue" | "green" | "orange" | "pink" | "teal" | "white"
}

export function TextHighlight({ children, className, color = "yellow" }: TextHighlightProps) {
  const colors = {
    yellow: "bg-[#FFD02F]",
    purple: "bg-[#E0B6FF]",
    blue: "bg-[#C4F5FC]",
    green: "bg-[#C6F6D5]",
    orange: "bg-[#FFC480]",
    pink: "bg-[#FFC4D6]",
    teal: "bg-[#99F6E4]",
    white: "bg-white",
  }

  return (
    <span className={cn("relative inline-block px-2 py-1 mx-1 rounded-none transform -rotate-2 shadow-sm", colors[color], className)}>
      <span className="relative z-10 text-black font-medium">{children}</span>
    </span>
  )
}
