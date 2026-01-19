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
import { Menu, LayoutDashboard, ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { motion, useScroll, useMotionValueEvent } from "motion/react"

export function Navbar() {
  const { data: session } = useSession()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.25 }}
        className={cn(
          "flex items-center justify-between transition-all duration-500 ease-in-out w-full border",
          isScrolled
            ? "max-w-4xl rounded-full bg-background/80 backdrop-blur-lg border-border/50 shadow-lg py-2 pl-4 pr-2"
            : "max-w-7xl rounded-none md:rounded-full bg-transparent border-transparent py-4 px-2 md:px-6"
        )}
      >
        <Link 
            href="/" 
            className="flex items-center gap-2 relative z-10 shrink-0" 
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <span className="font-(family-name:--font-outfit) text-xl md:text-2xl font-bold text-foreground tracking-tighter">
            Order<span className="text-primary">Form</span>
            </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={cn(
            "hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 transition-all duration-300",
            isScrolled ? "opacity-100 visible" : "opacity-100"
        )}>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
            {session ? (
            <Link href="/dashboard" className="hidden md:block">
                <Button 
                    className={cn(
                        "rounded-full font-medium transition-all shadow-md hover:shadow-lg", 
                        isScrolled ? "h-9 px-4 text-xs" : "h-10 px-6"
                    )}
                >
                <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                Dashboard
                </Button>
            </Link>
            ) : (
            <>
                <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3">
                Log in
                </Link>
                <Link href="/register" className="hidden md:block">
                    <Button 
                        size={isScrolled ? "sm" : "default"} 
                        className="rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                    >
                        Get Started
                    </Button>
                </Link>
            </>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden relative z-50 rounded-full">
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
                    <MobileNavLink href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
                    <MobileNavLink href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</MobileNavLink>
                    <MobileNavLink href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</MobileNavLink>
                </div>
                </ScrollArea>

                <div className="p-6 mt-auto border-t border-border/10 bg-muted/20">
                    {session ? (
                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-12 rounded-xl text-base font-semibold shadow-md flex items-center justify-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Go to Dashboard
                        </Button>
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-3">
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full h-12 rounded-xl text-base font-semibold shadow-md">
                            Get Started
                            </Button>
                        </Link>
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium">
                            Log in
                            </Button>
                        </Link>
                        </div>
                    )}
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </motion.nav>
    </div>
  )
}
Navbar.displayName = "Navbar"

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link 
            href={href} 
            className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
        >
            {children}
        </Link>
    )
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/60 active:bg-muted transition-all group"
      >
        <span className="text-base font-medium text-foreground/90 group-hover:text-primary transition-colors">{children}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    )
  }
