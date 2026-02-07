"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation className="bg-primary rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl ring-4 ring-primary/20">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-spin-slow duration-[20s]" />
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            
            <h2 className="text-4xl md:text-6xl font-heading font-medium text-white mb-6 leading-[1.05] tracking-tight max-w-4xl mx-auto">
              Start receiving <span className="font-instrument-serif italic text-emerald-50 relative inline-block">better<svg className="absolute -bottom-2 left-0 w-full h-2 text-emerald-400/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg></span> WhatsApp orders today.
            </h2>

            <p className="text-lg md:text-xl text-emerald-100/80 font-sans font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              Create your store, add your products, and turn your bio link into a simple, professional ordering system.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                          <Link href="/register" target="_blank">
                            <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 group">
                              Create your store
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
