import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LandingButtonTone = "primary" | "outline" | "ghost"
type LandingButtonSize = "sm" | "md" | "lg" | "icon"

interface LandingButtonProps extends Omit<ButtonProps, "variant" | "size"> {
  tone?: LandingButtonTone
  size?: LandingButtonSize
}

const toneToVariant: Record<LandingButtonTone, NonNullable<ButtonProps["variant"]>> = {
  primary: "default",
  outline: "outline",
  ghost: "ghost",
}

const sizeClasses: Record<LandingButtonSize, string> = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-10 px-5 text-[15px]",
  lg: "h-11 md:h-12 px-8 text-[0.98rem] sm:text-base",
  icon: "h-9 w-9",
}

const toneClasses: Record<LandingButtonTone, string> = {
  primary:
    "bg-[#00311F] text-white shadow-[0_4px_14px_rgba(0,49,31,0.25)] hover:bg-[#00311F]/90 hover:shadow-[0_8px_18px_rgba(0,49,31,0.32)]",
  outline:
    "border-border/80 bg-white text-foreground/80 shadow-none hover:bg-muted/50 hover:text-foreground",
  ghost:
    "border-transparent bg-transparent text-foreground/70 shadow-none hover:bg-black/[0.04] hover:text-foreground",
}

export function LandingButton({
  tone = "primary",
  size = "md",
  className,
  ...props
}: LandingButtonProps) {
  return (
    <Button
      variant={toneToVariant[tone]}
      className={cn(
        "rounded-xl font-semibold tracking-[-0.01em]",
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
      {...props}
    />
  )
}
