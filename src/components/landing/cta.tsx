
import Link from "next/link"
import { LandingButton } from "@/components/landing/landing-button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

export function CTA() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation variant="fade-up">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#04281e]">
            {/* <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" /> */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 py-10 md:px-10 md:py-14">
              <h2 className="text-2xl font-heading font-normal tracking-tight text-white md:text-4xl">
                The fastest way to turn DMs into real orders
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-lg">
                OrderForm gives your customers a fast storefront, cart, and checkout that sends complete order details to WhatsApp.
              </p>
              <LandingButton
                asChild
                tone="outline"
                size="lg"
                className="mt-6 border-white/80 bg-transparent text-white hover:bg-white hover:text-[#04281e] focus-visible:ring-white focus-visible:ring-offset-[#04281e]"
              >
                <Link href="/register" target="_blank">
                  Create your store
                </Link>
              </LandingButton>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
