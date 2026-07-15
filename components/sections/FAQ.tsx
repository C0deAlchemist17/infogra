'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { faqData } from '@/data/faq'

const FAQ = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section ref={elementRef} className="relative py-40 bg-background-primary overflow-hidden">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">Help Center</span>
          </div>
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-body-lg md:text-h4 text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our services, process, and technology store
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqData.map((faq, index) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.8 }}
            >
              <Card
                className={cn(
                  "transition-all duration-300",
                  openIndex === index ? "border-accent-primary/50 shadow-glow" : "border-border-subtle"
                )}
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    onMouseEnter={addHoverEffect}
                    onMouseLeave={removeHoverEffect}
                    className="w-full flex items-center justify-between p-8 text-left"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-body font-semibold text-text-primary pr-8">{faq.q}</span>
                    <ChevronDown className={cn('w-5 h-5 text-accent-primary shrink-0 transition-transform duration-300', openIndex === index && 'rotate-180')} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-body text-text-secondary leading-relaxed">{faq.a}</div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
