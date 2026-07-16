'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const Testimonials = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const [activeIndex, setActiveIndex] = useState(0)
  const { locale } = useLanguage()

  const testimonials = [
    { name: 'Ahmed Hassan', role: 'CEO, TechVentures', content: 'INFOGRA transformed our digital presence completely. Their attention to detail and technical expertise is unmatched. The new platform increased our conversions by 200%.', rating: 5, avatar: 'AH' },
    { name: 'Sara El-Kholy', role: 'Director, Creative Studio', content: 'Working with INFOGRA was an absolute pleasure. They understood our vision perfectly and delivered a website that exceeded our expectations. Highly recommended!', rating: 5, avatar: 'SK' },
    { name: 'Mohamed Farid', role: 'Founder, E-Commerce Plus', content: 'The e-commerce platform INFOGRA built for us is phenomenal. Performance, design, and functionality are all world-class. Our sales have tripled since launch.', rating: 5, avatar: 'MF' },
    { name: 'Nour Ibrahim', role: 'Marketing Head, Global Brand', content: 'From concept to execution, INFOGRA delivered excellence. Their Three.js integration and animations are incredibly impressive. A true digital partner.', rating: 5, avatar: 'NI' }
  ]

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section ref={elementRef} className="relative py-40 bg-background-secondary/50 overflow-hidden">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">{t(locale, 'testimonials.badge')}</span>
          </div>
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">
            {t(locale, 'testimonials.title')}
          </h2>
          <p className="text-body-lg md:text-h4 text-text-secondary max-w-3xl mx-auto leading-relaxed">{t(locale, 'testimonials.subtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 60 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="max-w-4xl mx-auto">
          <Card className="glass-strong border-border-subtle">
            <CardContent className="p-16 relative">
              <Quote className="absolute top-8 left-8 w-16 h-16 text-accent-primary/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-8">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent-primary fill-accent-primary" />
                  ))}
                </div>
                <p className="text-h3-sm md:text-h3 text-text-primary mb-10 leading-relaxed italic">
                  &ldquo;{testimonials[activeIndex].content}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{testimonials[activeIndex].avatar}</span>
                    </div>
                    <div>
                      <div className="text-h4 font-semibold text-text-primary">{testimonials[activeIndex].name}</div>
                      <div className="text-small text-text-secondary">{testimonials[activeIndex].role}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={prev} className="w-12 h-12 rounded-xl glass border border-border-subtle flex items-center justify-center hover:border-accent-primary/50 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-text-secondary" />
                    </button>
                    <button onClick={next} className="w-12 h-12 rounded-xl glass border border-border-subtle flex items-center justify-center hover:border-accent-primary/50 transition-colors">
                      <ChevronRight className="w-5 h-5 text-text-secondary" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button key={index} onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-accent-primary w-8' : 'bg-border-subtle hover:bg-accent-primary/50'}`} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
