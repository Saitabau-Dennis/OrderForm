"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { TextHighlight } from "@/components/ui/text-highlight"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "The Starter",
    price: "KES 0",
    period: "forever",
    description: "Best for new sellers and side-hustles.",
    features: [
      "Up to 5 Products",
      "Unlimited Orders",
      "Secure WhatsApp Checkout",
      "Standard Support"
    ],
    cta: "Start for free"
  },
  {
    name: "The Pro",
    price: "KES 499",
    period: "/ month",
    description: "For serious brands ready to scale.",
    features: [
      "Unlimited Products",
      "Analytics & Insights",
      "Priority WhatsApp Support",
      "Multiple Delivery Zones"
    ],
    cta: "Get Started",
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
            Simple, <TextHighlight color="blue" className="-rotate-1">transparent</TextHighlight> pricing
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
                  ? "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-2xl scale-100 md:scale-105 z-10 rounded-[2.5rem] ring-4 ring-primary/20"
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
                  {plan.price !== "KES 0" && (
                    <span className={cn(
                        "text-lg font-medium self-start mt-2",
                         plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>KES</span>
                  )}
                  <span className={cn(
                      "text-5xl md:text-6xl font-medium font-heading tracking-tighter",
                      plan.popular ? "text-white" : "text-foreground"
                  )}>
                    {plan.price === "KES 0" ? "Free" : plan.price.replace("KES ", "")}
                  </span>
                  {plan.period && (
                    <span className={cn(
                        "text-lg font-sans font-medium",
                        plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {plan.period}
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
                      "mt-1 flex-shrink-0",
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

              <Button
                className={cn(
                    "w-full h-14 text-base font-medium rounded-xl transition-all shadow-none",
                    plan.popular
                        ? "bg-white text-primary hover:bg-white/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {plan.cta}
              </Button>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
