import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface UnderlinedTextProps {
  children: ReactNode
  className?: string
  underlineHeight?: string
  underlineBottom?: string
  underlineColor?: string
}

export function UnderlinedText({
  children,
  className,
  underlineHeight = "h-[30%]",
  underlineBottom = "bottom-2",
  underlineColor = "bg-[#ffc247]", // Default to a yellow/orange similar to mediafa.st
}: UnderlinedTextProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <span
        className={cn(
          "absolute left-0 w-full -z-0 rounded-sm",
          underlineHeight,
          underlineBottom,
          underlineColor
        )}
      />
    </span>
  )
}
UnderlinedText.displayName = "UnderlinedText"
