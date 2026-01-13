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
  secondaryCtaText?: string
  secondaryCtaLink?: string
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
      secondaryCtaText,
      secondaryCtaLink,
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
            className="font-heading uppercase tracking-[0.2em] leading-[133%] text-center text-[10px] md:text-sm mb-6 md:mb-8 text-muted-foreground animate-appear opacity-0 delay-100"
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-3xl md:text-6xl leading-[1.1] text-center px-4 md:px-6 max-w-4xl text-foreground font-heading font-medium animate-appear opacity-0 delay-100 tracking-tight"
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-base md:text-xl text-center font-sans font-normal px-6 max-w-2xl mt-6 mb-12 leading-[1.5] text-muted-foreground animate-appear opacity-0 delay-300"
          >
            {subtitle}
          </p>
        )}

        {(ctaText && ctaLink) || (secondaryCtaText && secondaryCtaLink) ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-appear opacity-0 delay-500">
            {ctaText && ctaLink && (
              <Link href={ctaLink}>
                <div className="inline-flex items-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium h-12 px-8 shadow-lg hover:shadow-xl hover:scale-105 transform duration-200">
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-base md:text-lg whitespace-nowrap">{ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )}

            {secondaryCtaText && secondaryCtaLink && (
              <Link href={secondaryCtaLink}>
                <div className="inline-flex items-center border border-border bg-background text-foreground rounded-full hover:bg-muted transition-colors font-medium h-12 px-8 shadow-sm hover:shadow-md transform duration-200">
                  <span className="text-base md:text-lg whitespace-nowrap">{secondaryCtaText}</span>
                </div>
              </Link>
            )}
          </div>
        ) : null}

        {mockupImage && (
          <div className="mt-16 w-full max-w-[90rem] mx-auto relative animate-appear opacity-0 delay-700 px-1 md:px-0">
            <MockupFrame className="shadow-2xl rounded-[1rem] md:rounded-[2.5rem] border border-black/5 bg-white/50 backdrop-blur-sm ring-[6px] md:ring-[12px] ring-primary/20">
              <Mockup type="responsive" className="rounded-[0.8rem] md:rounded-[2.2rem]">
                <Image
                  src={mockupImage.src}
                  alt={mockupImage.alt}
                  width={mockupImage.width}
                  height={mockupImage.height}
                  className="w-full"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-background via-background/40 to-transparent z-10 pointer-events-none" />
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
