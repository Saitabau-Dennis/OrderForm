"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-black/5" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold text-foreground tracking-tight">OrderForm</span>
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
          <Link href="/login" target="_blank" className="hidden md:block text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
            Log in
          </Link>
          <Link href="/register" target="_blank">
            <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 h-10 font-medium">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
