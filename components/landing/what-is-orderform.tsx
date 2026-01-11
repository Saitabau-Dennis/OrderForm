"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { TextHighlight } from "@/components/ui/text-highlight"

export function WhatIsOrderform() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollAnimation variant="fade-up">
            <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-6">
               What is OrderForm?
            </p>
            <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground mb-8 leading-tight">
                The <TextHighlight color="pink" className="rotate-1">all-in-one retail link</TextHighlight> for <br className="hidden md:block"/>
                social sellers.
            </h2>
        </ScrollAnimation>
        
        <ScrollAnimation variant="fade-up" delay={0.1}>
            <p className="text-lg md:text-xl text-muted-foreground font-sans font-normal leading-relaxed max-w-3xl mx-auto">
                It bridges the gap between your social media and your WhatsApp, allowing you to showcase a professional catalog, accept orders instantly, and automatically reward customers who return to share photo proof of their purchase. It turns one-time buyers into loyal brand advocates.
            </p>
        </ScrollAnimation>
      </div>
    </section>
  )
}

