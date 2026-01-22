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
            className="font-heading uppercase tracking-[0.2em] leading-[133%] text-center text-[10px] md:text-sm mb-6 md:mb-8 text-primary font-medium animate-appear opacity-0 delay-100"
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-4xl md:text-7xl leading-[1.1] text-center px-4 md:px-6 max-w-5xl text-foreground font-heading font-medium animate-appear opacity-0 delay-100 tracking-tighter"
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-lg md:text-2xl text-center font-sans font-normal px-6 max-w-3xl mt-6 mb-12 leading-[1.4] text-muted-foreground animate-appear opacity-0 delay-300"
          >
            {subtitle}
          </p>
        )}

        {(ctaText && ctaLink) || (secondaryCtaText && secondaryCtaLink) ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-appear opacity-0 delay-500">
            {ctaText && ctaLink && (
              <Link href={ctaLink} target={ctaTarget} rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}>
                <div className="inline-flex items-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium h-14 px-10 shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200">
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-lg md:text-xl whitespace-nowrap">{ctaText}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            )}

            {secondaryCtaText && secondaryCtaLink && (
              <Link href={secondaryCtaLink} target={secondaryCtaTarget} rel={secondaryCtaTarget === "_blank" ? "noopener noreferrer" : undefined}>
                <div className="inline-flex items-center border border-border bg-background text-foreground rounded-full hover:bg-muted transition-colors font-medium h-14 px-10 shadow-sm hover:shadow-md transform duration-200">
                  <span className="text-lg md:text-xl whitespace-nowrap">{secondaryCtaText}</span>
                </div>
              </Link>
            )}
          </div>
        ) : null}

        {mockupImage && (
          <div className="mt-16 w-full max-w-6xl mx-auto relative animate-appear opacity-0 delay-700 px-4 md:px-0">
            <MockupFrame className="shadow-2xl rounded-[1.5rem] md:rounded-[3rem] border border-black/5 bg-white/50 backdrop-blur-sm ring-[8px] md:ring-[16px] ring-primary/10">
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
