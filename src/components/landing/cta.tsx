
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ArrowRight, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function CTA() {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation className="bg-primary rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl ring-4 ring-primary/20">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-spin-slow duration-[20s]" />
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">

            {/* Social Proof */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8 md:mb-12">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Avatar key={i} className="border-2 border-primary w-10 h-10 md:w-12 md:h-12">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  ))}
                </div>
                <span className="text-emerald-100 text-sm md:text-base font-medium">140+ happy partners</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-heading font-medium text-white mb-6 leading-[1.05] tracking-tight max-w-4xl mx-auto">
              Ready to <span className="font-heading italic text-emerald-50 relative inline-block">boost<svg className="absolute -bottom-2 left-0 w-full h-2 text-emerald-400/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg></span> your growth with OrderForm?
            </h2>

            <p className="text-lg md:text-xl text-emerald-100/80 font-sans font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Create your store, add your products, and turn your bio link into a simple, professional ordering system. Join hundreds of growing brands today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              {/* <Link href="/register" target="_blank">
                 <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 font-semibold">
                  Demo
                </Button>
              </Link> */}
              <Link href="/register" target="_blank">
                <Button size="lg" className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-8 font-semibold">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
