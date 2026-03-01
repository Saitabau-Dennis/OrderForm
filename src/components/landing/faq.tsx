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
    <section id="faq" className="py-16 md:py-24 scroll-mt-28">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollAnimation variant="fade-up">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="space-y-5">
              <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground">
                FAQs
              </h2>
              <p className="text-base md:text-lg font-semibold text-muted-foreground">
                Your questions answered
              </p>
              <p className="max-w-sm font-sans text-base leading-relaxed text-muted-foreground">
                Explore answers to common queries and get the information you need to make the most of OrderForm.
              </p>
              <p className="max-w-sm font-sans text-base leading-relaxed text-muted-foreground">
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
                  <AccordionTrigger className="py-5 text-left font-heading text-lg md:text-xl font-semibold tracking-[-0.01em] text-foreground hover:no-underline [&>svg]:text-muted-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pr-6 font-sans text-base leading-relaxed text-muted-foreground">
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
