"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LandingButton } from "@/components/landing/landing-button"

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
          className="text-[clamp(1.24rem,5.25vw,3.25rem)] leading-[1.08] sm:leading-[1.05] text-center px-4 sm:px-4 w-full max-w-[18ch] sm:max-w-[19ch] md:max-w-[22ch] lg:max-w-none mx-auto text-foreground font-heading font-normal animate-appear opacity-0 delay-100 tracking-[-0.015em] sm:tracking-[-0.05em] text-balance"
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-[1.04rem] sm:text-[1.12rem] md:text-[1.26rem] text-center font-sans px-5 sm:px-6 max-w-[34ch] sm:max-w-2xl md:max-w-3xl mx-auto mt-4 sm:mt-5 md:mt-6 mb-7 md:mb-10 leading-[1.6] text-muted-foreground animate-appear opacity-0 delay-300 text-balance"
          >
            {subtitle}
          </p>
        )}

        {(ctaText && ctaLink) || (secondaryCtaText && secondaryCtaLink) ? (
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 animate-appear opacity-0 delay-500 w-full sm:w-auto max-w-[20rem] sm:max-w-none px-5">
            {ctaText && ctaLink && (
                 <LandingButton asChild size="lg" className="h-9.5 sm:h-10.5 md:h-11 min-w-[9.2rem] sm:min-w-0 flex-none rounded-xl px-3.5 sm:px-7 text-[0.9rem] sm:text-[0.98rem] font-semibold">
                  <Link href={ctaLink} target={ctaTarget} rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}>
                    <span className="relative z-10">{ctaText}</span>
                  </Link>
                 </LandingButton>
            )}

            {secondaryCtaText && secondaryCtaLink && (
                <LandingButton asChild tone="outline" size="lg" className="h-9.5 sm:h-10.5 md:h-11 min-w-[8rem] sm:min-w-0 flex-none rounded-xl px-3.5 sm:px-7 text-[0.9rem] sm:text-[0.98rem] font-semibold group">
                  <Link href={secondaryCtaLink} target={secondaryCtaTarget} rel={secondaryCtaTarget === "_blank" ? "noopener noreferrer" : undefined}>
                  <span>{secondaryCtaText}</span>
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </LandingButton>
            )}
          </div>
        ) : null}

        {mockupImage && (
          <div className="mt-8 sm:mt-12 md:mt-16 w-full max-w-[24rem] sm:max-w-6xl mx-auto relative animate-appear opacity-0 delay-700 px-4 sm:px-4 md:px-0">
            <div className="relative mx-auto w-full rounded-[2rem] border border-[#e3e3df] bg-[#efefed] p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(20,20,20,0.06)] md:p-4">
              <div className="relative overflow-hidden rounded-[1.65rem] border border-[#dcdcd8] bg-white ring-1 ring-[#ecece9]">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white/45 to-transparent" />
                <Image
                  src={mockupImage.src}
                  alt={mockupImage.alt}
                  width={mockupImage.width}
                  height={mockupImage.height}
                  className="w-full brightness-[0.99] saturate-[0.82] contrast-[0.98]"
                  priority
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-b from-transparent via-[#f7f7f5]/72 to-[#f7f7f5]" />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)
Hero.displayName = "Hero"

export { Hero }
