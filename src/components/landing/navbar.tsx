"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Menu, LayoutDashboard, ChevronRight, ChevronDown, Store, ShoppingBag, MessageCircle, Smartphone } from "lucide-react"
import { useSession } from "next-auth/react"
import { motion } from "motion/react"
import { usePathname, useRouter } from "next/navigation"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a hash link
    if (href.startsWith('#')) {
      // If we're not on the home page, let the link navigation handle it
      // But we need to make sure the href includes the slash if we are not on home
      if (pathname !== '/') {
        e.preventDefault()
        router.push(`/${href}`)
        setIsMobileMenuOpen(false)
        return
      }

      // If we are on home page, scroll smoothly
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        const offset = 80 // Height of navbar + some breathing room
        const bodyRect = document.body.getBoundingClientRect().top
        const elementRect = element.getBoundingClientRect().top
        const elementPosition = elementRect - bodyRect
        const offsetPosition = elementPosition - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-0 pb-0">
      <nav
        className="flex items-center justify-between w-full max-w-5xl rounded-t-none rounded-b-xl bg-primary border border-t-0 border-primary/20 shadow-xl py-4 pl-5 pr-2.5"
      >
        <Link 
            href="/" 
            className="flex items-center gap-2 relative z-10 shrink-0" 
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <span className="font-(family-name:--font-outfit) text-xl font-bold text-primary-foreground tracking-tighter">
            Order<span className="text-primary-foreground/80">Form</span>
            </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <NavLink href="#about" onClick={(e) => handleScroll(e, "#about")}>About</NavLink>
            
            <div className="relative group">
                <button 
                    className="flex items-center gap-1 relative px-4 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors rounded-full hover:bg-white/10 cursor-pointer outline-none"
                    onClick={(e) => handleScroll(e as any, "#features")}
                >
                    Features
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                </button>
                
                {/* Dropdown Content */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                    <div className="bg-primary rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-primary/20 overflow-hidden p-3">
                        <FeatureItem 
                            href="#features" 
                            title="Store Link" 
                            description="A professional link for your social bio."
                            onClick={(e) => handleScroll(e, "#features")} 
                        />
                        <FeatureItem 
                            href="#features" 
                            title="Product Catalog" 
                            description="Organize and showcase your items."
                            onClick={(e) => handleScroll(e, "#features")} 
                        />
                        <FeatureItem 
                            href="#features" 
                            title="WhatsApp Checkout" 
                            description="Receive structured orders in chat."
                            onClick={(e) => handleScroll(e, "#features")} 
                        />
                        <FeatureItem 
                            href="#mini-store" 
                            title="Mini Store" 
                            description="Mobile-first preview for customers."
                            onClick={(e) => handleScroll(e, "#mini-store")} 
                        />
                    </div>
                </div>
            </div>

            <NavLink href="#pricing" onClick={(e) => handleScroll(e, "#pricing")}>Pricing</NavLink>
            <NavLink href="#faq" onClick={(e) => handleScroll(e, "#faq")}>FAQ</NavLink>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
            <Link 
                href={session ? "/dashboard" : "/login"}
                target="_blank"
                className="hidden md:block text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors px-3"
            >
            Log in
            </Link>
            <Link href={session ? "/dashboard" : "/register"} target="_blank" className="hidden md:block">
                <Button 
                    size="sm"
                    className="rounded-full font-medium shadow-md hover:shadow-lg transition-all h-9 px-5 bg-white text-primary hover:bg-white/90"
                >
                    Get Started
                </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden relative z-50 rounded-full text-primary-foreground hover:bg-white/10">
                   <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className=" w-[85vw] max-w-xs p-0 flex flex-col border-l border-border/50 bg-background/95 backdrop-blur-xl">
                <SheetHeader className="px-6 pt-8 pb-4 text-left border-b border-border/10">
                <SheetTitle className="font-(family-name:--font-outfit) tracking-tighter text-2xl">
                    Order<span className="text-primary">Form</span>
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Turn social traffic into clean WhatsApp orders.
                </p>
                </SheetHeader>

                <ScrollArea className="flex-1 px-4 py-4">
                <div className="flex flex-col gap-2">
                    <MobileNavLink href="#about" onClick={(e) => handleScroll(e, "#about")}>About</MobileNavLink>
                    <MobileNavLink href="#features" onClick={(e) => handleScroll(e, "#features")}>Features</MobileNavLink>
                    <MobileNavLink href="#pricing" onClick={(e) => handleScroll(e, "#pricing")}>Pricing</MobileNavLink>
                    <MobileNavLink href="#faq" onClick={(e) => handleScroll(e, "#faq")}>FAQ</MobileNavLink>
                </div>
                </ScrollArea>

                <div className="p-6 mt-auto border-t border-border/10 bg-muted/20">
                    <div className="flex flex-col gap-3">
                    <Link href={session ? "/dashboard" : "/register"} target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-12 rounded-xl text-base font-semibold shadow-md">
                        Get Started
                        </Button>
                    </Link>
                    <Link href={session ? "/dashboard" : "/login"} target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium">
                        Log in
                        </Button>
                    </Link>
                    </div>
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </nav>
    </div>
  )
}
Navbar.displayName = "Navbar"

function NavLink({ href, onClick, children }: { href: string, onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void, children: React.ReactNode }) {
    return (
        <a 
            href={href}
            onClick={onClick}
            className="relative px-4 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors rounded-full hover:bg-white/10 cursor-pointer"
        >
            {children}
        </a>
    )
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void, children: React.ReactNode }) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/60 active:bg-muted transition-all group cursor-pointer"
      >
        <span className="text-base font-medium text-foreground/90 group-hover:text-primary transition-colors">{children}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </a>
    )
  }

function FeatureItem({ href, title, description, onClick }: { href: string, title: string, description: string, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
    return (
        <a 
            href={href}
            onClick={onClick}
            className="flex flex-col gap-0.5 p-3 rounded-none hover:bg-white/10 transition-all group/item"
        >
            <span className="text-sm font-semibold text-primary-foreground group-hover/item:text-primary-foreground transition-colors">{title}</span>
            <span className="text-xs text-primary-foreground/70 leading-normal">{description}</span>
        </a>
    )
}
