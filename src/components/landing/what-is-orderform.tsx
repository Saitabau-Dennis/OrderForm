"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { Store, MessageCircle, ArrowRight } from "lucide-react"

export function WhatIsOrderform() {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollAnimation variant="fade-up">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-primary/20 text-primary text-[10px] font-medium mb-6 uppercase tracking-widest">
            What is OrderForm?
          </div>
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

