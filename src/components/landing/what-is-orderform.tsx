"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { Store, MessageCircle, ArrowRight } from "lucide-react"

export function WhatIsOrderform() {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollAnimation variant="fade-up">
          <p className="font-heading uppercase tracking-[0.2em] text-xs text-primary mb-6 font-medium">
            What is OrderForm?
          </p>
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground mb-8 leading-[1.1] tracking-tight">
            The missing bridge between <span className="text-muted-foreground">social traffic</span> and <span className="text-primary">paid orders.</span>
          </h2>
          <div className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-muted-foreground font-sans">
            <p>
              OrderForm is a simple yet powerful tool designed for social media sellers. It transforms the single link in your bio into a professional, searchable product catalog, allowing customers to browse your items effortlessly. Instead of the usual back-and-forth in DMs, customers can build a cart and send you a pre-filled WhatsApp message with their exact order details, making the buying process seamless and professional.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}

