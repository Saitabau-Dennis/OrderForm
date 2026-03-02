"use client"

import {
  Upload,
  ShoppingBag,
  ShoppingCart,
  TicketPercent,
  Zap,
} from "lucide-react"

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"

const backgroundLayer = () => (
  <>
    <div
      aria-hidden="true"
      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
    />
    <div
      aria-hidden="true"
      className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-transparent blur-3xl transition-transform duration-500 group-hover:scale-110"
    />
  </>
)

const features = [
  {
    Icon: Zap,
    name: "One-Click Checkout",
    description:
      "Customers enter quick checkout details, then one tap opens WhatsApp with a complete order summary ready to send.",
    href: "/register",
    cta: "Start now",
    background: backgroundLayer(),
    className: "sm:col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: ShoppingBag,
    name: "Browse Products",
    description:
      "A clean mobile-first catalog where customers can explore products, open details, and select options like size or color.",
    href: "/register",
    cta: "Explore stores",
    background: backgroundLayer(),
    className: "sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: ShoppingCart,
    name: "Review Cart",
    description:
      "A transparent cart flow where buyers adjust quantities, apply discount codes, and confirm totals before placing an order.",
    href: "/register",
    cta: "See checkout",
    background: backgroundLayer(),
    className: "sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Upload,
    name: "Share & Review",
    description:
      "Shoppers can upload purchase photos and reviews tied to their order reference so you can collect authentic social proof.",
    href: "/register",
    cta: "Build trust",
    background: backgroundLayer(),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: TicketPercent,
    name: "Reward Discounts",
    description:
      "Approve a review and generate a one-time discount code tied to the customer phone number to encourage repeat orders.",
    href: "/register",
    cta: "Boost repeat sales",
    background: backgroundLayer(),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
  },
]

function MiniStoreBento() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  )
}

export { MiniStoreBento }
