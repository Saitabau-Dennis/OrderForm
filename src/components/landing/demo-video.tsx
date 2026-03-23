"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"

function getYouTubeVideoId(source: string | undefined): string | null {
  const trimmedSource = source?.trim()
  const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/

  if (!trimmedSource) {
    return null
  }

  if (videoIdPattern.test(trimmedSource)) {
    return trimmedSource
  }

  try {
    const url = new URL(trimmedSource)
    const hostname = url.hostname.replace("www.", "")

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0]
      if (videoIdPattern.test(videoId)) {
        return videoId
      }
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com") {
      const fromQuery = url.searchParams.get("v")
      if (fromQuery && videoIdPattern.test(fromQuery)) {
        return fromQuery
      }

      const pathSegments = url.pathname.split("/").filter(Boolean)
      const embedIndex = pathSegments.indexOf("embed")
      if (embedIndex >= 0) {
        const embedId = pathSegments[embedIndex + 1]
        if (embedId && videoIdPattern.test(embedId)) {
          return embedId
        }
      }
    }
  } catch {
    return null
  }

  return null
}

export function DemoVideo() {
  const demoVideoId = getYouTubeVideoId(process.env.NEXT_PUBLIC_YOUTUBE_DEMO_URL)

  if (!demoVideoId) {
    return null
  }

  const demoVideoEmbedUrl = `https://www.youtube-nocookie.com/embed/${demoVideoId}?rel=0`

  return (
    <section id="demo-video" className="-mt-3 pb-10 md:-mt-4 md:pb-14 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation variant="fade-up" delay={0.05}>
          <div className="mx-auto max-w-5xl">
            <div className="relative mx-auto w-full rounded-[2rem] border border-[#e3e3df] bg-[#efefed] p-3 shadow-[0_12px_28px_rgba(20,20,20,0.06)] md:p-4">
              <div className="relative overflow-hidden rounded-[1.65rem] border border-[#dcdcd8] bg-card ring-1 ring-[#ecece9]">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white/45 to-transparent" />
                <div className="aspect-video bg-black">
                  <iframe
                    src={demoVideoEmbedUrl}
                    title="Orderform Demo Video"
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
