import { Navbar } from "@/components/landing/navbar"
import { UnderlinedText } from "@/components/ui/underlined-text"
import { Hero } from "@/components/ui/hero"
import { WhatIsOrderform } from "@/components/landing/what-is-orderform"
import { Features } from "@/components/landing/features"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col theme-landing bg-background text-foreground">
      <Navbar />

      <Hero
        className="pt-36 pb-16"

        eyebrow="STREAMLINED LINK-IN-BIO STORE"
        title={
          <>
            <div className="whitespace-nowrap">
              <span className="font-instrument-serif font-normal">Turn chaotic DMs </span>
              <span className="font-instrument-serif font-normal italic">into </span>
            </div>
            <div className="font-instrument-serif font-normal">
              <UnderlinedText className="font-instrument-serif">instant WhatsApp orders</UnderlinedText>
            </div>
          </>
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
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
