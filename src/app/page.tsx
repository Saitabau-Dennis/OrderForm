import { Navbar } from "@/components/landing/navbar"
import { TextHighlight } from "@/components/ui/text-highlight"
import { HandwrittenUnderline } from "@/components/ui/handwritten-underline"
import { Hero } from "@/components/ui/hero"
import { AboutUs } from "@/components/landing/about-us"
import { WhatIsOrderform } from "@/components/landing/what-is-orderform"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
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
        className="pt-32 pb-8 md:pb-12"

        title={
          <span>
            Turn{" "}
            <TextHighlight color="yellow" className="px-3 py-1 -rotate-2">
              social media
            </TextHighlight>{" "}
            traffic into clean{" "}
            <HandwrittenUnderline className="mx-1" underlineClassName="-bottom-3 md:-bottom-4 h-4 md:h-5">
              WhatsApp orders
            </HandwrittenUnderline>
          </span>
        }
        subtitle="Give your Instagram shop a simple store where customers browse products, add them to a cart, and send you a complete order on WhatsApp in one click."
        ctaText="Create your store"
        ctaLink="/register"
        ctaTarget="_blank"
        mockupImage={{
          src: "/images/dashboard.png",
          alt: "OrderForm Dashboard Interface",
          width: 1274,
          height: 1043
        }}
      />

      <WhatIsOrderform />
      <AboutUs />
      <Features />
      <HowItWorks />
      <MiniStorePreview />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
