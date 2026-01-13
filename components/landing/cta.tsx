"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation className="bg-primary rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl ring-4 ring-primary/20">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-spin-slow duration-[20s]" />
             <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-heading font-medium text-primary-foreground mb-8 leading-[1.1] tracking-tight">
              Start receiving better WhatsApp orders today
            </h2>

            <p className="text-base md:text-lg text-primary-foreground/80 font-sans font-light max-w-xl mx-auto mb-12 leading-relaxed">
              Create your store, add your products, and turn your bio link into a simple ordering system.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-primary hover:bg-white/90 text-lg  transition-all hover:scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center gap-2 group">
                  Create your store
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
