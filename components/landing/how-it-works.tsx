"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ClipboardList, Share2, MessageCircle } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "1. Create your store",
    description: "Add your products, photos, and prices in minutes. No technical skills required."
  },
  {
    icon: Share2,
    title: "2. Share your link",
    description: "Post your unique OrderForm link in your Instagram bio, TikTok profile, or Facebook posts."
  },
  {
    icon: MessageCircle,
    title: "3. Get WhatsApp orders",
    description: "Customers browse and order. You receive a perfectly formatted WhatsApp message to finalize."
  }
]

export function HowItWorks() {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-4">
            How it works
          </p>
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground">
            Start selling in <span className="italic">minutes</span>
          </h2>
        </ScrollAnimation>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

          {steps.map((step, index) => (
            <ScrollAnimation key={index} delay={index * 0.2} className="relative bg-background p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/5 border-[6px] border-background flex items-center justify-center mb-6 shadow-sm">
                   <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
