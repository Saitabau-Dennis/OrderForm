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
    question: "Do customers pay on OrderForm?",
    answer: "No. Customers browse your products on your store, then place their order through WhatsApp. You handle payment the same way you already do."
  },
  {
    question: "Where do orders go?",
    answer: "Orders are sent as pre-filled WhatsApp messages directly to your WhatsApp number."
  },
  {
    question: "Do customers need to create an account?",
    answer: "No. Customers can place an order without signing up."
  },
  {
    question: "Can I use OrderForm with Instagram or TikTok?",
    answer: "Yes. You can place your store link in any social media bio."
  },
  {
    question: "Is OrderForm hard to set up?",
    answer: "No. You can create your store and add products in just a few minutes."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-12 md:py-20 scroll-mt-28">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollAnimation className="text-center mb-16">
          <p className="font-heading uppercase tracking-[0.2em] text-sm text-muted-foreground mb-4">
            Support
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Frequently asked questions
          </h2>
        </ScrollAnimation>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <ScrollAnimation key={index} delay={index * 0.1}>
              <AccordionItem value={`item-${index}`} className="border border-border/60 bg-background rounded-2xl px-2 shadow-sm hover:shadow-md transition-all duration-300">
                <AccordionTrigger className="text-base md:text-lg font-heading font-medium text-foreground hover:no-underline hover:text-primary px-4 py-6 text-left [&[data-state=open]]:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans font-normal text-base leading-relaxed px-4 pb-6">
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
