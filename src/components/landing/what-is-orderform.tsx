"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { Store, MessageCircle, ArrowRight } from "lucide-react"

export function WhatIsOrderform() {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollAnimation variant="fade-up">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 text-primary text-[13px] font-medium mb-6 uppercase tracking-[0.16em]">
            What is <span className="[font-family:var(--font-instrument-serif)] text-lg capitalize tracking-tight font-normal ml-1.5 -mb-0.5">Orderform</span>?
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-semibold text-foreground mb-8 leading-[1.06] tracking-[-0.02em]">
            The missing bridge between <span className="text-muted-foreground">social traffic</span> and <span className="text-primary">paid orders.</span>
          </h2>
          <div className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-muted-foreground font-sans">
            <p>
              <span className="[font-family:var(--font-instrument-serif)] text-2xl font-normal tracking-tight text-primary mt-1 -mb-1 inline-block">Orderform</span> is a simple yet powerful tool designed for social media sellers. It transforms the single link in your bio into a professional, searchable product catalog, allowing customers to browse your items effortlessly. Instead of the usual back-and-forth in DMs, customers can build a cart and send you a pre-filled WhatsApp message with their exact order details, making the buying process seamless and professional.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
