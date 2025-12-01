"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background text-foreground py-24 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="font-heading text-2xl font-bold mb-6 block tracking-tight">
            Orderform
          </Link>
          <p className="text-muted-foreground max-w-sm font-sans font-normal leading-relaxed">
            Simplifying commerce for the modern entrepreneur. Turn conversations into conversions.
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-12 md:items-start md:justify-end">
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Product</h4>
            <ul className="flex gap-6 text-muted-foreground font-sans">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Contact</h4>
            <a href="mailto:dennisntete28@gmail.com" className="text-muted-foreground font-sans hover:text-foreground transition-colors">
              dennisntete28@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-sans">
        <p>© 2024 Orderform Inc. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
