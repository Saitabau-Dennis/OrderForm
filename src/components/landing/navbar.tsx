"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LandingButton } from "@/components/landing/landing-button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
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
    <div className="fixed top-0 left-0 z-50 flex w-full justify-center bg-background px-4 py-2.5 md:py-3">
      <nav
        className="flex items-center justify-between w-full max-w-7xl py-1 px-2"
      >
        <Link
            href="/"
            className="flex items-center relative z-10 shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <span className="relative inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center overflow-hidden">
                <Image
                    src="/images/logo-of.png"
                    alt="OrderForm logo"
                    width={661}
                    height={377}
                    priority
                    loading="eager"
                    className="h-[16px] w-[16px] object-cover scale-[2.8]"
                />
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
                  className="md:hidden relative z-50 h-11 w-11 rounded-none bg-background p-0 text-foreground shadow-none hover:bg-background"
                >
                  <span className="inline-flex flex-col items-center justify-center gap-1">
                    <span className="h-[2px] w-5 bg-foreground" />
                    <span className="h-[2px] w-3.5 bg-foreground" />
                    <span className="h-[2px] w-5 bg-foreground" />
                  </span>
                  <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="theme-landing font-sans w-[86vw] max-w-[360px] p-0 flex flex-col bg-background shadow-[18px_0_40px_rgba(0,0,0,0.22)] [&>button]:right-4 [&>button]:top-4 [&>button]:h-7 [&>button]:w-7 [&>button]:rounded-none [&>button]:border-0 [&>button]:p-1 [&>button]:text-foreground/55 [&>button]:hover:bg-transparent [&>button]:hover:text-primary"
            >
                <SheetHeader className="px-7 pt-8 pb-6 text-left bg-primary/[0.03]">
                  <div className="pr-8">
                    <SheetTitle className="mb-0">
                      <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden">
                        <Image
                          src="/images/logo-of.png"
                          alt="OrderForm logo"
                          width={661}
                          height={377}
                          className="h-[16px] w-[16px] object-cover scale-[2.8]"
                        />
                      </span>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex-1 px-7 py-9">
                <div className="space-y-7">
                    <MobileNavLink href="#about" onClick={(e) => handleScroll(e, "#about")}>About</MobileNavLink>
                    <MobileNavLink href="#features" onClick={(e) => handleScroll(e, "#features")}>Features</MobileNavLink>
                    <MobileNavLink href="#pricing" onClick={(e) => handleScroll(e, "#pricing")}>Pricing</MobileNavLink>
                    <MobileNavLink href="#faq" onClick={(e) => handleScroll(e, "#faq")}>FAQ</MobileNavLink>
                </div>
                </div>

                <div className="p-7 pt-5 mt-auto bg-primary/[0.02]">
                    <div className="flex flex-col gap-3">
                    <LandingButton asChild tone="outline" size="lg" className="w-full rounded-xl">
                        <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>
                        Signin
                        </Link>
                    </LandingButton>
                    <LandingButton asChild size="lg" className="w-full rounded-xl">
                        <Link href={isAuthenticated ? "/dashboard" : "/register"} onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
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
        className="block font-sans text-[1.15rem] leading-none tracking-[-0.01em] text-foreground/90 transition-colors cursor-pointer hover:text-primary"
      >
        {children}
      </a>
    )
  }
