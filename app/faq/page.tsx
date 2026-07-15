'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { faqData } from '@/data/faq'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-16 px-6 md:px-8">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-accent-primary text-sm tracking-widest uppercase font-semibold mb-4">Help Center</p>
          <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-6">Frequently Asked Questions</h1>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Find answers to common questions about our services, process, and technology store.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-8">
        <div className="container mx-auto max-w-3xl space-y-4">
          {faqData.map((faq, index) => (
            <div key={faq.q} className="card-premium rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-body font-semibold text-text-primary pr-4">{faq.q}</span>
                <ChevronDown className={cn('w-5 h-5 text-accent-primary shrink-0 transition-transform', openIndex === index && 'rotate-180')} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-body text-text-secondary">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
