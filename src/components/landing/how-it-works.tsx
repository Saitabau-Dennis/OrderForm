"use client"

import { cn } from "@/lib/utils"
import { LandingButton } from "@/components/landing/landing-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Store, ShoppingBag, Share2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

const steps = [
  {
    icon: Store,
    title: "Set Up Your Store",
    description: "Create your store profile with logo, brand style, WhatsApp number, and delivery zones so you are ready to receive complete orders.",
    color: "bg-primary/5 text-primary border-primary/10",
  },
  {
    icon: ShoppingBag,
    title: "Add Products Fast",
    description: "Upload product photos, set prices, organize categories, and add variants so customers can quickly find and choose what they need.",
    color: "bg-primary/5 text-primary border-primary/10",
  },
  {
    icon: Share2,
    title: "Share Your Store Link",
    description: "Publish your unique OrderForm URL in your bio, stories, posts, or WhatsApp status and let customers shop directly from one link.",
    color: "bg-primary/5 text-primary border-primary/10",
  },
  {
    icon: MessageCircle,
    title: "Receive and Manage Orders",
    description: "Customers send structured WhatsApp orders from checkout, and you manage statuses, customer history, and sales performance from the dashboard.",
    color: "bg-primary/5 text-primary border-primary/10",
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-10 md:py-14 bg-background relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          
          {/* Left Column - Content */}
          <ScrollAnimation variant="fade-up" className="lg:sticky lg:top-28 self-start space-y-7 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center px-2 py-0.5 rounded-none landing-section-tag border border-primary/20 text-primary text-[10px] font-medium mb-4 uppercase tracking-[0.12em]">
                How It Works
              </div>
              <h2 className="text-3xl md:text-4xl font-normal tracking-[-0.02em] font-heading leading-[1.06]">
                From link to <br/>
                <span className="text-primary">order in seconds.</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0 font-sans">
                Turn social traffic into confirmed orders without building a full e-commerce site or handling every sale manually in DMs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <LandingButton asChild size="lg" className="w-full sm:w-auto rounded-xl px-6 text-sm md:text-base font-semibold">
                  <Link href="/register">
                  Start your store
                  <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </LandingButton>
            </div>

            {/* Decorative elements */}
            <div className="hidden lg:block absolute -left-12 top-2/3 -z-10 opacity-10">
               <Store className="w-64 h-64 rotate-12" />
            </div>
          </ScrollAnimation>

          {/* Right Column - Cards */}
          <div className="relative space-y-0 min-h-[90vh]">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="sticky transition-all duration-500 mb-[13vh]"
                style={{ 
                  top: `calc(100px + ${index * 12}px)`, // Tighter stacking offset
                  zIndex: index + 1
                }}
              >
                <Card className={cn(
                  "overflow-hidden border border-primary/10 bg-card shadow-sm transition-all hover:scale-[1.02] font-sans p-5 md:p-7 rounded-xl", 
                )}>
                  <CardHeader className="p-0 pb-4">
                    <step.icon className="w-12 h-12 md:w-14 md:h-14 text-primary mb-4 stroke-[1.25]" />
                    <CardTitle className="text-xl md:text-2xl font-normal font-heading tracking-[-0.01em] text-foreground">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription className="text-base md:text-lg leading-relaxed text-muted-foreground font-sans">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Decorative number */}
                  <div className="absolute top-4 right-6 text-7xl md:text-8xl font-semibold opacity-5 select-none font-heading">
                    {index + 1}
                  </div>
                </Card>
              </div>
            ))}
            
            <div className="h-[14vh]" /> 
          </div>

        </div>
      </div>
    </section>
  )
}
