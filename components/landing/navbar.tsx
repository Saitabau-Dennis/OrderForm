"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Menu, X, ArrowRight, LayoutDashboard, HelpCircle, CreditCard, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export function Navbar() {
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
            <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 h-10 font-medium shadow-lg hover:shadow-xl">
                Get Started
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden relative z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-6 pb-8 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden flex flex-col gap-4"
            >
                <div className="flex justify-center mb-2">
                    <div className="w-12 h-1.5 bg-muted rounded-full" />
                </div>

                <div className="grid gap-2">
                    <MobileNavLink href="#features" icon={<Sparkles className="w-5 h-5 text-primary" />} label="Features" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="#pricing" icon={<CreditCard className="w-5 h-5 text-primary" />} label="Pricing" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href="#faq"icon={<HelpCircle className="w-5 h-5 text-primary" />} label="FAQ" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
                
                <div className="h-px bg-border my-2" />
                
                <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium border-border hover:bg-muted">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-base font-bold shadow-lg flex items-center justify-center gap-2">
                            Get Started <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
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
        <Link href={href} onClick={onClick} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 active:bg-muted transition-colors">
            <div className="p-2.5 rounded-full bg-primary/10">
                {icon}
            </div>
            <span className="text-lg font-medium font-heading text-foreground">{label}</span>
        </Link>
    )
}
