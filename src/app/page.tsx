import { Navbar } from "@/components/landing/navbar"
import { TextHighlight } from "@/components/ui/text-highlight"
import { Hero } from "@/components/ui/hero"
import { AboutUs } from "@/components/landing/about-us"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { MiniStorePreview } from "@/components/landing/mini-store-preview"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col theme-landing bg-background text-foreground">
      <Navbar />

      <Hero
        className="pt-28 pb-8 md:pt-32 md:pb-12"
        badge={
          <div className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm font-medium hover:border-primary/30 transition-all duration-300 cursor-default">
            <span className="text-sm">🛍️</span>
            <span className="text-muted-foreground">Introducing OrderForm</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        }
        title={
          <>
            Turn social media traffic into{" "}
            clean <span className="font-[family-name:var(--font-instrument-serif)] italic font-normal">WhatsApp orders</span>
          </>
        }
        subtitle={
          <>
            Organize your social media sales with a{" "}
            <span className="text-foreground font-medium">professional one-click store</span>{" "}
            that sends orders directly to your WhatsApp.
          </>
        }
        ctaText="Create your store"
        ctaLink="/register"
        ctaTarget="_blank"
        secondaryCtaText="Features"
        secondaryCtaLink="#features"
        mockupImage={{
          src: "/images/dashboard-v2.png",
          alt: "OrderForm Dashboard Interface",
          width: 1274,
          height: 1043
        }}
      />

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
