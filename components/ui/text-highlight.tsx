import { cn } from "@/lib/utils"
import React from "react"

interface TextHighlightProps {
  children: React.ReactNode
  className?: string
  color?: "yellow" | "purple" | "blue" | "green" | "orange" | "pink"
}

export function TextHighlight({ children, className, color = "yellow" }: TextHighlightProps) {
  const colors = {
    yellow: "bg-[#FFD02F]",
    purple: "bg-[#E0B6FF]",
    blue: "bg-[#C4F5FC]",
    green: "bg-[#C6F6D5]",
    orange: "bg-[#FFC480]",
    pink: "bg-[#FFC4D6]",
  }

  return (
    <span className={cn("relative inline-block px-2 py-1 mx-1 rounded-[4px] transform -rotate-1", colors[color], className)}>
      <span className="relative z-10 text-black font-medium">{children}</span>
    </span>
  )
}
