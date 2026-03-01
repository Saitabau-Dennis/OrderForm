import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/ui/hero"
import { AboutUs } from "@/components/landing/about-us"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { MiniStorePreview } from "@/components/landing/mini-store-preview"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { AnimatedBadge } from "@/components/ui/animated-badge"
import { TextHighlight } from "@/components/ui/text-highlight"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col theme-landing font-sans bg-background text-foreground">
      <Navbar />

      <Hero
        className="pt-24 pb-6 md:pt-32 md:pb-12"
        badge={
          <AnimatedBadge text="Introducing OrderForm" />
        }
        title={
          <>
            Turn social media traffic <br />
            into clean <TextHighlight color="yellow" className="[font-family:var(--font-sora)] italic text-foreground font-light tracking-tight px-1">WhatsApp orders</TextHighlight>
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
