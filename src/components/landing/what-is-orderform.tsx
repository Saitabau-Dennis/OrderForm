"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { Store, MessageCircle } from "lucide-react"

export function WhatIsOrderform() {
  return (
    <section className="py-12 md:pt-20 md:pb-12 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <ScrollAnimation variant="fade-up">
             <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-6 font-medium">
                What is OrderForm?
              </p>
            <h2 className="text-3xl md:text-5xl font-heading font-medium text-foreground mb-8 leading-[1.1] tracking-tight">
              The missing bridge between <br className="hidden md:block" />
              <span className="text-muted-foreground">social traffic</span> and <span className="text-primary">paid orders.</span>
            </h2>
          </ScrollAnimation>
        </div>

        {/* The Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            
            {/* Left Card: The Storefront */}
            <ScrollAnimation delay={0.1} className="relative group">
                <div className="h-full bg-secondary/30 border border-border hover:border-primary/20 transition-all rounded-[2rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden hover:shadow-lg">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 border border-border/50">
                        <Store className="w-8 h-8 text-foreground" />
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-heading font-medium mb-4 text-foreground">A Professional Storefront</h3>
                        <p className="text-muted-foreground font-sans text-lg leading-relaxed">
                            Turn that single bio link into a beautiful, searchable catalog. No more "DM for price" or scrolling through months of posts to find a product.
                        </p>
                    </div>

                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/60 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                </div>
            </ScrollAnimation>

            {/* Right Card: The Checkout */}
            <ScrollAnimation delay={0.2} className="relative group">
                <div className="h-full bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden shadow-xl ring-1 ring-primary/10">
                     {/* Icon */}
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-heading font-medium mb-4 text-white">Instant WhatsApp Checkout</h3>
                        <p className="text-primary-foreground/90 font-sans text-lg leading-relaxed">
                             Skip the back-and-forth. Customers build a cart and send you a pre-filled WhatsApp message with their exact order details, ready for payment.
                        </p>
                    </div>

                     {/* Decorative Elements */}
                     <div className="absolute bottom-0 right-0 p-8 opacity-10 transform translate-x-4 translate-y-4">
                        <MessageCircle className="w-48 h-48" />
                     </div>
                </div>
            </ScrollAnimation>

        </div>
      </div>
    </section>
  )
}

