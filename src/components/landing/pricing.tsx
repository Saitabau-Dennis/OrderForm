"use client"

import { Check, Sparkles, ArrowRight } from "lucide-react"
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
    description: "Perfect for testing the waters. Launch your store in minutes.",
    features: [
      "1 Storefront",
      "Up to 5 Products",
      "WhatsApp Checkout",
      "Unlimited Orders",
      "Basic Analytics",
      "Standard Support"
    ],
    cta: "Start for free",
    href: "/register",
    popular: false,
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    name: "Business",
    price: "KES 990",
    period: "/ month",
    description: "For growing businesses ready to scale with no limits.",
    features: [
      "Everything in Starter",
      "Unlimited Products",
      "Customer Photo Uploads",
      "Discount Codes",
      "Priority Support",
      "Advanced Analytics",
      "Custom Domain (Coming Soon)"
    ],
    cta: "Get Business Plan",
    href: "/register?plan=pro",
    popular: true,
    gradient: "from-primary/20 to-emerald-500/20"
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 scroll-mt-20 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollAnimation className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-primary/20 text-primary text-[10px] font-medium mb-6">
            <span className="tracking-wide uppercase">Simple Pricing</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground leading-[1.1] tracking-tight mb-6">
            Start free, upgrade as you{" "}
            <span className="relative inline-block">
              <span className="relative z-10">grow</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h2>

          <p className="text-2xl md:text-xl text-muted-foreground font-sans font-light max-w-2xl mx-auto leading-relaxed">
            Transparent pricing with no hidden fees. We only grow when you grow.
          </p>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
          {plans.map((plan, index) => (
            <ScrollAnimation
              key={index}
              delay={index * 0.1}
              className={cn(
                "relative group flex flex-col h-full rounded-[2rem] transition-all duration-500",
                plan.popular
                  ? "bg-white shadow-2xl shadow-primary/10 ring-1 ring-primary/20 z-10 md:-mt-8 md:mb-8"
                  : "bg-white/60 backdrop-blur-sm border border-stone-200/60 hover:border-stone-300 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                   <div className="bg-primary text-white px-5 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 flex items-center gap-2">
                      <Sparkles className="h-3 w-3 fill-current animate-pulse" /> Most Popular
                   </div>
                </div>
              )}

              <div className="p-8 md:p-10 flex flex-col h-full">
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-heading font-medium text-foreground">
                      {plan.name}
                    </h3>
                    {!plan.popular && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            <span className="text-xl">🌱</span>
                        </div>
                    )}
                    {plan.popular && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            <span className="text-xl">🚀</span>
                        </div>
                    )}
                  </div>

                  <p className="text-muted-foreground font-sans text-sm mb-6 min-h-[40px]">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-medium font-(family-name:--font-geist-sans) tracking-tight text-foreground">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm font-sans font-medium text-muted-foreground ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-200 to-transparent mb-6" />
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm md:text-base text-stone-600">
                        <div className={cn(
                            "mt-1 rounded-full p-0.5 shrink-0",
                            plan.popular ? "text-primary bg-primary/10" : "text-stone-400 bg-stone-100"
                        )}>
                            <Check className="h-3 w-3 md:h-3.5 md:w-3.5 stroke-[3]" />
                        </div>
                        <span className={cn(
                            feature.includes("Everything") ? "font-semibold text-foreground" : ""
                        )}>{feature}</span>
                        </div>
                    ))}
                </div>

                <Link href={plan.href} className="mt-auto block">
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    className={cn(
                        "w-full text-base font-semibold group-hover:scale-[1.02] transition-transform duration-300",
                        plan.popular ? "" : "bg-transparent border-stone-300 text-stone-700 hover:bg-stone-50"
                    )}
                  >
                    {plan.cta}
                    {plan.popular && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </Link>

                {!plan.popular && (
                    <p className="text-center text-xs text-muted-foreground mt-4">
                        No credit card required
                    </p>
                )}
                {plan.popular && (
                    <p className="text-center text-xs text-primary/80 mt-4 font-medium">
                        30-day money-back guarantee
                    </p>
                )}
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
