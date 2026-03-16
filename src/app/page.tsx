import { auth } from "@/lib/auth"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/ui/hero"
import { AboutUs } from "@/components/landing/about-us"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { DemoVideo } from "@/components/landing/demo-video"
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
        className="pt-[4.65rem] pb-4 sm:pt-24 md:pt-28 md:pb-8"
        badge={
          <AnimatedBadge text="Built for Social Sellers" />
        }
        title={
          <>
            <span className="block whitespace-nowrap sm:hidden">
              Turn{" "}
              <span className="[font-family:var(--font-sora)] italic text-[#334155] font-normal tracking-[-0.03em]">
                DMs
              </span>{" "}
              into orders
            </span>
            <span className="block whitespace-nowrap sm:hidden">
              without back-and-forth
            </span>

            <span className="hidden sm:block lg:whitespace-nowrap">
              Turn{" "}
              <span className="[font-family:var(--font-sora)] italic text-[#334155] font-normal tracking-[-0.03em]">
                DM conversations
              </span>{" "}
              into confirmed orders
            </span>
            <span className="hidden sm:block lg:whitespace-nowrap">
              without the back-and-forth
            </span>
          </>
        }
        subtitle={
          <>
            <span className="sm:hidden">
              Launch a clean storefront and checkout in seconds. Every order lands in WhatsApp with full customer details.
            </span>
            <span className="hidden sm:inline">
              Launch a clean storefront, cart, and checkout in seconds.
              <span className="text-foreground"> Every order lands in WhatsApp with complete customer details.</span>
            </span>
          </>
        }
        ctaText="Create your store"
        ctaLink="/register"
        ctaTarget="_blank"
        secondaryCtaText="See demo"
        secondaryCtaLink="https://saitabau.orderform.store/"
        secondaryCtaTarget="_blank"
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
      <DemoVideo />
      <MiniStorePreview />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
