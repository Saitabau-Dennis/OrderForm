"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ArrowRight, Instagram, Facebook, MessageCircle, Store, Youtube, Linkedin } from "lucide-react"

export function AboutUs() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start text-left">
             <ScrollAnimation variant="fade-up">
                <p className="font-heading uppercase tracking-[0.2em] text-xs text-primary mb-6 font-medium">
                  What is OrderForm?
                </p>
                
                <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground mb-6 leading-[1.1] tracking-tight">
                  Empowering social sellers to scale <span className="text-primary italic font-serif">without the chaos.</span>
                </h2>
                
                <div className="space-y-6 text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
                   <p>
                      We’re on a mission to replace messy DM back-and-forths with a streamlined checkout. OrderForm gives solo entrepreneurs and small businesses a professional store link, automated order tracking, and a direct line to customers on WhatsApp.
                   </p>
                   <p>
                      By simplifying the bridge between social traffic and paid orders, we help you focus on what you do best: creating and selling great products, not managing spreadsheets and manual messages.
                   </p>
                </div>

                <div className="mt-8">
                   <Link href="/register" target="_blank" rel="noopener noreferrer">
                      <Button className="h-11 px-7 rounded-full text-xs md:text-sm font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 group bg-primary text-primary-foreground">
                         Get Started
                         <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </Link>
                </div>
             </ScrollAnimation>
          </div>

          {/* Right Column: Visual Animation */}
          <ScrollAnimation delay={0.2} className="relative w-full flex justify-center lg:justify-end">
             <div className="aspect-square w-full max-w-[500px] relative flex items-center justify-center">
                
                {/* Connecting Lines SVG Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                    {/* Static Dashed Lines */}
                    <g className="text-primary/10">
                        <line x1="200" y1="200" x2="200" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="200" y1="200" x2="312" y2="88" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="200" y1="200" x2="360" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="200" y1="200" x2="312" y2="312" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="200" y1="200" x2="200" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="200" y1="200" x2="88" y2="312" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="200" y1="200" x2="40" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="200" y1="200" x2="88" y2="88" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    </g>

                    {/* Animated Shooting Stars - Straight Lines matching Static Lines */}
                    <g className="text-primary">
                        <path d="M 200 40 L 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 312 88 L 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 360 200 L 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 312 312 L 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 200 360 L 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 88 312 L 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 40 200 L 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                        <path d="M 88 88 L 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="animate-shooting-star" vectorEffect="non-scaling-stroke" />
                    </g>
                </svg>

                {/* Central Hub (WhatsApp) */}
                <div className="relative z-10 flex flex-col items-center gap-3 animate-pulse-slow">
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-primary/30 blur-2xl group-hover:blur-3xl transition-all duration-500" />
                        
                        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-primary rounded-none shadow-2xl border-4 border-white/20 flex items-center justify-center ring-1 ring-primary/20 group-hover:scale-105 transition-transform duration-500">
                             <MessageCircle className="w-10 h-10 md:w-14 md:h-14 text-white fill-current" />
                        </div>
                    </div>
                </div>

                {/* Orbiting Social Icons - Forming a Circle */}
                
                {/* 1. Top (YouTube) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[50%] top-[10%]">
                    <Youtube className="w-5 h-5 md:w-6 md:h-6 text-[#FF0000]" />
                </div>

                {/* 2. Top-Right (Twitter/X) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[78%] top-[22%]">
                     <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-black" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </div>

                {/* 3. Right (Telegram) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[90%] top-[50%]">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#229ED9] fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </div>

                {/* 4. Bottom-Right (TikTok) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[78%] top-[78%]">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-black fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </div>

                {/* 5. Bottom (LinkedIn) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[50%] top-[90%]">
                    <Linkedin className="w-5 h-5 md:w-6 md:h-6 text-[#0077B5]" />
                </div>

                {/* 6. Bottom-Left (Facebook) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[22%] top-[78%]">
                    <Facebook className="w-5 h-5 md:w-6 md:h-6 text-[#1877F2]" />
                </div>

                {/* 7. Left (Pinterest) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[10%] top-[50%]">
                     <svg className="w-5 h-5 md:w-6 md:h-6 text-[#BD081C] fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/></svg>
                </div>

                {/* 8. Top-Left (Instagram) */}
                <div className="absolute p-3 bg-white rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-8 ring-primary/5 -translate-x-1/2 -translate-y-1/2 left-[22%] top-[22%]">
                    <Instagram className="w-5 h-5 md:w-6 md:h-6 text-[#E1306C]" />
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
