"use client"

import { motion, UseInViewOptions, Variant } from "motion/react"
import { cn } from "@/lib/utils"

type AnimationVariant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-up"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  viewport?: UseInViewOptions
  as?: "div" | "section" | "article" | "aside" | "span"
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
  const easing: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

  const animationProps = {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport,
    variants: variants[variant],
    transition: {
      duration,
      delay,
      ease: easing,
    },
    className: cn(className),
    children,
  }

  if (Component === "section") return <motion.section {...animationProps} />
  if (Component === "article") return <motion.article {...animationProps} />
  if (Component === "aside") return <motion.aside {...animationProps} />
  if (Component === "span") return <motion.span {...animationProps} />

  return (
    <motion.div {...animationProps} />
  )
}
ScrollAnimation.displayName = "ScrollAnimation"
