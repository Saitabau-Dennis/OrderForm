"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Store, ShoppingBag, Share2, MessageCircle } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: Store,
    title: "Create Your Store",
    description: "Sign up in seconds and set up your store details. Choose a theme that matches your brand and configure your currency and delivery zones.",
    color: "bg-primary/5 text-primary border-primary/10",
  },
  {
    icon: ShoppingBag,
    title: "Add Products",
    description: "Upload your product photos, descriptions, and prices. Organize them into categories to make shopping easy for your customers.",
    color: "bg-primary/5 text-primary border-primary/10",
  },
  {
    icon: Share2,
    title: "Share Your Link",
    description: "Get your unique store link (orderform.store/yourname) and paste it in your Instagram bio, TikTok, or send it directly to customers.",
    color: "bg-primary/5 text-primary border-primary/10",
  },
  {
    icon: MessageCircle,
    title: "Receive WhatsApp Orders",
    description: "Customers browse your store, build a cart, and hit 'Send Order'. You receive a perfectly formatted message on WhatsApp with all the details.",
    color: "bg-primary/5 text-primary border-primary/10",
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-8 md:py-12 bg-background relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Content */}
          <div className="lg:sticky lg:top-32 self-start space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-4 font-medium">
                How It Works
              </p>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight font-heading leading-[1.1]">
                From link to <br/>
                <span className="text-primary">order in seconds.</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0 font-sans">
                Stop going back and forth in DMs. Give your customers a professional shopping experience without the complexity of a full website.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all font-sans w-full sm:w-auto">
                  Start Selling Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="hidden lg:block absolute -left-12 top-2/3 -z-10 opacity-10">
               <Store className="w-64 h-64 rotate-12" />
            </div>
          </div>

          {/* Right Column - Cards */}
          <div className="relative space-y-0 min-h-[100vh]">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="sticky transition-all duration-500 mb-[15vh]"
                style={{ 
                  top: `calc(100px + ${index * 12}px)`, // Tighter stacking offset
                  zIndex: index + 1
                }}
              >
                <Card className={cn(
                  "overflow-hidden border border-border/80 shadow-2xl transition-all hover:scale-[1.02] font-sans", 
                  "bg-background"
                )}>
                  <CardHeader className="pb-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 border", step.color)}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-medium font-heading">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground font-sans">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Decorative number */}
                  <div className="absolute top-4 right-6 text-7xl md:text-9xl font-medium opacity-5 select-none font-heading">
                    {index + 1}
                  </div>
                </Card>
              </div>
            ))}
            
            <div className="h-[20vh]" /> 
          </div>

        </div>
      </div>
    </section>
  )
}