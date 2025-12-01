"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

export function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation className="bg-foreground rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-background/10 blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-background mb-6 leading-[1.1]">
              Ready to streamline <br />
              <span className="italic text-background/80">your sales?</span>
            </h2>

            <p className="text-lg md:text-xl text-background/60 font-sans font-normal max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of sellers using OrderForm to grow their business on WhatsApp. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button className="h-14 px-8 rounded-full bg-background text-foreground hover:bg-background/90 text-lg font-medium transition-all hover:scale-105">
                  Create your store
                </Button>
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
