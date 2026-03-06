import Link from "next/link"
import { Twitter, Instagram, Mail } from "lucide-react"

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">

        {/* Brand Section */}
        <div className="flex flex-col gap-4 max-w-xs">
             <div className="flex items-center gap-1">
                 <span className="[font-family:var(--font-teknaf)] text-2xl md:text-3xl font-semibold text-foreground tracking-tight mt-1">
              Orderform
            </span>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
                Built for social commerce: storefront links, clean checkout, and WhatsApp-ready orders.
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
                <h4 className="font-normal text-base">Product</h4>
                <Link href="#features" className="text-base text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link href="#pricing" className="text-base text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            </div>
            <div className="flex flex-col gap-3">
                <h4 className="font-normal text-base">Company</h4>
                 <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">About</Link>
                 <Link href="mailto:dennisntete28@gmail.com" className="text-base text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-3">
                <h4 className="font-normal text-base">Legal</h4>
                <Link href="/privacy" className="text-base text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="text-base text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-border">
        <p className="text-base text-muted-foreground text-center md:text-center">
          &copy; {currentYear} OrderForm. Built with ❤️ for modern social selling.
        </p>
      </div>
    </footer>
  )
}
