"use client"

import Image from "next/image"
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { ScrollAnimation } from '@/components/ui/scroll-animation'

type FeatureItem = {
    title: string
    description: string
    src: string
    alt: string
    width: number
    height: number
    cardClassName: string
    imageClassName?: string
}

const featureItems: FeatureItem[] = [
    {
        title: "Bio Link Storefront",
        description:
            "Create one branded store link for Instagram, TikTok, and WhatsApp. Customers can browse products instantly instead of requesting prices in DMs.",
        src: "/images/dashboard-v2.png",
        alt: "Bio link storefront preview",
        width: 1207,
        height: 929,
        cardClassName: "border-b lg:border-r border-border/60",
    },
    {
        title: "Catalog and Variants",
        description:
            "Manage products from one dashboard with photos, pricing, categories, and options like size or color so customers can order the right item confidently.",
        src: "/images/dashboard-v2.png",
        alt: "Catalog management dashboard",
        width: 1207,
        height: 929,
        cardClassName: "border-b border-border/60",
    },
    {
        title: "Cart to WhatsApp Checkout",
        description:
            "Customers build a cart, enter delivery details, and send a structured order to WhatsApp in one step with items, quantities, variants, notes, and totals.",
        src: "/images/dashboard-v2.png",
        alt: "Cart and WhatsApp checkout flow",
        width: 1207,
        height: 929,
        cardClassName: "border-b lg:border-b-0 lg:border-r border-border/60",
    },
    {
        title: "Orders and Customers",
        description:
            "Track order status, open detailed order views, and keep customer history in one place so your operations stay organized as order volume grows.",
        src: "/images/dashboard-v2.png",
        alt: "Order and customer dashboard",
        width: 1207,
        height: 929,
        cardClassName: "border-b lg:border-b-0 border-border/60",
    },
    {
        title: "Photo Reviews and Rewards",
        description:
            "Collect customer purchase photos and reviews, approve submissions, then generate one-time discount codes to drive repeat purchases.",
        src: "/images/dashboard-v2.png",
        alt: "Customer reviews and loyalty rewards",
        width: 1207,
        height: 929,
        cardClassName: "lg:col-span-2 border-t border-border/60",
    },
]

export function Features() {
    return (
        <section id="features" className="bg-background py-10 md:py-14 scroll-mt-28">
            <div className="mx-auto max-w-7xl px-6">
                <ScrollAnimation variant="fade-up">
                    <div className="mb-10 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-none landing-section-tag text-primary text-[10px] font-medium mb-4 uppercase tracking-[0.12em]">
               Features
              </div>
                    <h2 className="text-2xl md:text-4xl font-heading font-normal text-foreground leading-[1.06] tracking-[-0.02em] mb-4">
                        Everything you need <br className="hidden md:block" />
                        to <span className="text-primary">run your store.</span>
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed">
                        From storefront setup to checkout, order management, and repeat-purchase tools, OrderForm gives social sellers one streamlined workflow.
                    </p>
                </div>

                <div className="mx-auto border-4 border-dotted border-primary/20 overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                        {featureItems.map((item) => (
                            <FeatureCard key={item.title} className={item.cardClassName}>
                                <CardHeading
                                    title={item.title}
                                    description={item.description}
                                />

                                <div className="mt-auto px-4 pb-4 pt-2 md:px-5 md:pb-5 md:pt-3">
                                    <DualModeImage
                                        src={item.src}
                                        alt={item.alt}
                                        width={item.width}
                                        height={item.height}
                                        className={item.imageClassName}
                                    />
                                </div>
                            </FeatureCard>
                        ))}
                    </div>
                </div>
                </ScrollAnimation>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <div className={cn('relative bg-background overflow-hidden flex flex-col h-full', className)}>
        {children}
    </div>
)

interface CardHeadingProps {
    title: string
    description: string
}

const CardHeading = ({ title, description }: CardHeadingProps) => (
    <div className="relative z-10 p-4 pb-1 md:p-5 md:pb-2">
        <h3 className="font-heading font-normal text-base md:text-lg leading-snug text-foreground mb-2">
            <span className="text-primary">{title.split(" ")[0]}</span>{" "}
            {title.split(" ").slice(1).join(" ")}
        </h3>
        <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed">{description}</p>
    </div>
)

interface DualModeImageProps {
    src: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ src, alt, width, height, className }: DualModeImageProps) => (
    <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
            "block h-auto w-full rounded-lg border border-border/60 bg-background",
            className
        )}
    />
)
