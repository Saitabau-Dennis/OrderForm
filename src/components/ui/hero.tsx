"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LandingButton } from "@/components/landing/landing-button"
import { Mockup, MockupFrame } from "@/components/ui/mockup"

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
        className={cn("relative flex flex-col items-center", className)}
        {...props}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 -top-10 h-36 rounded-[2rem] bg-gradient-to-b from-primary/12 via-primary/6 to-transparent blur-2xl md:hidden"
        />

        {badge && (
          <div className="animate-appear opacity-0">
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
          className="text-[1.7rem] sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.08] sm:leading-[1.05] md:leading-[1.05] lg:leading-[1.05] xl:leading-[1.05] text-center px-3 sm:px-4 md:px-6 w-full max-w-7xl mx-auto text-foreground font-heading font-normal animate-appear opacity-0 delay-100 tracking-[-0.03em] sm:tracking-[-0.04em]"
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-[1.02rem] md:text-xl text-center font-sans px-4 sm:px-6 max-w-3xl md:max-w-4xl mx-auto mt-5 md:mt-6 mb-9 md:mb-12 leading-relaxed text-muted-foreground animate-appear opacity-0 delay-300 text-pretty"
          >
            {subtitle}
          </p>
        )}

        {(ctaText && ctaLink) || (secondaryCtaText && secondaryCtaLink) ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 animate-appear opacity-0 delay-500 w-full sm:w-auto max-w-sm sm:max-w-none px-4">
            {ctaText && ctaLink && (
                 <LandingButton asChild size="lg" className="h-11 md:h-12 w-full sm:w-auto rounded-xl px-6 sm:px-8 text-[0.98rem] sm:text-base font-semibold">
                  <Link href={ctaLink} target={ctaTarget} rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}>
                    <span className="relative z-10">{ctaText}</span>
                  </Link>
                 </LandingButton>
            )}

            {secondaryCtaText && secondaryCtaLink && (
                <LandingButton asChild tone="outline" size="lg" className="h-11 md:h-12 w-full sm:w-auto rounded-xl px-6 sm:px-8 text-[0.98rem] sm:text-base font-semibold group">
                  <Link href={secondaryCtaLink} target={secondaryCtaTarget} rel={secondaryCtaTarget === "_blank" ? "noopener noreferrer" : undefined}>
                  <span>{secondaryCtaText}</span>
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </LandingButton>
            )}
          </div>
        ) : null}

        {mockupImage && (
          <div className="mt-10 md:mt-16 w-full max-w-6xl mx-auto relative animate-appear opacity-0 delay-700 px-4 sm:px-4 md:px-0">
            <MockupFrame className="mx-auto w-[92%] sm:w-full p-0 rounded-[0.7rem] sm:rounded-[0.95rem] md:rounded-[1.2rem] border border-[#e3e3e3] ring-[8px] sm:ring-[12px] md:ring-[16px] ring-[#efefef] shadow-[0_16px_36px_rgba(0,0,0,0.08)] bg-white">
              <Mockup type="responsive" className="rounded-[0.65rem] sm:rounded-[0.9rem] md:rounded-[1.1rem] border border-[#e6e6e6] bg-[#fafafa] shadow-none">
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
