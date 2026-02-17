"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Mockup, MockupFrame } from "@/components/ui/mockup"
import { Button } from "@/components/ui/button"

interface HeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  subtitle?: React.ReactNode
  eyebrow?: string
  badge?: React.ReactNode
  ctaText?: string
  ctaLink?: string
  ctaTarget?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  secondaryCtaTarget?: string
  mockupImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      className,
      title,
      subtitle,
      eyebrow,
      badge,
      ctaText,
      ctaLink,
      ctaTarget,
      secondaryCtaText,
      secondaryCtaLink,
      secondaryCtaTarget,
      mockupImage,
      ...props
    },
    ref
  ) => {
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
            className="font-heading uppercase tracking-[0.18em] leading-[133%] text-center text-xs md:text-sm mb-6 md:mb-8 text-primary font-semibold animate-appear opacity-0 delay-100"
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.04] text-center px-4 md:px-6 max-w-5xl text-foreground font-heading font-semibold animate-appear opacity-0 delay-100 tracking-[-0.03em]"
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-base md:text-xl text-center font-sans px-6 max-w-3xl mt-6 mb-12 leading-relaxed text-muted-foreground animate-appear opacity-0 delay-300"
          >
            {subtitle}
          </p>
        )}

        {(ctaText && ctaLink) || (secondaryCtaText && secondaryCtaLink) ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-appear opacity-0 delay-500 w-full sm:w-auto px-4">
            {ctaText && ctaLink && (
              <Link href={ctaLink} target={ctaTarget} rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined} className="w-full sm:w-auto">
                 <Button size="lg" className="w-full sm:w-auto rounded-full px-8 text-base font-semibold">
                    <span className="relative z-10">{ctaText}</span>
                 </Button>
              </Link>
            )}

            {secondaryCtaText && secondaryCtaLink && (
              <Link href={secondaryCtaLink} target={secondaryCtaTarget} rel={secondaryCtaTarget === "_blank" ? "noopener noreferrer" : undefined} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 text-base font-semibold group">
                  <span>{secondaryCtaText}</span>
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </div>
        ) : null}

        {mockupImage && (
          <div className="mt-16 w-full max-w-6xl mx-auto relative animate-appear opacity-0 delay-700 px-4 md:px-0">
            <MockupFrame className="p-0 rounded-[2rem] md:rounded-[3rem] border-none ring-[12px] md:ring-[24px] ring-primary/15 shadow-2xl shadow-primary/10 bg-transparent">
              <Mockup type="responsive" className="rounded-[2rem] md:rounded-[3rem] border border-stone-200/50 shadow-sm">
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
