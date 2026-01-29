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
            className="font-heading uppercase tracking-[0.2em] leading-[133%] text-center text-[9px] md:text-xs mb-6 md:mb-8 text-primary font-medium animate-appear opacity-0 delay-100"
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-3xl md:text-6xl leading-[1.1] text-center px-4 md:px-6 max-w-5xl text-foreground font-heading font-normal animate-appear opacity-0 delay-100 tracking-tighter"
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-base md:text-xl text-center font-sans font-normal px-6 max-w-3xl mt-6 mb-12 leading-[1.4] text-muted-foreground animate-appear opacity-0 delay-300"
          >
            {subtitle}
          </p>
        )}

        {(ctaText && ctaLink) || (secondaryCtaText && secondaryCtaLink) ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-appear opacity-0 delay-500 w-full sm:w-auto px-4">
            {ctaText && ctaLink && (
              <Link href={ctaLink} target={ctaTarget} rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined} className="w-full sm:w-auto">
                <div className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs md:text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                  <span className="relative z-10">{ctaText}</span>
                  <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            )}

            {secondaryCtaText && secondaryCtaLink && (
              <Link href={secondaryCtaLink} target={secondaryCtaTarget} rel={secondaryCtaTarget === "_blank" ? "noopener noreferrer" : undefined} className="w-full sm:w-auto">
                <div className="group inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-xs md:text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:translate-y-0">
                  <span>{secondaryCtaText}</span>
                </div>
              </Link>
            )}
          </div>
        ) : null}

        {mockupImage && (
          <div className="mt-16 w-full max-w-6xl mx-auto relative animate-appear opacity-0 delay-700 px-4 md:px-0">
            <MockupFrame className="rounded-[1.5rem] md:rounded-[3rem] border border-black/5 bg-white/50 backdrop-blur-sm ring-[8px] md:ring-[16px] ring-primary/10">
              <Mockup type="responsive" className="rounded-[1.2rem] md:rounded-[2.8rem]">
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
