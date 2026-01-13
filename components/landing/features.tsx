
"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MessageCircle, LucideIcon, Box, Truck, MousePointerClick } from 'lucide-react'
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
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={MessageCircle}
                                title="Direct WhatsApp Checkout"
                                description="Bypass complex carts. Orders land directly in your WhatsApp chat."
                            />
                        </CardHeader>

                        <div className="mb-6 border-t border-dashed sm:mb-0 border-border pt-6">
                            <div className="aspect-76/59">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="WhatsApp Checkout"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Box}
                                title="Real-Time Inventory"
                                description="Mark items unavailable instantly. No more 'Sorry, sold out' texts."
                            />
                        </CardHeader>

                        <div className="mb-6 border-t border-dashed sm:mb-0 border-border pt-6">
                            <div className="aspect-76/59">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="Inventory Management"
                                    width={1207}
                                    height={929}
                                    className="object-contain h-full w-full opacity-90"
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Truck}
                                title="Auto-Calculated Delivery"
                                description="Customers pick their zone, and the correct delivery fee is automatically added."
                            />
                        </CardHeader>

                        <div className="mb-6 border-t border-dashed sm:mb-0 border-border pt-6">
                            <div className="aspect-76/59">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="Delivery Zones"
                                    width={1207}
                                    height={929}
                                    className="object-contain h-full w-full opacity-90"
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={MousePointerClick}
                                title="No Accounts Required"
                                description="Remove barriers. Customers just click and order without needing passwords or apps."
                            />
                        </CardHeader>

                        <div className="mb-6 border-t border-dashed sm:mb-0 border-border pt-6">
                            <div className="aspect-76/59">
                                <DualModeImage
                                    src="/images/dashboard.png"
                                    alt="Fast Checkout"
                                    width={1207}
                                    height={929}
                                    className="object-contain h-full w-full opacity-90"
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-xl font-medium font-heading">
                            Smart analytics to track your store's performance.
                        </p>

                        <div className="flex justify-center gap-6 overflow-hidden py-8">
                            <CircularUI
                                label="Visits"
                                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                            />

                            <CircularUI
                                label="Orders"
                                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                            />

                            <CircularUI
                                label="Revenue"
                                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                            />

                            <CircularUI
                                label="Growth"
                                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                className="hidden sm:block"
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
    <div className={cn('group relative shadow-sm border border-border bg-background overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1', className)}>
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
        className={cn('block w-full h-full object-contain object-top', className)}
        alt={alt}
        width={width}
        height={height}
    />
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-linear-to-b from-border size-fit rounded-2xl to-transparent p-px">
            <div className="bg-linear-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-primary': circle.pattern === 'none',
                            'border-primary bg-[repeating-linear-gradient(-45deg,hsl(var(--border)),hsl(var(--border))_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-primary bg-background bg-[repeating-linear-gradient(-45deg,hsl(var(--primary)),hsl(var(--primary))_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-background z-1 border-primary bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-1.5 block text-center text-sm font-sans">{label}</span>
    </div>
)
