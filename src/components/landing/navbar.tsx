"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LandingButton } from "@/components/landing/landing-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { Menu, ChevronRight } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

type NavbarProps = {
  isAuthenticated?: boolean
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
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
            <span className="relative inline-flex h-7 w-7 items-center justify-center overflow-hidden">
                <Image
                    src="/images/logo-of.png"
                    alt="OrderForm logo"
                    width={661}
                    height={377}
                    priority
                    className="h-[16px] w-[16px] object-cover scale-[3]"
                />
            </span>
            <span className="[font-family:var(--font-adcure)] text-[1.15rem] md:text-[1.35rem] font-semibold text-foreground tracking-tight mt-1">
              Orderform
            </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <NavLink href="#about" onClick={(e) => handleScroll(e, "#about")}>About</NavLink>
            <NavLink href="#features" onClick={(e) => handleScroll(e, "#features")}>Features</NavLink>

            <NavLink href="#pricing" onClick={(e) => handleScroll(e, "#pricing")}>Pricing</NavLink>
            <NavLink href="#faq" onClick={(e) => handleScroll(e, "#faq")}>FAQ</NavLink>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
            <LandingButton
                asChild
                tone="ghost"
                size="md"
                className="hidden md:inline-flex"
            >
                <Link href={isAuthenticated ? "/dashboard" : "/login"} target="_blank">
                    Log in
                </Link>
            </LandingButton>
            <LandingButton
                asChild
                size="md"
                className="hidden md:inline-flex"
            >
                <Link href={isAuthenticated ? "/dashboard" : "/register"} target="_blank">
                    Get Started
                </Link>
            </LandingButton>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden relative z-50 h-10 rounded-full border border-border/70 bg-white/90 px-3 text-foreground shadow-sm hover:bg-white"
                >
                   <Menu className="h-4 w-4" />
                   <span className="ml-1 text-sm font-medium">Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-1/2 max-w-none p-0 flex flex-col border-l border-border/70 bg-gradient-to-b from-[#f7fbf9] via-white to-white shadow-[-16px_0_40px_rgba(0,0,0,0.12)] [&>button]:right-4 [&>button]:top-4 [&>button]:h-8 [&>button]:w-8 [&>button]:rounded-full [&>button]:p-2 [&>button]:text-foreground/40 [&>button]:hover:text-foreground [&>button]:hover:bg-muted/70"
            >
                <SheetHeader className="px-6 pt-7 pb-4 text-left border-b border-border/60 bg-white/80 backdrop-blur">
                  <div className="pt-1.5">
                    <div className="flex items-center gap-2">
                      <span className="relative inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/10 shrink-0">
                        <Image
                          src="/images/logo-of.png"
                          alt="OrderForm logo"
                          width={661}
                          height={377}
                          className="h-4 w-4 object-cover scale-[3]"
                        />
                      </span>
                      <SheetTitle className="[font-family:var(--font-adcure)] tracking-tight text-[1.55rem] leading-none mb-0 font-semibold text-primary mt-1">
                        OrderForm
                      </SheetTitle>
                    </div>
                    <p className="max-w-[17rem] text-[0.95rem] leading-snug text-foreground/65 mt-2">
                      Turn social traffic into clean WhatsApp orders.
                    </p>
                  </div>
                </SheetHeader>

                <ScrollArea className="flex-1 px-6 py-5">
                <div className="space-y-2">
                    <MobileNavLink href="#about" onClick={(e) => handleScroll(e, "#about")}>About</MobileNavLink>
                    <MobileNavLink href="#features" onClick={(e) => handleScroll(e, "#features")}>Features</MobileNavLink>
                    <MobileNavLink href="#pricing" onClick={(e) => handleScroll(e, "#pricing")}>Pricing</MobileNavLink>
                    <MobileNavLink href="#faq" onClick={(e) => handleScroll(e, "#faq")}>FAQ</MobileNavLink>
                </div>
                </ScrollArea>

                <div className="p-6 mt-auto border-t border-border/70 bg-white/90 backdrop-blur">
                    <div className="flex flex-col gap-3">
                    <LandingButton asChild size="lg" className="w-full">
                        <Link href={isAuthenticated ? "/dashboard" : "/register"} target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
                        </Link>
                    </LandingButton>
                    <LandingButton asChild tone="outline" size="lg" className="w-full font-medium">
                        <Link href={isAuthenticated ? "/dashboard" : "/login"} target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
                        Log in
                        </Link>
                    </LandingButton>
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
            className="relative px-4 py-2 text-[15px] font-normal text-foreground/70 hover:text-primary transition-colors cursor-pointer"
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
        className="group flex items-center justify-between rounded-lg px-1 py-3.5 transition-colors cursor-pointer hover:text-primary"
      >
        <span className="text-[1.03rem] font-medium text-foreground/90 group-hover:text-primary transition-colors">{children}</span>
        <ChevronRight className="w-4 h-4 text-foreground/35 group-hover:text-primary/70 transition-colors" />
      </a>
    )
  }
