"use client"

import { Check, ArrowRight } from "lucide-react"
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
    variant: "outline"
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
    variant: "default",
    popular: true
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-8 md:py-12 scroll-mt-28 bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-20">
          <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-4 font-medium">
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-medium text-foreground leading-[1.1] tracking-tight">
            Pick the plan that{" "}
            <TextHighlight color="green" className="px-3 py-1 -rotate-2">
              suits you best
            </TextHighlight>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Choose the path that aligns with your unique business goals backed by transparent, 
            honest pricing and the reliable support you need to scale with confidence.
          </p>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => (
            <ScrollAnimation
              key={index}
              delay={index * 0.1}
              className={cn(
                "relative p-8 md:p-10 transition-all duration-300 group flex flex-col h-full",
                plan.popular
                  ? "bg-primary text-primary-foreground shadow-2xl scale-100 md:scale-105 z-10 rounded-none border-2 border-dotted border-white/30"
                  : "bg-background border-2 border-dotted border-primary/20 shadow-lg rounded-none hover:shadow-xl hover:border-primary/40"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="bg-white text-primary px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider shadow-lg rounded-none flex items-center gap-1.5 border-2 border-dotted border-primary/20">
                      <span className="text-amber-500">★</span> Best Value
                   </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className={cn(
                    "text-xl font-heading font-medium mb-2",
                    plan.popular ? "text-primary-foreground" : "text-foreground"
                )}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className={cn(
                      "text-4xl md:text-5xl font-medium font-heading tracking-tight",
                      plan.popular ? "text-white" : "text-foreground"
                  )}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={cn(
                        "text-lg font-sans font-medium",
                        plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className={cn(
                    "text-base font-sans font-normal leading-relaxed",
                    plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"
                )}>
                  {plan.description}
                </p>
              </div>

              <div className={cn("h-px w-full mb-8", plan.popular ? "bg-white/10" : "bg-border/60")} />

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                    <div className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full shrink-0",
                      plan.popular ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                    )}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className={cn(
                      "text-sm font-sans font-medium",
                      plan.popular ? "text-white/90" : "text-foreground/80"
                    )}>
                      {feature}
                    </span>
                    </li>
                ))}
              </ul>

              <Link href={plan.href} target="_blank" rel="noopener noreferrer" className="mt-auto">
                <Button 
                    className={cn(
                        "w-full h-12 rounded-xl text-base font-medium transition-all",
                        plan.popular 
                            ? "bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl hover:scale-[1.02]" 
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg"
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
