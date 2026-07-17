'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'
import dynamic from 'next/dynamic'

const SectionBackground = dynamic(() => import('@/components/three/SectionBackground'), {
  ssr: false,
  loading: () => null
})

const CaseStudies = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale, isRTL } = useLanguage()

  const caseStudies = [
    {
      title: t(locale, 'caseStudies.legalTitle'), industry: t(locale, 'caseStudies.legalIndustry'),
      challenge: t(locale, 'caseStudies.legalChallenge'), solution: t(locale, 'caseStudies.legalSolution'),
      results: [
        { label: t(locale, 'caseStudies.conversion'), value: '+150%' },
        { label: t(locale, 'caseStudies.loadTime'), value: '-60%' },
        { label: t(locale, 'caseStudies.engagement'), value: '+200%' }
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: t(locale, 'caseStudies.ecomTitle'), industry: t(locale, 'caseStudies.ecomIndustry'),
      challenge: t(locale, 'caseStudies.ecomChallenge'), solution: t(locale, 'caseStudies.ecomSolution'),
      results: [
        { label: t(locale, 'caseStudies.sales'), value: '+300%' },
        { label: t(locale, 'caseStudies.processing'), value: '-80%' },
        { label: t(locale, 'caseStudies.satisfaction'), value: '+95%' }
      ],
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section ref={elementRef} className="relative py-40 bg-background-secondary/50">
      <SectionBackground opacity={0.15} />
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">{t(locale, 'caseStudies.badge')}</span>
          </div>
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">{t(locale, 'caseStudies.title')}</h2>
          <p className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary max-w-3xl mx-auto leading-relaxed">{t(locale, 'caseStudies.subtitle')}</p>
        </motion.div>

        <div className="space-y-24">
          {caseStudies.map((study, index) => (
            <motion.div key={study.title} initial={{ opacity: 0, y: 80 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.3, duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }} className="group">
              <Card className="overflow-hidden border-border-subtle hover:border-accent-primary/30 transition-all duration-700 hover:shadow-glow">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className={`relative aspect-video lg:aspect-auto bg-gradient-to-br ${study.color} p-16 flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                        <Award className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="text-h3 font-bold text-white mb-3">{study.title}</h3>
                      <p className="text-body text-white/80">{study.industry}</p>
                    </div>
                  </div>
                  <CardContent className="p-16 flex flex-col justify-center">
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-small font-semibold text-accent-primary mb-3 uppercase tracking-wider">{t(locale, 'caseStudies.challenge')}</h4>
                        <p className="text-body text-text-secondary leading-relaxed">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-small font-semibold text-accent-primary mb-3 uppercase tracking-wider">{t(locale, 'caseStudies.solution')}</h4>
                        <p className="text-body text-text-secondary leading-relaxed">{study.solution}</p>
                      </div>
                      <div>
                        <h4 className="text-small font-semibold text-accent-primary mb-6 uppercase tracking-wider">{t(locale, 'caseStudies.results')}</h4>
                        <div className="grid grid-cols-3 gap-6">
                          {study.results.map((result) => (
                            <div key={result.label} className="text-center p-6 rounded-xl bg-background-tertiary/50">
                              <div className="text-h4 font-bold gradient-text mb-2">{result.value}</div>
                              <div className="text-caption text-text-tertiary">{result.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-fit group" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                        {t(locale, 'cta.readCaseStudy')}
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CaseStudies
