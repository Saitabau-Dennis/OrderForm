"use client"

import { cn } from "@/lib/utils"
import { Lamp } from "lucide-react"
import { NotificationsDemo } from "@/components/landing/notifications-demo"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

export function WhatIsOrderform() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="order-2 md:order-1">
            <ScrollAnimation variant="fade-right">
              <h2 className="text-4xl md:text-5xl leading-[1.1] font-heading font-bold text-foreground mb-6">
                Stop the endless <br />
                <span className="italic text-muted-foreground">"how much?"</span>
              </h2>
            </ScrollAnimation>
            <ScrollAnimation variant="fade-right" delay={0.1}>
              <p className="text-xl text-muted-foreground font-sans font-normal leading-relaxed max-w-md mb-8">
                OrderForm is a streamlined link-in-bio tool designed specifically for social media sellers. Instead of managing chaotic DMs, you get a simple, professional product link to share with customers.
              </p>
            </ScrollAnimation>
            <ScrollAnimation variant="fade-right" delay={0.2}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">✕</span>
                  </div>
                  <span className="font-sans text-muted-foreground">No more "is this available?" DMs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">✕</span>
                  </div>
                  <span className="font-sans text-muted-foreground">No more manual payment tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-sm text-green-600">✓</span>
                  </div>
                  <span className="font-sans text-foreground font-medium">Just instant, organized orders</span>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Column: Visual Comparison */}
          <div className="order-1 md:order-2 relative h-full min-h-[500px]">
             <ScrollAnimation variant="fade-left" className="h-full">
               <div className="absolute inset-0 bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
                  <NotificationsDemo className="h-full w-full bg-transparent" />
               </div>
             </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  )
}
