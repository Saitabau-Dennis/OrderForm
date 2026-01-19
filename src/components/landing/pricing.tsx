"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { TextHighlight } from "@/components/ui/text-highlight"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "0",
    period: "always available",
    description: "This removes fear and drives adoption.",
    features: [
      "1 store",
      "Up to 5 products",
      "WhatsApp checkout",
      "Unlimited orders"
    ],
    cta: "Create your store"
  },
  {
    name: "Pro",
    price: "990",
    period: "per month",
    description: "This is what serious sellers upgrade to.",
    features: [
      "Unlimited products",
      "Customer photo uploads (UGC)",
      "Discount codes",
      "Priority support"
    ],
    cta: "Upgrade to Pro",
    popular: true
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-12 md:py-24 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-20">
          <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary/80 mb-4 font-medium">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground leading-[1.1] tracking-tight">
            Simple,{" "}
            <TextHighlight color="green" className="px-3 py-1 -rotate-2">
              transparent
            </TextHighlight>{" "}
            pricing
          </h2>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <ScrollAnimation
              key={index}
              delay={index * 0.1}
              className={cn(
                "relative p-8 md:p-12 transition-all duration-300 group flex flex-col",
                plan.popular
                  ? "bg-linear-to-b from-primary to-primary/90 text-primary-foreground shadow-2xl scale-100 md:scale-105 z-10 rounded-[2.5rem] ring-4 ring-primary/20"
                  : "bg-background border border-border/60 shadow-xl rounded-[2.5rem] hover:ring-4 hover:ring-primary/10 ring-4 ring-transparent"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="bg-white text-primary px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider shadow-lg rounded-full flex items-center gap-1.5">
                      <span className="text-[10px]">★</span> Most Popular
                   </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className={cn(
                    "text-lg font-heading font-medium mb-8",
                    plan.popular ? "text-primary-foreground" : "text-foreground"
                )}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className={cn(
                      "text-5xl md:text-6xl font-medium font-heading tracking-tighter",
                      plan.popular ? "text-white" : "text-foreground"
                  )}>
                    {plan.price === "0" ? "Free" : plan.price}
                  </span>
                  {plan.period && (
                    <span className={cn(
                        "text-lg font-sans font-medium",
                        plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {plan.price === "0" ? `(${plan.period})` : plan.period}
                    </span>
                  )}
                </div>


                <p className={cn(
                    "mt-8 text-lg font-sans font-normal leading-relaxed",
                    plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"
                )}>
                  {plan.description}
                </p>
              </div>

              <div className={cn("h-px w-full my-8", plan.popular ? "bg-white/10" : "bg-border/60")} />

              <ul className="space-y-5 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "mt-1 shrink-0",
                      plan.popular ? "text-white" : "text-primary"
                    )}>
                      <Check className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <span className={cn(
                      "text-base font-sans font-medium",
                      plan.popular ? "text-white/90" : "text-foreground/80"
                    )}>
                      {feature}
                    </span>
                    </li>
                ))}
              </ul>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
