'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { faqData } from '@/data/faq'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-20 px-12">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-accent-primary text-body-lg tracking-widest uppercase font-semibold mb-6">Help Center</p>
          <h1 className="text-display font-bold text-text-primary mb-8">Frequently Asked Questions</h1>
          <p className="text-h2 text-text-secondary max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions about our services, process, and technology store.
          </p>
        </div>
      </section>

      <section className="py-20 px-12">
        <div className="container mx-auto max-w-4xl space-y-6">
          {faqData.map((faq, index) => (
            <div key={faq.q} className="card-premium rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-8 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-body-lg font-semibold text-text-primary pr-6">{faq.q}</span>
                <ChevronDown className={cn('w-6 h-6 text-accent-primary shrink-0 transition-transform', openIndex === index && 'rotate-180')} />
              </button>
              {openIndex === index && (
                <div className="px-8 pb-8 text-body-lg text-text-secondary leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
