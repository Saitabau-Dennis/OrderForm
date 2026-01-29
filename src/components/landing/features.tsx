"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Link2, LucideIcon, LayoutGrid, ShoppingCart, UserX, Camera } from 'lucide-react'
import { ReactNode } from 'react'

export function Features() {
    return (
        <section id="features" className="bg-background pt-8 md:pt-12 pb-8 md:pb-12 scroll-mt-28">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <p className="font-heading uppercase tracking-[0.2em] text-xs text-primary mb-4 font-medium">
                        Features
                    </p>
                    <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground leading-[1.1] tracking-tight mb-6">
                        Everything you need <br className="hidden md:block" />
                        to <span className="text-primary">run your store.</span>
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
                        OrderForm packs powerful e-commerce tools into a simple interface. From inventory management to automated customer updates, we handle the heavy lifting so you can focus on fulfilling orders.
                    </p>
                </div>

                <div className="mx-auto border-2 border-dotted border-primary/20 overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                        <FeatureCard className="border-b lg:border-r border-border/60">
                            <CardHeader className="pb-3 flex-1">
                                <CardHeading
                                    title="Store link for your bio"
                                    description="Ditch the messy DMs. Create one professional, shareable link that showcases your entire catalog. It’s perfect for Instagram, TikTok, and WhatsApp bios, giving your customers a seamless way to browse and shop 24/7."
                                />
                            </CardHeader>

                            <div className="pt-6 px-6 pb-6">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="Store link for your bio"
                                    width={1207}
                                    height={929}
                                    className="w-full h-auto"
                                />
                            </div>
                        </FeatureCard>

                        <FeatureCard className="border-b border-border/60">
                            <CardHeader className="pb-3 flex-1">
                                <CardHeading
                                    title="Product catalog management"
                                    description="Effortlessly organize your inventory. Add high-quality photos, set clear prices, manage stock levels, and offer product variations like size or color. Update everything instantly from your dashboard."
                                />
                            </CardHeader>

                            <div className="pt-6 px-6 pb-6">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="Inventory Management"
                                    width={1207}
                                    height={929}
                                    className="w-full h-auto opacity-90"
                                />
                            </div>
                        </FeatureCard>

                        <FeatureCard className="border-b lg:border-b-0 lg:border-r border-border/60">
                            <CardHeader className="pb-3 flex-1">
                                <CardHeading
                                    title="Cart & WhatsApp checkout"
                                    description="Streamline the buying process. Customers build a cart with their favorite items and checkout instantly. OrderForm generates a structured WhatsApp message with all order details, ready for them to send to you."
                                />
                            </CardHeader>

                            <div className="pt-6 px-6 pb-6">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="Delivery Zones"
                                    width={1207}
                                    height={929}
                                    className="w-full h-auto opacity-90"
                                />
                            </div>
                        </FeatureCard>

                        <FeatureCard className="border-b lg:border-b-0 border-border/60">
                            <CardHeader className="pb-3 flex-1">
                                <CardHeading
                                    title="No accounts or apps"
                                    description="Remove friction from sales. Your customers don’t need to download another app or remember another password. The entire shopping experience happens directly in their browser and ends in the chat app they already use."
                                />
                            </CardHeader>

                            <div className="pt-6 px-6 pb-6">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="No accounts or apps"
                                    width={1207}
                                    height={929}
                                    className="w-full h-auto opacity-90"
                                />
                            </div>
                        </FeatureCard>

                        <FeatureCard className="lg:col-span-2 border-t border-border/60">
                            <CardHeader className="pb-3 flex-1">
                                <CardHeading
                                    title="Customer engagement & loyalty"
                                    description="Turn one-time buyers into repeat customers. Allow satisfied shoppers to upload photos of their purchases. Approve their posts to build social proof and automatically reward them with discount codes for their next order."
                                />
                            </CardHeader>

                            <div className="pt-6 px-6 pb-6">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="Customer photos and discounts"
                                    width={1207}
                                    height={929}
                                    className="w-full h-auto opacity-90"
                                />
                            </div>
                        </FeatureCard>
                    </div>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <div className={cn('group relative bg-background overflow-hidden flex flex-col h-full', className)}>
        {children}
    </div>
)

interface CardHeadingProps {
    title: string
    description: string
}

const CardHeading = ({ title, description }: CardHeadingProps) => (
    <div className="p-6">
        <h3 className="font-heading font-medium text-lg md:text-xl text-foreground mb-4">
            {title.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? "text-primary" : ""}>{word}{' '}</span>
            ))}
        </h3>
        <p className="text-sm text-muted-foreground font-sans leading-relaxed">{description}</p>
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
    <div className="relative group/img overflow-hidden rounded-xl">
        <img
            src={src}
            className={cn('block w-full h-full object-contain object-bottom', className)}
            alt={alt}
            width={width}
            height={height}
        />
        {/* Bottom Fade/Blur Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background to-transparent pointer-events-none" />
    </div>
)