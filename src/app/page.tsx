import { auth } from "@/lib/auth"
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

export default async function Home() {
  const session = await auth()

  return (
    <main className="min-h-screen flex flex-col theme-landing font-sans bg-background text-foreground">
      <Navbar isAuthenticated={!!session} />

      <Hero
        className="pt-20 pb-4 md:pt-24 md:pb-8"
        badge={
          <AnimatedBadge text="Built for Social Sellers" />
        }
        title={
          <>
            The fastest way to turn{" "}
            <span className="[font-family:var(--font-sora)] italic text-foreground font-light tracking-tight px-1">DMs into real orders</span>
          </>
        }
        subtitle={
          <>
            OrderForm gives your customers a fast storefront, cart, and checkout that sends complete order details to WhatsApp.
            <span className="text-foreground font-medium"> No app downloads, no messy DM back-and-forth.</span>
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
