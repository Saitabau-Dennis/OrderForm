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
import { Menu, LayoutDashboard } from "lucide-react"
import { useSession } from "next-auth/react"

export function Navbar() {
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 md:py-4",
          isScrolled || isMobileMenuOpen ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
        )}
      >
        <div className="w-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
             <span className="font-(family-name:--font-outfit) text-2xl font-bold text-foreground tracking-tighter">
              Order<span className="text-primary">Form</span>
             </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="hidden md:block">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 h-10 font-medium shadow-lg hover:shadow-xl flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="hidden md:block">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 h-10 font-medium shadow-lg hover:shadow-xl">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden relative z-50 h-9 w-9" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="md:hidden w-[86vw] max-w-xs p-0 flex flex-col">
                <SheetHeader className="px-6 pt-6 pb-4 text-left">
                  <SheetTitle className="font-(family-name:--font-outfit) tracking-tighter">
                    Order<span className="text-primary">Form</span>
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground">
                    Turn social traffic into clean WhatsApp orders.
                  </p>
                </SheetHeader>

                <ScrollArea className="flex-1 px-3">
                  <div className="grid gap-1 pb-6">
                    <MobileNavLink href="#features" label="Features" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="#pricing" label="Pricing" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="#faq" label="FAQ" onClick={() => setIsMobileMenuOpen(false)} />
                  </div>
                </ScrollArea>

                <div className="mt-auto px-6 pb-6 pt-4 border-t border-border">
                  {session ? (
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full h-11 rounded-xl text-sm font-medium hover:bg-muted/50">
                          Log in
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:shadow-lg">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  )
}

function MobileNavLink({ href, label, onClick }: { href: string, label: string, onClick: () => void }) {
    return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center p-3 rounded-xl hover:bg-muted/50 active:bg-muted transition-colors"
    >
      <span className="text-sm font-medium font-heading text-foreground/90">{label}</span>
        </Link>
    )
}
