import { cn } from "@/lib/utils"
import React from "react"

interface HandwrittenUnderlineProps {
  children: React.ReactNode
  className?: string
  underlineClassName?: string
}

export function HandwrittenUnderline({
  children,
  className,
  underlineClassName,
}: HandwrittenUnderlineProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 right-0 -bottom-2 h-4 bg-[url('/images/handwritten-underline.svg')] bg-no-repeat bg-size-[100%_100%]",
          underlineClassName
        )}
      />
    </span>
  )
}
HandwrittenUnderline.displayName = "HandwrittenUnderline"
