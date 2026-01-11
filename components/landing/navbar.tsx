"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Menu, X, ArrowRight, LayoutDashboard, HelpCircle, CreditCard, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
          isScrolled || isMobileMenuOpen ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-50 relative" onClick={() => setIsMobileMenuOpen(false)}>
             <span className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-foreground tracking-tighter">
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
            
            {/* Mobile Menu Toggle */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden relative z-50 h-8 w-8"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Sheet Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileMenuOpen(false)} 
            />
            
            <motion.div 
                initial={{ y: "120%", scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: "120%", scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-4 left-4 right-4 z-50 bg-background/80 backdrop-blur-2xl border border-white/20 p-4 rounded-[2rem] shadow-2xl md:hidden flex flex-col gap-2 ring-1 ring-black/5"
            >
                <div className="flex justify-center mb-1">
                    <div className="w-8 h-1 bg-muted/50 rounded-full" />
                </div>

                <div className="grid gap-1">
                    <MobileNavLink href="#features" icon={<Sparkles className="w-4 h-4 text-primary" />} label="Features" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="#pricing" icon={<CreditCard className="w-4 h-4 text-primary" />} label="Pricing" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="#faq"icon={<HelpCircle className="w-4 h-4 text-primary" />} label="FAQ" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
                
                <div className="bg-border/50 my-1" />
                
                <div className="mt-1">
                    {session ? (
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2">
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
                            <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                Get Started
                            </Button>
                        </Link>
                      </div>
                    )}
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function MobileNavLink({ href, label, icon, onClick }: { href: string, label: string, icon: React.ReactNode, onClick: () => void }) {
    return (
        <Link href={href} onClick={onClick} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 active:bg-muted transition-colors group">
            <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                {icon}
            </div>
            <span className="text-sm font-medium font-heading text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
        </Link>
    )
}
