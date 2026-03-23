"use client"

import Link from "next/link"
import { LandingButton } from "@/components/landing/landing-button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ArrowRight, Instagram, Facebook, MessageCircle, Linkedin } from "lucide-react"

export function AboutUs() {
  return (
    <section id="about" className="py-10 md:py-14 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start text-left">
             <ScrollAnimation variant="fade-up">
                <div className="inline-flex items-center px-2 py-0.5 rounded-none landing-section-tag text-primary text-[10px] font-semibold mb-4 uppercase tracking-[0.12em]">
                  What is OrderForm?
                </div>
                
                <h2 className="text-2xl md:text-4xl font-heading font-normal text-foreground mb-4 leading-[1.06] tracking-[-0.02em]">
                  Built for sellers who grow on social media, <span className="text-primary italic font-heading">not complex storefront tools.</span>
                </h2>
                
                <div className="space-y-4 text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
                   <p>
                      OrderForm helps you move from price questions in DMs to a structured ordering flow. You get a branded store link where customers can browse products, add to cart, and send complete orders to WhatsApp.
                   </p>
                   <p>
                      Behind the scenes, your dashboard keeps products, orders, customers, and sales insights in one place so you can spend less time organizing chats and more time fulfilling orders.
                   </p>
                </div>

                <div className="mt-6">
                      <LandingButton asChild size="lg" className="group rounded-xl px-6 text-sm md:text-base font-semibold">
                       <Link href="/register" target="_blank" rel="noopener noreferrer">
                         Launch your store
                         <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                       </Link>
                      </LandingButton>
                </div>
             </ScrollAnimation>
          </div>

          {/* Right Column: Visual Animation */}
          <ScrollAnimation delay={0} className="relative w-full flex justify-center lg:justify-end">
             <div className="aspect-square w-full max-w-[500px] relative flex items-center justify-center">
                
                {/* Connecting Lines SVG Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                    {/* Static Dashed Lines */}
                    <g className="text-primary/25">
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
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="relative group">
                        <div className="relative w-14 h-14 md:w-20 md:h-20 bg-primary rounded-none shadow-2xl border-4 border-white/20 flex items-center justify-center ring-1 ring-primary/20 group-hover:scale-105 transition-transform duration-500">
                             <MessageCircle className="w-5 h-5 md:w-8 md:h-8 text-white fill-current" />
                        </div>
                    </div>
                </div>

                {/* Orbiting Social Icons - Forming a Circle */}
                
                {/* 1. Top (Reddit) */}
                <div className="absolute p-2.5 bg-card rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-6 ring-primary/20 -translate-x-1/2 -translate-y-1/2 left-[50%] top-[10%]">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-[#FF4500] fill-current" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.051l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.048.203.074.414.074.631 0 2.206-2.534 4-5.648 4-3.114 0-5.647-1.794-5.647-4 0-.211.026-.419.072-.619a1.753 1.753 0 0 1-1.052-1.609c0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.471 1.196-.846 2.84-1.401 4.654-1.482l.866-4.066a.356.356 0 0 1 .43-.274l2.844.599c.071-.035.152-.054.235-.054zM10.5 11.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm4.5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 14.5c-1.101 0-2.039.312-2.774.71a.337.337 0 0 0-.012.582c.541.326 1.199.53 1.786.53 1.101 0 2.039-.312 2.774-.71a.338.338 0 0 0 .012-.582c-.541-.326-1.199-.53-1.786-.53z"/></svg>
                </div>

                {/* 2. Top-Right (Twitter/X) */}
                <div className="absolute p-2.5 bg-card rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-6 ring-primary/20 -translate-x-1/2 -translate-y-1/2 left-[78%] top-[22%]">
                     <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-black" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </div>

                {/* 3. Right (Discord) */}
                <div className="absolute p-2.5 bg-card rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-6 ring-primary/20 -translate-x-1/2 -translate-y-1/2 left-[90%] top-[50%]">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-[#5865F2] fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 1-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/></svg>
                </div>

                {/* 4. Bottom-Right (TikTok) */}
                <div className="absolute p-2.5 bg-card rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-6 ring-primary/20 -translate-x-1/2 -translate-y-1/2 left-[78%] top-[78%]">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-black fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </div>

                {/* 5. Bottom (LinkedIn) */}
                <div className="absolute p-2.5 bg-card rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-6 ring-primary/20 -translate-x-1/2 -translate-y-1/2 left-[50%] top-[90%]">
                    <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-[#0077B5]" />
                </div>

                {/* 6. Bottom-Left (Facebook) */}
                <div className="absolute p-2.5 bg-card rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-6 ring-primary/20 -translate-x-1/2 -translate-y-1/2 left-[22%] top-[78%]">
                    <Facebook className="w-4 h-4 md:w-5 md:h-5 text-[#1877F2]" />
                </div>

                {/* 7. Left (Pinterest) */}
                <div className="absolute p-2.5 bg-card rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-6 ring-primary/20 -translate-x-1/2 -translate-y-1/2 left-[10%] top-[50%]">
                     <svg className="w-4 h-4 md:w-5 md:h-5 text-[#BD081C] fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/></svg>
                </div>

                {/* 8. Top-Left (Instagram) */}
                <div className="absolute p-2.5 bg-card rounded-full shadow-lg border border-border/50 flex items-center justify-center ring-6 ring-primary/20 -translate-x-1/2 -translate-y-1/2 left-[22%] top-[22%]">
                    <Instagram className="w-4 h-4 md:w-5 md:h-5 text-[#E1306C]" />
                </div>

             </div>
             {/* Decorative blob */}
             <div className="absolute -z-10 top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[60px]" />
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
