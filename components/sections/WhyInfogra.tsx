'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Zap, Globe, Shield, Clock, Heart } from 'lucide-react'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const WhyInfogra = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale } = useLanguage()

  const reasons = [
    { icon: Zap, title: t(locale, 'why.fast'), description: t(locale, 'why.fastDesc') },
    { icon: Globe, title: t(locale, 'why.global'), description: t(locale, 'why.globalDesc') },
    { icon: Shield, title: t(locale, 'why.security'), description: t(locale, 'why.securityDesc') },
    { icon: Clock, title: t(locale, 'why.ontime'), description: t(locale, 'why.ontimeDesc') },
    { icon: Heart, title: t(locale, 'why.client'), description: t(locale, 'why.clientDesc') },
    { icon: CheckCircle, title: t(locale, 'why.results'), description: t(locale, 'why.resultsDesc') },
  ]

  return (
    <section ref={elementRef} className="relative py-40 bg-background-secondary/50 overflow-hidden">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">{t(locale, 'why.badge')}</span>
          </div>
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">{t(locale, 'why.title')}</h2>
          <p className="text-body-lg md:text-h4 text-text-secondary max-w-3xl mx-auto leading-relaxed">{t(locale, 'why.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div key={reason.title} initial={{ opacity: 0, y: 40 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
              <Card className="h-full border-border-subtle hover:border-accent-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow group">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-primary/20 transition-colors duration-500">
                    <reason.icon className="w-8 h-8 text-accent-primary" />
                  </div>
                  <h3 className="text-h4 font-semibold text-text-primary mb-4">{reason.title}</h3>
                  <p className="text-body text-text-secondary leading-relaxed">{reason.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyInfogra
