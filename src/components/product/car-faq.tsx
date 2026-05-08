'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FaqItem {
  q: string
  a: string
}

export default function CarFaq({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Pertanyaan Umum</h2>

      <Accordion className="w-full" type='single'>
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
