"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"

export function Footer() {
  return (
    <footer className="bg-background relative border-t border-border overflow-hidden min-h-[500px] flex flex-col justify-center">
      
      {/* Background Text Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-full h-full p-10 md:p-20 flex items-center justify-center opacity-20">
             <TextHoverEffect text="ORDERFORM" />
          </div>
      </div>

      {/* Foreground Content Layer */}
      <div className="max-w-7xl w-full mx-auto px-6 py-12 md:py-20 relative z-10 pointer-events-none">
        
        <div className="grid md:grid-cols-2 gap-12 items-start mb-24 md:mb-32">
            {/* Brand Column */}
            <div className="space-y-6 pointer-events-auto">
                <Link href="/" className="font-heading text-xl font-medium tracking-tight text-foreground block w-fit">
                    OrderForm
                </Link>
                <p className="text-muted-foreground max-w-sm font-sans font-normal leading-relaxed text-base backdrop-blur-[2px] rounded-lg">
                    Simplifying commerce for the modern entrepreneur. Turn conversations into conversions.
                </p>
            </div>

            {/* Navigation Column */}
            <div className="flex md:justify-end gap-12 md:gap-24 pointer-events-auto">
                <div className="flex flex-col gap-4 text-left md:text-right">
                    <h4 className="font-heading font-medium text-base text-foreground">Contact</h4>
                     <Link 
                        href="mailto:dennisntete28@gmail.com" 
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center md:justify-end gap-2 group w-fit md:ml-auto"
                     >
                        <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        dennisntete28@gmail.com
                     </Link>
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/50 pointer-events-auto backdrop-blur-[2px] rounded-t-lg">
            <p className="text-sm text-muted-foreground font-sans order-2 md:order-1">
                © {new Date().getFullYear()} OrderForm Inc. All rights reserved.
            </p>

            <div className="flex items-center gap-6 order-1 md:order-2">
                 <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans px-2">Privacy Policy</Link>
                 <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans px-2">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  )
}
