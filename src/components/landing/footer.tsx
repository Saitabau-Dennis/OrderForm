"use client"

import Link from "next/link"
import { Mail, Instagram, Facebook, Twitter, ArrowRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
            
            {/* Left Section: Brand & Tagline */}
            <div className="flex flex-col items-start max-w-sm">
                <Link href="/" className="font-heading text-3xl font-bold tracking-tight text-foreground mb-4">
                    Order<span className="text-primary">Form</span>
                </Link>
                <p className="text-muted-foreground font-sans text-lg leading-relaxed text-left">
                    Simplifying commerce for the modern entrepreneur. Turn social conversations into paid orders.
                </p>
            </div>

            {/* Right Section: Links Grid (Horizontal) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 lg:gap-24">
                
                {/* Column 1: Product */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-heading font-medium text-foreground text-sm uppercase tracking-wider">Product</h4>
                    <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors text-sm">Features</Link>
                    <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">Pricing</Link>
                    <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm">How it Works</Link>
                    <Link href="#mini-store" className="text-muted-foreground hover:text-primary transition-colors text-sm">Mini Store</Link>
                </div>

                {/* Column 2: Support */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-heading font-medium text-foreground text-sm uppercase tracking-wider">Support</h4>
                    <Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</Link>
                    <Link href="mailto:dennisntete28@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link>
                </div>

                {/* Column 3: Get Started */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-heading font-medium text-foreground text-sm uppercase tracking-wider">Get Started</h4>
                    <p className="text-sm text-muted-foreground mb-2">Ready to launch?</p>
                    <Link href="/register" className="inline-flex items-center text-primary font-medium text-sm hover:underline group">
                        Create free account
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </div>

        {/* Bottom Section: Copyright & Legal - Centered */}
        <div className="flex flex-col items-center justify-center gap-4 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} OrderForm Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
                 <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                 <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
        </div>

      </div>
    </footer>
  )
}
