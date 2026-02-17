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
import { AnimatedBadge } from "@/components/ui/animated-badge"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col theme-landing font-sans bg-background text-foreground">
      <Navbar />

      <Hero
        className="pt-28 pb-8 md:pt-32 md:pb-12"
        badge={
          <AnimatedBadge text="Introducing OrderForm" />
        }
        title={
          <>
            Turn social media traffic into{" "}
            clean <span className="font-heading italic font-normal">WhatsApp orders</span>
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
