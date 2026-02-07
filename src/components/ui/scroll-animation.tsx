"use client"

import { motion, useInView, UseInViewOptions, Variant } from "motion/react"
import { useRef, useMemo } from "react"
import { cn } from "@/lib/utils"

type AnimationVariant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-up"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  viewport?: UseInViewOptions
  as?: React.ElementType
}

const variants: Record<AnimationVariant, { hidden: Variant; visible: Variant }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
}

export function ScrollAnimation({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  viewport = { once: true, margin: "-80px" },
  as: Component = "div",
}: ScrollAnimationProps) {
  const MotionComponent = useMemo(() => motion(Component as any), [Component])

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom ease-out curve
      }}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  )
}
ScrollAnimation.displayName = "ScrollAnimation"
