"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ShoppingBag, Utensils, Smartphone, Palette, Globe, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const audiences = [
  {
    title: "Instagram Boutiques",
    description: "Display your latest collections without the 'DM for price' friction. Let customers shop your bio link instantly.",
    icon: ShoppingBag,
    color: "text-pink-500",
    bg: "bg-pink-50"
  },
  {
    title: "Home Bakers & Chefs",
    description: "Take pre-orders for your delicious treats. Organize delivery dates and dietary preferences through structured WhatsApp forms.",
    icon: Utensils,
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    title: "Tech & Gadgets",
    description: "Sell phones, accessories, and electronics with clear specs and variant pricing (like storage or color).",
    icon: Smartphone,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "Freelance Creatives",
    description: "Sell your digital assets, art prints, or custom services with a professional checkout experience.",
    icon: Palette,
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    title: "Dropshippers",
    description: "Scale your social media ads by sending traffic to a lightning-fast checkout page instead of a heavy website.",
    icon: Globe,
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    title: "Beauty & Wellness",
    description: "Perfect for organic skincare brands and wellness shops looking for a clean, minimalist storefront.",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-50"
  }
]

export function TargetAudience() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <ScrollAnimation variant="fade-up">
            <div className="inline-flex items-center px-2 py-0.5 rounded-none landing-section-tag border border-primary/20 text-primary text-[10px] font-semibold mb-4 uppercase tracking-[0.12em]">
              Who is it for?
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-normal text-foreground mb-6 leading-[1.06] tracking-[-0.02em]">
              Built for every kind of <span className="text-primary italic font-heading">social seller.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
              Whether you&apos;re just starting out or processing hundreds of orders, OrderForm adapts to your business needs.
            </p>
          </ScrollAnimation>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((item, index) => (
            <ScrollAnimation key={index} delay={index * 0.1}>
              <div className="group p-8 rounded-2xl border border-border/60 bg-white hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-start">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("w-6 h-6", item.color)} />
                </div>
                <h3 className="text-xl font-heading font-normal text-foreground mb-3 tracking-[-0.01em]">{item.title}</h3>
                <p className="text-base text-muted-foreground font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
