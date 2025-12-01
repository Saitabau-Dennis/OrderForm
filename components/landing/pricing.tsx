"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

const plans = [
  {
    name: "The Starter",
    price: "KES 0",
    period: "/ month",
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
      "Analytics (See how many people viewed your store)",
      "Priority WhatsApp Support",
      "Multiple Delivery Zones (Auto-calculate delivery fees)"
    ],
    cta: "Get Started",
    popular: true,
    subPrice: "or KES 4,999 / year"
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollAnimation className="text-center mb-16">
          <p className="font-heading uppercase tracking-[0.2em] text-sm text-muted-foreground mb-4">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-[1.1]">
            Simple, transparent pricing
          </h2>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <ScrollAnimation
              key={index}
              delay={index * 0.1}
              className={`relative p-8 md:p-10 border rounded-3xl transition-all ${
                plan.popular
                  ? "bg-foreground text-background border-foreground shadow-2xl scale-105"
                  : "bg-card border-border shadow-sm hover:shadow-md hover:border-foreground/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-foreground px-4 py-1.5 text-xs font-sans font-medium border border-border shadow-sm rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-heading font-bold mb-3 ${plan.popular ? "text-background" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-4xl md:text-5xl font-bold font-heading ${plan.popular ? "text-background" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-base font-sans ${plan.popular ? "text-background/60" : "text-muted-foreground"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                {plan.subPrice && (
                  <p className={`text-xs font-sans ${plan.popular ? "text-background/60" : "text-muted-foreground"}`}>
                    {plan.subPrice}
                  </p>
                )}
                <p className={`mt-4 text-sm font-sans leading-relaxed ${plan.popular ? "text-background/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <div className={`h-[1px] w-full mb-6 ${plan.popular ? "bg-background/20" : "bg-border"}`} />

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${plan.popular ? "bg-background/10" : "bg-muted"}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? "text-background" : "text-foreground"}`} />
                    </div>
                    <span className={`text-sm font-sans leading-relaxed ${plan.popular ? "text-background/90" : "text-foreground/80"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full h-12 text-base font-sans font-medium rounded-xl transition-all ${
                  plan.popular
                    ? "bg-background text-foreground hover:bg-background/90 shadow-lg"
                    : "bg-foreground text-background hover:bg-foreground/90 shadow-md"
                }`}
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
