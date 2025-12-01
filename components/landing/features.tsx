"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

const features = [
  {
    title: "Direct WhatsApp Checkout",
    description: "Bypass complex shopping carts. Orders land directly in your WhatsApp chat as a pre-filled message, allowing you to confirm details and close the sale instantly.",
    className: "md:col-span-1",
  },
  {
    title: "No Accounts Required",
    description: "Remove barriers for your customers. They don't need to download an app or create a password to buy from you. They just click, select, and order in seconds.",
    className: "md:col-span-1",
  },
  {
    title: "Real-Time Inventory",
    description: "Avoid the awkward \"Sorry, sold out\" texts. Mark items as unavailable in your dashboard, and they instantly disappear from your store to prevent over-ordering.",
    className: "md:col-span-1",
  },
  {
    title: "Auto-Calculated Delivery",
    description: "Stop asking \"Where are you located?\". Customers pick their zone (e.g., Nairobi CBD vs. Rongai), and the correct delivery fee is automatically added to the total.",
    className: "md:col-span-1",
  },
  {
    title: "Store Analytics",
    description: "Stop guessing and start knowing. Track exactly how many people are visiting your store link daily so you can see which social media posts are actually driving traffic.",
    className: "md:col-span-2 text-center",
    isFullWidth: true,
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation className="mb-16 text-center">
           <p className="font-heading uppercase tracking-[0.2em] text-sm text-muted-foreground mb-4">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl leading-[1.1] font-heading font-bold text-foreground mb-6">
            Everything you need, <br />
            <span className="text-muted-foreground">nothing you don't</span>
          </h2>
          <p className="text-xl text-muted-foreground font-sans font-normal leading-relaxed max-w-md mx-auto">
            Powerful features wrapped in a simple interface. Built for speed and conversion.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <ScrollAnimation
              key={index}
              delay={index * 0.1}
              className={cn(
                "group relative overflow-hidden bg-card border border-border rounded-3xl p-6 md:p-8 hover:border-foreground/20 transition-colors",
                feature.className
              )}
            >
              <div className={cn("mb-8", feature.isFullWidth && "max-w-2xl mx-auto")}>
                <h3 className="mb-3 font-heading font-bold text-2xl text-foreground">
                  {feature.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>

              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-border shadow-sm bg-muted/50">
                <Image
                  src="/images/dashboard.png"
                  alt={feature.title}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
