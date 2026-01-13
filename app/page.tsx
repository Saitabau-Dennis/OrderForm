import { Navbar } from "@/components/landing/navbar"
import { UnderlinedText } from "@/components/ui/underlined-text"
import { TextHighlight } from "@/components/ui/text-highlight"
import { Hero } from "@/components/ui/hero"
import { WhatIsOrderform } from "@/components/landing/what-is-orderform"
import { Features } from "@/components/landing/features"
import { MiniStorePreview } from "@/components/landing/mini-store-preview"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col theme-landing bg-background text-foreground">
      <Navbar />

      <Hero
        className="pt-32 pb-12 md:pb-20"

        eyebrow="STREAMLINED LINK-IN-BIO STORE"
        title={
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <span className="font-instrument-serif font-normal">Turn</span>
              <TextHighlight color="orange" className="-rotate-2 font-instrument-serif">chaotic DMs</TextHighlight>
              <span className="font-instrument-serif font-normal italic">into </span>
            </div>
            <div className="font-instrument-serif font-normal">
              <TextHighlight color="green" className="rotate-1 font-instrument-serif">instant</TextHighlight> WhatsApp orders
            </div>
          </div>
        }
        subtitle="The simple, professional product link for Instagram, TikTok, and Facebook sellers. No account needed for buyers."
        ctaText="Create your store"
        ctaLink="/register"
        mockupImage={{
          src: "/images/dashboard.png",
          alt: "OrderForm Dashboard Interface",
          width: 1274,
          height: 1043
        }}
      />

      <WhatIsOrderform />
      <Features />
      <MiniStorePreview />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
