
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ArrowRight, Zap } from "lucide-react"

export function CTA() {
  return (
    <section className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollAnimation>
          <div className="relative rounded-[2rem] overflow-hidden ring-2 ring-white/20">

            {/* Background */}
            <div className="absolute inset-0 bg-primary" />

            {/* Content grid */}
            <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-center px-8 py-12 md:px-16 md:py-16">

              {/* Left: text */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 mb-6">
                  <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  <span className="text-white/90 text-xs font-semibold tracking-wide uppercase">Free to get started</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-white leading-[1.05] tracking-tight max-w-2xl">
                  Your bio link,{" "}
                  <span className="relative inline-block">
                    a full storefront.
                    <svg
                      className="absolute -bottom-1.5 left-0 w-full"
                      viewBox="0 0 300 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 8 Q75 0 150 6 Q225 12 300 4"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>

                <p className="mt-5 text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
                  List your products, share one link, and let customers build a cart and send you a pre-filled WhatsApp order — no DM chaos, no missed sales.
                </p>
              </div>

              {/* Right: CTA card */}
              <div className="flex flex-col items-start md:items-center gap-4 shrink-0">
                <Button
                  asChild
                  size="lg"
                  className="group rounded-full px-8 text-base font-semibold"
                >
                  <Link href="/register" target="_blank">
                    Create my store
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
