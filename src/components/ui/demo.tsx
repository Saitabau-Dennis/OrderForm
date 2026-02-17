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
      "Frictionless ordering. No forms to fill out. One tap generates a complete order summary and opens WhatsApp to send it directly to you.",
    href: "/register",
    cta: "Start now",
    background: backgroundLayer(),
    className: "sm:col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: ShoppingBag,
    name: "Browse Products",
    description:
      "A clean, mobile-first catalog. Customers can easily scroll through your items, view high-res photos, check prices, and select variants like size or color without any distractions.",
    href: "/register",
    cta: "Explore stores",
    background: backgroundLayer(),
    className: "sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: ShoppingCart,
    name: "Review Cart",
    description:
      "A transparent cart experience. Customers can double-check their selections, adjust quantities, and see their total cost instantly before they commit to buy.",
    href: "/register",
    cta: "See checkout",
    background: backgroundLayer(),
    className: "sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Upload,
    name: "Share & Earn",
    description:
      "Turn customers into advocates. Shoppers can upload photos of their purchase. Once you approve it, they get rewarded, and you get authentic social proof.",
    href: "/register",
    cta: "Build trust",
    background: backgroundLayer(),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: TicketPercent,
    name: "Redeem Discounts",
    description:
      "Drive repeat business. Approved photo uploads automatically send a unique discount code to the customer, incentivizing their next purchase.",
    href: "/register",
    cta: "Boost repeat sales",
    background: backgroundLayer(),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
  },
]

function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  )
}

export { BentoDemo }
