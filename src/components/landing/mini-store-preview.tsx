"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { BentoDemo } from "@/components/ui/demo"

export function MiniStorePreview() {
  return (
    <section id="mini-store" className="py-8 md:py-12 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
          <ScrollAnimation variant="fade-up">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 text-primary text-xs font-medium mb-4 uppercase tracking-[0.16em]">
              Mini store
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-semibold text-foreground leading-[1.06] tracking-[-0.02em]">
              A checkout experience your <br className="hidden md:block" />
               customers will <span className="text-primary">actually love.</span>
            </h2>
          </ScrollAnimation>

          <ScrollAnimation variant="fade-up" delay={0.1}>
            <p className="mt-6 text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
              Fast, visual, and incredibly simple. We&apos;ve stripped away the clutter of traditional e-commerce to give your social media traffic exactly what they want: a direct path to purchase.
            </p>
          </ScrollAnimation>
        </div>

        <ScrollAnimation variant="fade-up" delay={0.15}>
          <BentoDemo />
        </ScrollAnimation>
      </div>
    </section>
  )
}
