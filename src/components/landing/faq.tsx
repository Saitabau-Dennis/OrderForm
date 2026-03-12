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
    answer: "Directly to your pocket. You arrange payment (Cash, Bank Transfer, Mobile Money) directly with the customer on WhatsApp. We take 0% commission on your sales."
  },
  {
    question: "Do my customers need to download an app?",
    answer: "No app required. Your store works instantly in any browser (Chrome, Safari, Instagram in-app browser). Customers browse, cart, and order without creating an account."
  },
  {
    question: "How do I receive orders?",
    answer: "Orders are sent to your WhatsApp as a structured message with customer details, items, variants, notes, and totals. The same order is also saved in your dashboard for tracking."
  },
  {
    question: "Can I track and update order status?",
    answer: "Yes. You can open order details in your dashboard, update status (pending, processing, completed, or cancelled), and export orders when needed."
  },
  {
    question: "How do review rewards and discount codes work?",
    answer: "Customers can submit a photo review with their order reference. Once approved, OrderForm generates a one-time discount code linked to that customer for future checkout use."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-10 md:py-14 scroll-mt-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollAnimation variant="fade-up">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
            <div className="space-y-4">
              <h2 className="font-heading text-2xl md:text-4xl font-normal tracking-[-0.02em] text-foreground">
                FAQs
              </h2>
              <p className="text-sm md:text-base font-semibold text-muted-foreground">
                Your questions answered
              </p>
              <p className="max-w-sm font-sans text-sm md:text-base leading-relaxed text-muted-foreground">
                Explore answers to common queries and get the information you need to make the most of OrderForm.
              </p>
              <p className="max-w-sm font-sans text-sm md:text-base leading-relaxed text-muted-foreground">
                Need more help? Contact our{" "}
                <a
                  href="mailto:support@orderform.store"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  customer support team
                </a>
                .
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-black/10 last:border-b"
                >
                  <AccordionTrigger className="py-4 text-left font-heading text-base md:text-lg font-medium tracking-[-0.01em] text-foreground hover:no-underline [&>svg]:text-muted-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pr-6 font-sans text-sm md:text-base leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
