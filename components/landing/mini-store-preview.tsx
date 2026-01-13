"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { TextHighlight } from "@/components/ui/text-highlight"
import { cn } from "@/lib/utils"

const previews = [
  {
    title: "Catalog home",
    description: "A clean storefront with categories and product cards.",
    src: "/images/dashboard.png",
    alt: "Mini store catalog page preview"
  },
  {
    title: "Product details",
    description: "Fast decisions with clear pricing and an add-to-cart button.",
    src: "/images/dashboard.png",
    alt: "Mini store product details page preview"
  },
  {
    title: "Checkout",
    description: "Simple order summary ready to send to WhatsApp.",
    src: "/images/dashboard.png",
    alt: "Mini store checkout page preview"
  },
  {
    title: "UGC upload",
    description: "Upload a photo proof after purchase to earn a discount code.",
    src: "/images/dashboard.png",
    alt: "Mini store UGC upload page preview"
  },
  {
    title: "Discount code",
    description: "Get a reward code to use on the next order.",
    src: "/images/dashboard.png",
    alt: "Mini store discount code page preview"
  }
]

export function MiniStorePreview() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <ScrollAnimation variant="fade-up">
            <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-4">
              Mini store
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground leading-[1.1] tracking-tight">
              A beautiful <TextHighlight color="green" className="rotate-1">mini-store</TextHighlight> your customers can browse
            </h2>
          </ScrollAnimation>

          <ScrollAnimation variant="fade-up" delay={0.1}>
            <p className="mt-6 text-base md:text-lg text-muted-foreground font-sans leading-relaxed max-w-3xl mx-auto">
              Share one link. Customers browse, order via WhatsApp, then come back to upload photo proof (UGC) and earn a discount code for their next purchase.
            </p>
          </ScrollAnimation>
        </div>

        <div className="grid gap-4 items-stretch sm:grid-cols-2 lg:grid-cols-12">
          {previews.map((item, index) => (
            <ScrollAnimation
              key={item.title}
              delay={index * 0.1}
              className={cn("h-full", index < 2 ? "lg:col-span-6" : "lg:col-span-4")}
            >
              <div
                className={cn(
                  "group h-full border border-border bg-background overflow-hidden rounded-none",
                  "transition-all duration-300 hover:-translate-y-1"
                )}
              >
                <div className="flex h-full flex-col">
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 className="font-heading font-medium text-lg text-foreground">{item.title}</h3>
                    <span className="text-[10px] font-heading uppercase tracking-[0.2em] text-primary/70">
                      Preview
                    </span>
                  </div>
                  <p
                    className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed min-h-13"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="relative border-t border-dashed border-border">
                    <div className="aspect-76/59">
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full block bg-background object-contain object-center"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* <ScrollAnimation variant="fade-up" delay={0.15} className="mt-10 md:mt-12">
          
        </ScrollAnimation> */}
      </div>
    </section>
  )
}
