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
    question: "How does the WhatsApp integration work?",
    answer: "When a customer completes their order, the system automatically generates a pre-filled WhatsApp message with their order details. They simply hit send to confirm the order with you directly."
  },
  {
    question: "Do customers need to download an app?",
    answer: "No. Your customers don't need to download anything or create an account. They just click your link, browse, and order."
  },
  {
    question: "How do I accept payments?",
    answer: "You continue to accept payments via M-Pesa or cash, just like you always have. OrderForm simply structures the order so you know exactly what to charge."
  },
  {
    question: "Can I use this on TikTok and Facebook?",
    answer: "Yes! OrderForm gives you a unique link that works perfectly in your Instagram bio, TikTok profile, Facebook posts, or anywhere else you share links."
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
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Frequently asked questions
          </h2>
        </ScrollAnimation>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <ScrollAnimation key={index} delay={index * 0.1}>
              <AccordionItem value={`item-${index}`} className="border border-border/60 bg-background rounded-2xl px-2 shadow-sm hover:shadow-md transition-all duration-300">
                <AccordionTrigger className="text-lg md:text-xl font-heading font-medium text-foreground hover:no-underline hover:text-primary px-4 py-6 text-left [&[data-state=open]]:text-primary transition-colors">
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
