"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Mockup, MockupFrame } from "@/components/ui/mockup"

interface HeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  subtitle?: string
  eyebrow?: string
  badge?: React.ReactNode
  ctaText?: string
  ctaLink?: string
  mockupImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  ({ className, title, subtitle, eyebrow, badge, ctaText, ctaLink, mockupImage, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center", className)}
        {...props}
      >
        {badge && (
          <div className="mb-8 animate-appear opacity-0">
            {badge}
          </div>
        )}

        {eyebrow && (
          <p
            className="font-heading uppercase tracking-[0.2em] leading-[133%] text-center text-sm mb-8 text-muted-foreground animate-appear opacity-0 delay-100"
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-5xl md:text-7xl leading-[1.1] text-center px-4 max-w-4xl text-foreground font-heading font-bold animate-appear opacity-0 delay-100 tracking-tight"
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-xl md:text-2xl text-center font-sans font-normal px-4 max-w-2xl mt-6 mb-12 leading-[1.5] text-muted-foreground animate-appear opacity-0 delay-300"
          >
            {subtitle}
          </p>
        )}

        {ctaText && ctaLink && (
          <Link href={ctaLink}>
            <div
              className="inline-flex items-center bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors font-medium h-12 px-8 animate-appear opacity-0 delay-500"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-lg whitespace-nowrap">{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        )}

        {mockupImage && (
          <div className="mt-16 w-full max-w-6xl mx-auto relative animate-appear opacity-0 delay-700 px-4">
            <MockupFrame className="shadow-2xl rounded-3xl border border-black/5 bg-white/50 backdrop-blur-sm">
              <Mockup type="responsive" className="rounded-2xl">
                <Image
                  src={mockupImage.src}
                  alt={mockupImage.alt}
                  width={mockupImage.width}
                  height={mockupImage.height}
                  className="w-full"
                  priority
                />
              </Mockup>
            </MockupFrame>
          </div>
        )}
      </div>
    )
  }
)
Hero.displayName = "Hero"

export { Hero }
