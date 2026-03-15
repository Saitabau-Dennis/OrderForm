"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { MiniStoreBento } from "@/components/landing/bento-demo"

export function MiniStorePreview() {
  return (
    <section id="mini-store" className="py-10 md:py-14 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8 md:mb-10 max-w-4xl mx-auto">
          <ScrollAnimation variant="fade-up">
            <div className="inline-flex items-center px-2 py-0.5 rounded-none landing-section-tag text-primary text-[10px] font-medium mb-4 uppercase tracking-[0.12em]">
              Mini store
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-normal text-foreground leading-[1.06] tracking-[-0.02em]">
              A checkout experience your <br className="hidden md:block" />
               customers will <span className="text-primary">actually love.</span>
            </h2>
          </ScrollAnimation>

          <ScrollAnimation variant="fade-up" delay={0.1}>
            <p className="mt-4 text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
              Fast, visual, and built for mobile buyers. Customers can search products, filter categories, adjust cart quantities, and checkout in a few taps.
            </p>
          </ScrollAnimation>
        </div>

        <ScrollAnimation variant="fade-up" delay={0.12}>
          <MiniStoreBento />
        </ScrollAnimation>
      </div>
    </section>
  )
}
