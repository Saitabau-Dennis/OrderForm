
"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Link2, LucideIcon, LayoutGrid, ShoppingCart, UserX, Camera } from 'lucide-react'
import { ReactNode } from 'react'

export function Features() {
    return (
        <section id="features" className="bg-background py-12 md:py-20 scroll-mt-28">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-4">
                        Features
                    </p>
                    <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground leading-[1.1]">
                        Everything you need
                    </h2>
                </div>

                <div className="mx-auto grid gap-4 lg:grid-cols-2">
                    <FeatureCard>
                        <CardHeader className="pb-3 flex-1">
                            <CardHeading
                                icon={Link2}
                                title="Store link for your bio"
                                description="Create one simple link to place in your social media bio. Customers click it to view all your products in one place."
                            />
                        </CardHeader>

                        <div className="border-t border-dashed border-border pt-6">
                            <DualModeImage
                                src="/images/dashboard.png"
                                alt="Store link for your bio"
                                width={1207}
                                height={929}
                                className="w-full h-auto"
                            />
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3 flex-1">
                            <CardHeading
                                icon={LayoutGrid}
                                title="Product catalog"
                                description="Add products with photos, prices, and optional options like size or color. Update your products anytime."
                            />
                        </CardHeader>

                        <div className="border-t border-dashed border-border pt-6">
                            <DualModeImage
                                src="/images/dashboard.png"
                                alt="Inventory Management"
                                width={1207}
                                height={929}
                                className="w-full h-auto opacity-90"
                            />
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3 flex-1">
                            <CardHeading
                                icon={ShoppingCart}
                                title="Cart & WhatsApp checkout"
                                description="Customers add items to a cart and checkout via WhatsApp. A pre-filled message with the full order details is generated and sent to your WhatsApp."
                            />
                        </CardHeader>

                        <div className="border-t border-dashed border-border pt-6">
                            <DualModeImage
                                src="/images/dashboard.png"
                                alt="Delivery Zones"
                                width={1207}
                                height={929}
                                className="w-full h-auto opacity-90"
                            />
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3 flex-1">
                            <CardHeading
                                icon={UserX}
                                title="No accounts or apps"
                                description="Customers don’t need to sign up or install anything. Everything works instantly in the browser and on WhatsApp."
                            />
                        </CardHeader>

                        <div className="border-t border-dashed border-border pt-6">
                            <DualModeImage
                                src="/images/dashboard.png"
                                alt="No accounts or apps"
                                width={1207}
                                height={929}
                                className="w-full h-auto opacity-90"
                            />
                        </div>
                    </FeatureCard>

                    <FeatureCard className="lg:col-span-2">
                        <CardHeader className="pb-3 flex-1">
                            <CardHeading
                                icon={Camera}
                                title="Customer photos & discounts"
                                description="Customers can upload photos using your products. Once approved, they receive a discount code for their next order."
                            />
                        </CardHeader>

                        <div className="border-t border-dashed border-border pt-6">
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
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <div className={cn('group relative shadow-sm border border-border bg-background overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full', className)}>
        {/* <CardDecorator /> Removed decorators for cleaner look */}
        {children}
    </div>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <div className="flex items-center gap-3 text-foreground mb-4">
             <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
                 <Icon className="size-5" />
             </div>
             <span className="font-heading font-medium text-lg">{title}</span>
        </div>
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
    <img
        src={src}
        className={cn('block w-full h-full object-contain object-bottom', className)}
        alt={alt}
        width={width}
        height={height}
    />
)


