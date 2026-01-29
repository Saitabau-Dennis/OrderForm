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
import { Sparkles, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col theme-landing bg-background text-foreground">
      <Navbar />

      <Hero
        className="pt-16 pb-8 md:pb-12"
        badge={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] md:text-xs font-medium hover:bg-primary/10 transition-colors cursor-default shadow-sm shadow-primary/5">
            <Sparkles className="h-3 w-3 fill-current animate-pulse" />
            <span className="tracking-wide">Introducing OrderForm</span>
          </div>
        }
        title={
          <span className="font-normal">
            Turn social media traffic into clean <span className="italic font-light">WhatsApp orders</span>
          </span>
        }
        subtitle="Organize your social media sales with a professional one-click store that sends orders directly to your WhatsApp."
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
