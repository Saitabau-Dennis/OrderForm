"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { Menu, ChevronRight, ChevronDown } from "lucide-react"
import { useSession } from "next-auth/react"
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

  const handleScroll = (e: React.MouseEvent<HTMLElement>, href: string) => {
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
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center px-4 py-1.5 md:py-2 bg-white/70 backdrop-blur-lg">
      <nav
        className="flex items-center justify-between w-full max-w-7xl py-1 px-2"
      >
        <Link
            href="/"
            className="flex items-center gap-1 relative z-10 shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden">
                <Image
                    src="/images/logo-of.png"
                    alt="OrderForm logo"
                    width={661}
                    height={377}
                    priority
                    className="h-6 w-6 object-cover scale-[3]"
                />
            </span>
            <span className="[font-family:var(--font-instrument-serif)] text-lg md:text-xl font-normal text-foreground tracking-tight mt-1">
              Orderform
            </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <NavLink href="#about" onClick={(e) => handleScroll(e, "#about")}>About</NavLink>

            <div className="relative group">
                <button
                    className="flex items-center gap-1 relative px-4 py-2 text-[15px] font-semibold text-foreground/70 hover:text-primary transition-colors rounded-full hover:bg-gray-50 cursor-pointer outline-none"
                    onClick={(e) => handleScroll(e, "#features")}
                >
                    Features
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                </button>

                {/* Dropdown Content */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                    <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden p-3 backdrop-blur-xl">
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
                className="hidden md:block text-[15px] font-semibold text-foreground/70 hover:text-primary transition-colors px-4"
            >
            Log in
            </Link>
            <Button
                asChild
                size="sm"
                className="hidden md:inline-flex rounded-full px-4 font-semibold"
            >
                <Link href={session ? "/dashboard" : "/register"} target="_blank">
                    Get Started
                </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden relative z-50 text-foreground hover:bg-gray-100">
                   <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-[86vw] max-w-[22rem] p-0 flex flex-col border-l border-border/80 bg-white shadow-[-14px_0_34px_rgba(0,0,0,0.1)] [&>button]:right-4 [&>button]:top-4 [&>button]:h-8 [&>button]:w-8 [&>button]:rounded-full [&>button]:p-2 [&>button]:text-foreground/40 [&>button]:hover:text-foreground [&>button]:hover:bg-muted/70"
            >
                <SheetHeader className="px-5 pt-7 pb-3 text-left border-b-0">
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/10">
                        <Image
                          src="/images/logo-of.png"
                          alt="OrderForm logo"
                          width={661}
                          height={377}
                          className="h-5 w-5 object-cover scale-[3]"
                        />
                      </span>
                      <SheetTitle className="[font-family:var(--font-instrument-serif)] tracking-tight text-[1.9rem] leading-none mb-0 font-normal text-primary mt-1">
                        OrderForm
                      </SheetTitle>
                    </div>
                    <p className="max-w-[15rem] text-[0.97rem] leading-snug text-foreground/65">
                      Turn social traffic into clean WhatsApp orders.
                    </p>
                  </div>
                </SheetHeader>

                <ScrollArea className="flex-1 px-5 py-4">
                <div className="px-1">
                    <MobileNavLink href="#about" onClick={(e) => handleScroll(e, "#about")}>About</MobileNavLink>
                    <MobileNavLink href="#features" onClick={(e) => handleScroll(e, "#features")}>Features</MobileNavLink>
                    <MobileNavLink href="#pricing" onClick={(e) => handleScroll(e, "#pricing")}>Pricing</MobileNavLink>
                    <MobileNavLink href="#faq" onClick={(e) => handleScroll(e, "#faq")}>FAQ</MobileNavLink>
                </div>
                </ScrollArea>

                <div className="p-5 mt-auto border-t border-border/70 bg-white">
                    <div className="flex flex-col gap-3">
                    <Button asChild size="lg" className="h-11 w-full rounded-xl text-base font-semibold bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(0,49,31,0.22)] hover:bg-primary/95">
                        <Link href={session ? "/dashboard" : "/register"} target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-11 w-full rounded-xl border-border bg-background text-primary text-base font-medium hover:bg-muted/50">
                        <Link href={session ? "/dashboard" : "/login"} target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                        Log in
                        </Link>
                    </Button>
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
            className="relative px-4 py-2 text-[15px] font-semibold text-foreground/70 hover:text-primary transition-all rounded-full hover:bg-gray-50 cursor-pointer"
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
        className="flex items-center justify-between rounded-xl px-2.5 py-3.5 hover:bg-white active:bg-muted/50 transition-colors group cursor-pointer"
      >
        <span className="text-[1.03rem] font-medium text-foreground/85 group-hover:text-primary transition-colors">{children}</span>
        <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary/60 transition-colors" />
      </a>
    )
  }

function FeatureItem({ href, title, description, onClick }: { href: string, title: string, description: string, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
    return (
        <a
            href={href}
            onClick={onClick}
            className="flex flex-col gap-0.5 p-3 rounded-xl hover:bg-gray-50 transition-all group/item"
        >
            <span className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">{title}</span>
            <span className="text-xs text-muted-foreground leading-normal">{description}</span>
        </a>
    )
}
