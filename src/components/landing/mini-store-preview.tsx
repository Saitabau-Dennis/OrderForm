"use client"

import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { cn } from "@/lib/utils"

const previews = [
  {
    title: "Browse Products",
    description: "A clean, mobile-first catalog. Customers can easily scroll through your items, view high-res photos, check prices, and select variants like size or color without any distractions.",
    src: "/images/dashboard-v2.png",
    alt: "Mini store catalog page preview"
  },
  {
    title: "Review Cart",
    description: "A transparent cart experience. Customers can double-check their selections, adjust quantities, and see their total cost instantly before they commit to buy.",
    src: "/images/dashboard-v2.png",
    alt: "Mini store product details page preview"
  },
  {
    title: "One-Click Checkout",
    description: "Frictionless ordering. No forms to fill out. One tap generates a complete order summary and opens WhatsApp to send it directly to you.",
    src: "/images/dashboard-v2.png",
    alt: "Mini store checkout page preview"
  },
  {
    title: "Share & Earn",
    description: "Turn customers into advocates. Shoppers can upload photos of their purchase. Once you approve it, they get rewarded, and you get authentic social proof.",
    src: "/images/dashboard-v2.png",
    alt: "Mini store UGC upload page preview"
  },
  {
    title: "Redeem Discounts",
    description: "Drive repeat business. Approved photo uploads automatically send a unique discount code to the customer, incentivizing their next purchase.",
    src: "/images/dashboard-v2.png",
    alt: "Mini store discount code page preview"
  }
]

export function MiniStorePreview() {
  return (
    <section id="mini-store" className="py-8 md:py-12 bg-background scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
          <ScrollAnimation variant="fade-up">
            <p className="font-heading uppercase tracking-[0.2em] text-xs text-primary mb-4 font-medium">
              Mini store
            </p>
            <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground leading-[1.1] tracking-tight">
              A checkout experience your <br className="hidden md:block" />
               customers will <span className="text-primary">actually love.</span>
            </h2>
          </ScrollAnimation>

          <ScrollAnimation variant="fade-up" delay={0.1}>
            <p className="mt-6 text-base md:text-lg text-muted-foreground font-sans leading-relaxed">
              Fast, visual, and incredibly simple. We've stripped away the clutter of traditional e-commerce to give your social media traffic exactly what they want: a direct path to purchase.
            </p>
          </ScrollAnimation>
        </div>

        <div className="border-2 border-dotted border-primary/20 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {previews.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "h-full border-border/60 bg-background overflow-hidden",
                  // Grid span logic
                  index === 4 ? "lg:col-span-2" : "lg:col-span-1",
                  
                  // Border logic matching Features section exactly
                  // Item 0 (Top Left)
                  index === 0 ? "border-b lg:border-r" : "",
                  // Item 1 (Top Right)
                  index === 1 ? "border-b" : "",
                  // Item 2 (Mid Left)
                  index === 2 ? "border-b lg:border-b-0 lg:border-r" : "",
                  // Item 3 (Mid Right)
                  index === 3 ? "border-b lg:border-b-0" : "",
                  // Item 4 (Bottom Full Width)
                  index === 4 ? "border-t border-border/60" : ""
                )}
              >
                <div className="flex h-full flex-col">
                  <div className="p-8 pb-4 flex-1">
                    <h3 className="font-heading font-medium text-lg md:text-xl text-foreground mb-4">
                      {item.title.split(' ').map((word, i) => (
                        <span key={i} className={i === 0 ? "text-primary" : ""}>{word}{' '}</span>
                      ))}
                    </h3>
                    <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-6 px-6 pb-6">
                    <div className="relative group/img overflow-hidden rounded-xl">
                        <img
                            src={item.src}
                            alt={item.alt}
                            className="block w-full h-full object-contain object-bottom"
                            loading="lazy"
                        />
                        {/* Bottom Fade/Blur Effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
