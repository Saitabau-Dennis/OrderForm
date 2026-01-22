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
    <section id="faq" className="py-8 md:py-12 scroll-mt-28 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="font-heading uppercase tracking-[0.2em] text-sm text-primary mb-4 font-medium">
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-medium text-foreground mb-6 tracking-tight">
            Need help? <br className="hidden md:block" />
            <span className="text-primary">We&apos;ve got you covered.</span>
          </h2>
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Explore answers to common queries and get the information you need to make the most of OrderForm.
          </p>
        </ScrollAnimation>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <ScrollAnimation key={index} delay={index * 0.1}>
              <AccordionItem 
                value={`item-${index}`} 
                className="border border-border bg-background rounded-xl px-2 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-base md:text-lg font-heading font-medium text-foreground hover:no-underline hover:text-primary px-4 py-5 text-left [&[data-state=open]]:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans font-normal text-base leading-relaxed px-4 pb-5">
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
