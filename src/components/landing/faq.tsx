"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

const faqs = [
  {
    question: "How do I get paid?",
    answer: "Directly to your pocket. You arrange payment (M-Pesa, Cash, Bank Transfer) directly with the customer on WhatsApp. We take 0% commission on your sales."
  },
  {
    question: "Do my customers need to download an app?",
    answer: "No app required. Your store works instantly in any browser (Chrome, Safari, Instagram in-app browser). Customers browse, cart, and order without creating an account."
  },
  {
    question: "How do I receive orders?",
    answer: "Instantly on WhatsApp. When a customer places an order, you receive a pre-filled message with their details, items, total price, and location. You can reply immediately to confirm."
  },
  {
    question: "Is there a limit on how many orders I can get?",
    answer: "Zero limits. You can receive unlimited orders on both the Starter (Free) and Business plans. We want you to grow as big as possible."
  },
  {
    question: "What happens if I stop paying for the Business plan?",
    answer: "No stress. Your store will automatically stay online on the Free plan. You'll just be limited to 5 visible products until you decide to upgrade again."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 scroll-mt-28 bg-background relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <ScrollAnimation className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-primary/20 text-primary text-[10px] font-medium mb-4 uppercase tracking-widest">
            FAQ
          </div>
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-foreground mb-6 tracking-tight">
            Need help? <span className="text-primary">We&apos;ve got you covered.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Explore answers to common queries and get the information you need to make the most of OrderForm.
          </p>
        </ScrollAnimation>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <ScrollAnimation key={index} delay={index * 0.05}>
              <AccordionItem 
                value={`item-${index}`} 
                className="border-b border-border/60 last:border-0"
              >
                <AccordionTrigger className="text-base md:text-lg font-heading font-medium text-foreground hover:no-underline hover:text-primary py-6 text-left [&[data-state=open]]:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans font-normal text-sm md:text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </ScrollAnimation>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
