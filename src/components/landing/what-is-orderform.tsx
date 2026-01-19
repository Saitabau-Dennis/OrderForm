"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { TextHighlight } from "@/components/ui/text-highlight"

export function WhatIsOrderform() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollAnimation variant="fade-up">
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground mb-8 leading-tight">
            What is Ordeform?
          </h2>
        </ScrollAnimation>
        
        <ScrollAnimation variant="fade-up" delay={0.1}>
          <div className="text-lg md:text-xl text-muted-foreground font-sans font-normal leading-relaxed max-w-3xl mx-auto space-y-6">
            <p>
              Ordeform is a simple storefront built for{" "}
              <TextHighlight color="yellow" className="-rotate-2">
                social media sellers
              </TextHighlight>
              . It turns your Instagram or TikTok bio link into a mini store where customers browse products, add items to a cart, and checkout via WhatsApp.
            </p>
            <p>
              Instead of long back-and-forth chats, Ordeform generates a ready-made WhatsApp message with full order details, which the customer sends directly to the store owner.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}

