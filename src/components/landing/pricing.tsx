"use client"

import { Check, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { TextHighlight } from "@/components/ui/text-highlight"
import { cn } from "@/lib/utils"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for testing the waters. Launch your store in minutes and start receiving orders.",
    features: [
      "1 Storefront",
      "Up to 5 Products",
      "WhatsApp Checkout",
      "Unlimited Orders",
      "0% Transaction Fees"
    ],
    cta: "Start for free",
    href: "/register",
    popular: false
  },
  {
    name: "Business",
    price: "KES 990",
    period: "/ month",
    description: "For growing businesses ready to scale. Unlock powerful features and remove limits.",
    features: [
      "Everything in Starter",
      "Unlimited Products",
      "Customer Photo Uploads",
      "Discount Codes",
      "Priority Support"
    ],
    cta: "Get Business Plan",
    href: "/register?plan=pro",
    popular: true
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 scroll-mt-28 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollAnimation className="text-center mb-20">
          <p className="font-heading uppercase tracking-[0.2em] text-xs text-primary mb-4 font-medium">
            Pricing
          </p>
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground leading-[1.1] tracking-tight">
            Pick the plan that{" "}
            <TextHighlight color="green" className="px-3 py-1 -rotate-2">
              suits you best
            </TextHighlight>
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Choose the path that aligns with your unique business goals backed by transparent, 
            honest pricing and the reliable support you need to scale with confidence.
          </p>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <ScrollAnimation
              key={index}
              delay={index * 0.1}
              className={cn(
                "relative p-8 md:p-10 rounded-3xl transition-all duration-300 group flex flex-col h-full border",
                plan.popular
                  ? "bg-white border-primary shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] ring-4 ring-primary/5 scale-100 md:scale-105 z-10"
                  : "bg-white/50 border-border/60 hover:border-primary/20 hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                   <div className="bg-primary text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 ring-4 ring-white">
                      <Star className="h-3 w-3 fill-current mb-0.5" /> Best Value
                   </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-heading font-medium mb-2 text-foreground">
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm font-sans font-medium text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="h-px w-full bg-border/60 mb-8" />

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5",
                      plan.popular ? "bg-primary text-white" : "bg-primary/10 text-primary"
                    )}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-sm font-sans text-foreground/80 leading-tight">
                      {feature}
                    </span>
                    </li>
                ))}
              </ul>

              <Link href={plan.href} target="_blank" rel="noopener noreferrer" className="mt-auto">
                <Button 
                    className={cn(
                        "w-full h-12 rounded-xl text-sm font-medium transition-all shadow-none",
                        plan.popular 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5" 
                            : "bg-secondary text-foreground hover:bg-secondary/80 border border-transparent hover:border-primary/10"
                    )}
                >
                    {plan.cta}
                    {plan.popular && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
