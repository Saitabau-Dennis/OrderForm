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
        title: "Store link for your bio",
        description:
            "Ditch the messy DMs. Create one professional, shareable link that showcases your entire catalog. It’s perfect for Instagram, TikTok, and WhatsApp bios, giving your customers a seamless way to browse and shop 24/7.",
        src: "/images/dashboard-v2.png",
        alt: "Store link for your bio",
        width: 1207,
        height: 929,
        cardClassName: "border-b lg:border-r border-border/60",
    },
    {
        title: "Product catalog management",
        description:
            "Effortlessly organize your inventory. Add high-quality photos, set clear prices, manage stock levels, and offer product variations like size or color. Update everything instantly from your dashboard.",
        src: "/images/dashboard-v2.png",
        alt: "Inventory Management",
        width: 1207,
        height: 929,
        cardClassName: "border-b border-border/60",
    },
    {
        title: "Cart & WhatsApp checkout",
        description:
            "Streamline the buying process. Customers build a cart with their favorite items and checkout instantly. OrderForm generates a structured WhatsApp message with all order details, ready for them to send to you.",
        src: "/images/dashboard-v2.png",
        alt: "Cart and WhatsApp checkout",
        width: 1207,
        height: 929,
        cardClassName: "border-b lg:border-b-0 lg:border-r border-border/60",
    },
    {
        title: "No accounts or apps",
        description:
            "Remove friction from sales. Your customers don’t need to download another app or remember another password. The entire shopping experience happens directly in their browser and ends in the chat app they already use.",
        src: "/images/dashboard-v2.png",
        alt: "No accounts or apps",
        width: 1207,
        height: 929,
        cardClassName: "border-b lg:border-b-0 border-border/60",
    },
    {
        title: "Customer engagement & loyalty",
        description:
            "Turn one-time buyers into repeat customers. Allow satisfied shoppers to upload photos of their purchases. Approve their posts to build social proof and automatically reward them with discount codes for their next order.",
        src: "/images/dashboard-v2.png",
        alt: "Customer photos and discounts",
        width: 1207,
        height: 929,
        cardClassName: "lg:col-span-2 border-t border-border/60",
    },
]

export function Features() {
    return (
        <section id="features" className="bg-background pt-8 md:pt-12 pb-8 md:pb-12 scroll-mt-28">
            <div className="mx-auto max-w-7xl px-6">
                <ScrollAnimation variant="fade-up">
                    <div className="mb-16 text-center max-w-3xl mx-auto">
                    <p className="font-heading uppercase tracking-[0.16em] text-xs text-primary mb-4 font-semibold">
                        Features
                    </p>
                    <h2 className="text-3xl md:text-5xl font-heading font-semibold text-foreground leading-[1.06] tracking-[-0.02em] mb-6">
                        Everything you need <br className="hidden md:block" />
                        to <span className="text-primary">run your store.</span>
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
                        OrderForm packs powerful e-commerce tools into a simple interface. From inventory management to automated customer updates, we handle the heavy lifting so you can focus on fulfilling orders.
                    </p>
                </div>

                <div className="mx-auto border-2 border-dotted border-primary/20 overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                        {featureItems.map((item) => (
                            <FeatureCard key={item.title} className={item.cardClassName}>
                                <CardHeading
                                    title={item.title}
                                    description={item.description}
                                />

                                <div className="px-5 pb-5 pt-3 md:px-6 md:pb-6 md:pt-4">
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
    <div className="relative z-10 p-5 pb-1 md:p-6 md:pb-2">
        <h3 className="font-heading font-semibold text-lg md:text-xl leading-snug text-foreground mb-3">
            <span className="text-primary">{title.split(" ")[0]}</span>{" "}
            {title.split(" ").slice(1).join(" ")}
        </h3>
        <p className="text-base text-muted-foreground font-sans leading-relaxed">{description}</p>
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
            "block h-auto w-full rounded-lg border border-border/60 bg-background shadow-[0_10px_24px_rgba(0,0,0,0.08)]",
            className
        )}
    />
)
