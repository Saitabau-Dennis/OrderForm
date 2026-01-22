"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ArrowRight, Instagram, Facebook, MessageCircle, Store } from "lucide-react"

export function AboutUs() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Centered Header for alignment with other sections */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <ScrollAnimation variant="fade-up">
            <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-6 font-medium">
              About Us
            </p>
            <h2 className="text-3xl md:text-5xl font-heading font-medium text-foreground mb-8 leading-[1.1] tracking-tight">
              Empowering social sellers to scale <span className="text-primary">without the chaos.</span>
            </h2>
          </ScrollAnimation>
        </div>

        {/* Two Column Content */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <ScrollAnimation>
            <p className="text-xl text-muted-foreground font-sans leading-relaxed mb-8">
              We’re on a mission to replace messy DM back-and-forths with a streamlined checkout. OrderForm gives solo entrepreneurs and small businesses a professional store link, automated order tracking, and a direct line to customers on WhatsApp.
            </p>
            <p className="text-lg text-muted-foreground font-sans leading-relaxed mb-10">
              By simplifying the bridge between social traffic and paid orders, we help you focus on what you do best: creating and selling great products, not managing spreadsheets and manual messages.
            </p>
            
            <Link href="/register" target="_blank" rel="noopener noreferrer">
              <Button className="h-12 px-8 rounded-full text-base font-medium group">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2} className="relative w-full flex justify-center">
             <div className="aspect-square w-full max-w-[500px] overflow-hidden relative flex items-center justify-center">
                
                {/* Connecting Lines SVG Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                            <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* --- MOBILE PATHS (Shorter) --- */}
                    <g className="md:hidden">
                        {/* Static */}
                        <path d="M 80 80 Q 120 120 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/20" vectorEffect="non-scaling-stroke" />
                        <path d="M 80 320 Q 120 280 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/20" vectorEffect="non-scaling-stroke" />
                        <path d="M 320 80 Q 280 120 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/20" vectorEffect="non-scaling-stroke" />
                        <path d="M 320 320 Q 280 280 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/20" vectorEffect="non-scaling-stroke" />
                        {/* Animated */}
                        <path d="M 80 80 Q 120 120 200 200" fill="none" stroke="#22C55E" strokeWidth="3" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 80 320 Q 120 280 200 200" fill="none" stroke="#22C55E" strokeWidth="3" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 320 80 Q 280 120 200 200" fill="none" stroke="#22C55E" strokeWidth="3" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 320 320 Q 280 280 200 200" fill="none" stroke="#22C55E" strokeWidth="3" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                    </g>

                    {/* --- DESKTOP PATHS (Longer) --- */}
                    <g className="hidden md:block">
                        {/* Static */}
                        <path d="M 50 30 Q 100 80 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/20" vectorEffect="non-scaling-stroke" />
                        <path d="M 30 350 Q 80 300 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/20" vectorEffect="non-scaling-stroke" />
                        <path d="M 370 50 Q 300 100 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/20" vectorEffect="non-scaling-stroke" />
                        <path d="M 330 370 Q 300 300 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/20" vectorEffect="non-scaling-stroke" />
                        {/* Animated */}
                        <path d="M 50 30 Q 100 80 200 200" fill="none" stroke="#22C55E" strokeWidth="3" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 30 350 Q 80 300 200 200" fill="none" stroke="#22C55E" strokeWidth="3" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 370 50 Q 300 100 200 200" fill="none" stroke="#22C55E" strokeWidth="3" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 330 370 Q 300 300 200 200" fill="none" stroke="#22C55E" strokeWidth="3" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                    </g>
                </svg>

                {/* Central Hub (OrderForm) */}
                <div className="relative z-10 w-20 h-20 md:w-28 md:h-28 bg-background rounded-none shadow-2xl border-4 border-primary/10 flex items-center justify-center animate-pulse-slow">
                     <Store className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>

                {/* Orbiting Social Icons - Responsive Positioning */}
                
                {/* Instagram: Mobile(20%, 20%) -> Desktop(12.5%, 7.5%) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[20%] top-[20%] md:left-[12.5%] md:top-[7.5%]">
                    <Instagram className="w-5 h-5 md:w-6 md:h-6 text-[#E1306C]" />
                </div>

                {/* Facebook: Mobile(20%, 80%) -> Desktop(7.5%, 87.5%) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[20%] top-[80%] md:left-[7.5%] md:top-[87.5%]">
                    <Facebook className="w-5 h-5 md:w-6 md:h-6 text-[#1877F2]" />
                </div>

                {/* Twitter: Mobile(80%, 20%) -> Desktop(92.5%, 12.5%) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[80%] top-[20%] md:left-[92.5%] md:top-[12.5%]">
                     <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-black" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </div>

                {/* TikTok: Mobile(80%, 80%) -> Desktop(82.5%, 92.5%) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[80%] top-[80%] md:left-[82.5%] md:top-[92.5%]">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-black fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </div>

                 {/* WhatsApp (Destination) - Smaller Button */}
                 <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-20 w-max">
                    <div className="bg-[#25D366] text-white px-4 py-2 rounded-none shadow-lg flex items-center gap-2 border border-white/10 relative overflow-hidden group">
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span className="font-bold text-xs md:text-sm uppercase tracking-tight">WhatsApp Orders</span>
                    </div>
                 </div>

             </div>
             {/* Decorative blob */}
             <div className="absolute -z-10 top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
