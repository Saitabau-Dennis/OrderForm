"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, X } from "lucide-react"
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
  secondaryCtaOpensVideoModal?: boolean
  demoVideoUrl?: string
  mockupImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

function getYouTubeVideoId(source: string | undefined): string | null {
  const trimmedSource = source?.trim()
  const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/

  if (!trimmedSource) return null
  if (videoIdPattern.test(trimmedSource)) return trimmedSource

  try {
    const url = new URL(trimmedSource)
    const hostname = url.hostname.replace("www.", "")

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0]
      if (videoIdPattern.test(videoId)) return videoId
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com") {
      const fromQuery = url.searchParams.get("v")
      if (fromQuery && videoIdPattern.test(fromQuery)) return fromQuery

      const pathSegments = url.pathname.split("/").filter(Boolean)
      const embedIndex = pathSegments.indexOf("embed")
      if (embedIndex >= 0) {
        const embedId = pathSegments[embedIndex + 1]
        if (embedId && videoIdPattern.test(embedId)) return embedId
      }
    }
  } catch {
    return null
  }

  return null
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
      secondaryCtaOpensVideoModal = false,
      demoVideoUrl,
      mockupImage,
      ...props
    },
    ref
  ) => {
    const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false)
    const demoVideoId = getYouTubeVideoId(demoVideoUrl)
    const demoVideoEmbedUrl = demoVideoId
      ? `https://www.youtube-nocookie.com/embed/${demoVideoId}?rel=0&autoplay=1`
      : null
    const showSecondaryCta = Boolean(secondaryCtaText && (secondaryCtaLink || (secondaryCtaOpensVideoModal && demoVideoEmbedUrl)))

    React.useEffect(() => {
      if (!isDemoModalOpen) return

      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      return () => {
        document.body.style.overflow = previousOverflow
      }
    }, [isDemoModalOpen])

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

        {(ctaText && ctaLink) || showSecondaryCta ? (
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 animate-appear opacity-0 delay-500 w-full sm:w-auto max-w-[20rem] sm:max-w-none px-5">
            {ctaText && ctaLink && (
                 <LandingButton asChild size="lg" className="h-9.5 sm:h-10.5 md:h-11 min-w-[9.2rem] sm:min-w-0 flex-none rounded-xl px-3.5 sm:px-7 text-[0.9rem] sm:text-[0.98rem] font-semibold">
                  <Link href={ctaLink} target={ctaTarget} rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}>
                    <span className="relative z-10">{ctaText}</span>
                  </Link>
                 </LandingButton>
            )}

            {showSecondaryCta && secondaryCtaText ? (
                secondaryCtaOpensVideoModal && demoVideoEmbedUrl ? (
                  <LandingButton
                    type="button"
                    onClick={() => setIsDemoModalOpen(true)}
                    tone="outline"
                    size="lg"
                    className="h-9.5 sm:h-10.5 md:h-11 min-w-[8rem] sm:min-w-0 flex-none rounded-xl px-3.5 sm:px-7 text-[0.9rem] sm:text-[0.98rem] font-semibold group"
                  >
                    <span>{secondaryCtaText}</span>
                    <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </LandingButton>
                ) : (
                  <LandingButton asChild tone="outline" size="lg" className="h-9.5 sm:h-10.5 md:h-11 min-w-[8rem] sm:min-w-0 flex-none rounded-xl px-3.5 sm:px-7 text-[0.9rem] sm:text-[0.98rem] font-semibold group">
                    <Link href={secondaryCtaLink!} target={secondaryCtaTarget} rel={secondaryCtaTarget === "_blank" ? "noopener noreferrer" : undefined}>
                      <span>{secondaryCtaText}</span>
                      <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </LandingButton>
                )
            ) : null}
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

        {isDemoModalOpen && demoVideoEmbedUrl ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6" role="dialog" aria-modal="true" aria-label="Demo video">
            <button
              type="button"
              className="absolute inset-0 h-full w-full cursor-default"
              aria-label="Close demo video"
              onClick={() => setIsDemoModalOpen(false)}
            />
            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl">
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={demoVideoEmbedUrl}
                  title="Orderform Demo Video"
                  className="h-full w-full"
                  loading="eager"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
)
Hero.displayName = "Hero"

export { Hero }
