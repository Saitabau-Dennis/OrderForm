"use client"

import Link from "next/link"
import { Check, Sparkles, Star } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { cn } from "@/lib/utils"

type PlanKey = "starter" | "business"

type Plan = {
  key: PlanKey
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  href: string
  popular: boolean
}

type ComparisonValue = string | boolean | null

type ComparisonRow = {
  label: string
  values: Record<PlanKey, ComparisonValue>
}

type ComparisonSection = {
  title: string
  icon: LucideIcon
  rows: ComparisonRow[]
}

const plans: Plan[] = [
  {
    key: "starter",
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
      "Standard Support",
    ],
    cta: "Start for free",
    href: "/register",
    popular: false,
  },
  {
    key: "business",
    name: "Business",
    price: "KES 1547",
    period: "/ month",
    description: "For growing businesses ready to scale with no limits.",
    features: [
      "Everything in Starter",
      "Unlimited Products",
      "Customer Photo Uploads",
      "Discount Codes",
      "Priority Support",
      "Advanced Analytics",
      "Custom Domain (Coming Soon)",
    ],
    cta: "Get Business Plan",
    href: "/register?plan=pro",
    popular: true,
  },
]

const planByKey = Object.fromEntries(plans.map((plan) => [plan.key, plan])) as Record<PlanKey, Plan>
const starterFeatureSet = new Set(planByKey.starter.features)

const allFeatures = Array.from(new Set(plans.flatMap((plan) => plan.features)))

function hasFeature(plan: Plan, feature: string): boolean {
  if (plan.features.includes(feature)) {
    return true
  }

  const includesStarterBundle =
    plan.key === "business" && plan.features.includes("Everything in Starter")

  if (includesStarterBundle && starterFeatureSet.has(feature)) {
    return true
  }

  return false
}

const comparisonSections: ComparisonSection[] = [
  {
    title: "Plan details",
    icon: Star,
    rows: [
      {
        label: "Price",
        values: {
          starter: `${planByKey.starter.price} ${planByKey.starter.period}`,
          business: `${planByKey.business.price} ${planByKey.business.period}`,
        },
      },
      {
        label: "Description",
        values: {
          starter: planByKey.starter.description,
          business: planByKey.business.description,
        },
      },
    ],
  },
  {
    title: "Included features",
    icon: Sparkles,
    rows: allFeatures.map((feature) => ({
      label: feature,
      values: {
        starter: hasFeature(planByKey.starter, feature),
        business: hasFeature(planByKey.business, feature),
      },
    })),
  },
]

function renderValue(value: ComparisonValue) {
  if (value === true) {
    return <Check className="h-4 w-4 text-primary stroke-[2.75]" />
  }

  if (value === false || value === null) {
    return <span className="text-muted-foreground/45">-</span>
  }

  return <span>{value}</span>
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 md:py-28 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <ScrollAnimation className="mx-auto mb-10 max-w-3xl text-center md:mb-14" variant="fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Pricing
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-semibold leading-[1.06] tracking-[-0.02em] text-foreground">
            Start free, upgrade as you grow
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Transparent pricing with no hidden fees. We only grow when you grow.
          </p>
        </ScrollAnimation>

        <ScrollAnimation variant="fade-up" delay={0.1}>
          <div className="mx-auto max-w-5xl overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid [grid-template-columns:minmax(260px,1.6fr)_minmax(170px,1fr)_minmax(170px,1fr)] items-end gap-x-8 border-b border-black/10 pb-6">
                <div className="pr-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Plan comparison
                  </p>
                </div>

                {plans.map((plan) => (
                  <div key={plan.key} className="space-y-3 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{plan.name}</p>
                      {plan.popular && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                          Popular
                        </span>
                      )}
                    </div>
                    <Link href={plan.href}>
                      <Button
                        variant={plan.popular ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-9 rounded-full px-4 text-sm font-semibold",
                          !plan.popular && "bg-background"
                        )}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>

              {comparisonSections.map((section) => {
                const SectionIcon = section.icon

                return (
                  <div key={section.title} className="pt-5">
                    <div className="grid [grid-template-columns:minmax(260px,1.6fr)_minmax(170px,1fr)_minmax(170px,1fr)] items-center gap-x-8 py-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <SectionIcon className="h-4 w-4" />
                        <span>{section.title}</span>
                      </div>
                      <div />
                      <div />
                    </div>

                    {section.rows.map((row) => (
                      <div
                        key={`${section.title}-${row.label}`}
                        className="grid [grid-template-columns:minmax(260px,1.6fr)_minmax(170px,1fr)_minmax(170px,1fr)] items-center gap-x-8 border-b border-black/8 py-4"
                      >
                        <div className="pr-4 text-[15px] text-muted-foreground">{row.label}</div>
                        {plans.map((plan) => (
                          <div key={`${row.label}-${plan.key}`} className="text-[15px] text-foreground">
                            {renderValue(row.values[plan.key])}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )
              })}

              {/* <div className="mt-5 grid [grid-template-columns:minmax(260px,1.6fr)_minmax(170px,1fr)_minmax(170px,1fr)] gap-x-8 text-xs">
                <div />
                <p className="text-muted-foreground">No credit card required</p>
                <p className="font-medium text-primary/80">30-day money-back guarantee</p>
              </div> */}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
