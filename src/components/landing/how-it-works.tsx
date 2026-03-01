"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Store, ShoppingBag, Share2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

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
          <ScrollAnimation variant="fade-up" className="lg:sticky lg:top-32 self-start space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 text-primary text-xs font-medium mb-4 uppercase tracking-[0.16em]">
                How It Works
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] font-heading leading-[1.06]">
                From link to <br/>
                <span className="text-primary">order in seconds.</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0 font-sans">
                Stop going back and forth in DMs. Give your customers a professional shopping experience without the complexity of a full website.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 text-base font-semibold">
                  <Link href="/register">
                  Start Selling Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
            </div>

            {/* Decorative elements */}
            <div className="hidden lg:block absolute -left-12 top-2/3 -z-10 opacity-10">
               <Store className="w-64 h-64 rotate-12" />
            </div>
          </ScrollAnimation>

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
                  "overflow-hidden border border-primary/10 bg-card shadow-sm transition-all hover:scale-[1.02] font-sans p-6 md:p-8 rounded-xl", 
                )}>
                  <CardHeader className="p-0 pb-4">
                    <step.icon className="w-14 h-14 text-primary mb-5 stroke-[1.25]" />
                    <CardTitle className="text-xl md:text-2xl font-semibold font-heading tracking-[-0.01em] text-foreground">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription className="text-base md:text-lg leading-relaxed text-muted-foreground font-sans">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Decorative number */}
                  <div className="absolute top-4 right-6 text-7xl md:text-9xl font-semibold opacity-5 select-none font-heading">
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
