"use client"

import Link from "next/link"
import Image from "next/image"
import { Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">

        {/* Brand Section */}
        <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-1">
                 <span className="font-heading text-lg font-semibold text-foreground tracking-tight">
                    OrderForm
                </span>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
                Simplifying commerce for the modern entrepreneur. Built for growth.
            </p>
             <div className="flex items-center gap-4 text-muted-foreground">
                <Link href="#" className="hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></Link>
                <Link href="#" className="hover:text-foreground transition-colors"><Instagram className="w-4 h-4" /></Link>
                <Link href="mailto:dennisntete28@gmail.com" className="hover:text-foreground transition-colors"><Mail className="w-4 h-4" /></Link>
            </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col gap-3">
                <h4 className="font-medium text-base">Product</h4>
                <Link href="#features" className="text-base text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link href="#pricing" className="text-base text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            </div>
            <div className="flex flex-col gap-3">
                <h4 className="font-medium text-base">Company</h4>
                 <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">About</Link>
                 <Link href="mailto:dennisntete28@gmail.com" className="text-base text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-3">
                <h4 className="font-medium text-base">Legal</h4>
                <Link href="/privacy" className="text-base text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="text-base text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-border">
         <p className="text-base text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} OrderForm, Made with ❤️ for better social commerce.
         </p>
      </div>
    </footer>
  )
}
