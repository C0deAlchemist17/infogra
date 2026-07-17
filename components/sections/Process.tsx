'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Lightbulb, Code2, Rocket } from 'lucide-react'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const SectionBackground = dynamic(() => import('@/components/three/SectionBackground'), {
  ssr: false,
  loading: () => null
})
const CodeOrbit = dynamic(() => import('@/components/three/CodeOrbit'), {
  ssr: false,
  loading: () => null
})

const Process = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])

  const steps = [
    { icon: Search, step: '01', title: t(locale, 'process.step1'), description: t(locale, 'process.desc1'), details: ['Market Analysis', 'User Research', 'Competitor Audit', 'Strategy Planning'] },
    { icon: Lightbulb, step: '02', title: t(locale, 'process.step2'), description: t(locale, 'process.desc2'), details: ['Wireframing', 'UI Design', 'Prototyping', 'User Testing'] },
    { icon: Code2, step: '03', title: t(locale, 'process.step3'), description: t(locale, 'process.desc3'), details: ['Frontend Dev', 'Backend Systems', 'API Integration', 'Performance Optimization'] },
    { icon: Rocket, step: '04', title: t(locale, 'process.step4'), description: t(locale, 'process.desc4'), details: ['Deployment', 'Analytics Setup', 'SEO Optimization', 'Ongoing Support'] },
  ]

  return (
    <section ref={elementRef} className="relative py-40 bg-background-primary overflow-hidden">
      <SectionBackground opacity={0.12} />
      {/* Code Orbit floating in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-20">
          {isClient && <CodeOrbit />}
        </div>
        <div className="absolute left-0 bottom-0 w-72 h-72 opacity-15">
          {isClient && <CodeOrbit />}
        </div>
      </div>
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">{t(locale, 'process.badge')}</span>
          </div>
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">{t(locale, 'process.title')}</h2>
          <p className="text-body-lg md:text-h4 text-text-secondary max-w-3xl mx-auto leading-relaxed">{t(locale, 'process.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 60 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-accent-primary/30 to-accent-primary/10" />
              )}
              <Card className="h-full border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow text-center">
                <CardContent className="p-10">
                  <div className="text-caption font-bold text-accent-primary/50 mb-6 tracking-widest">{locale === 'ar' ? 'المرحلة' : 'STEP'} {step.step}</div>
                  <div className="w-24 h-24 bg-accent-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <step.icon className="w-12 h-12 text-accent-primary" />
                  </div>
                  <h3 className="text-h4 font-semibold text-text-primary mb-4">{step.title}</h3>
                  <p className="text-body text-text-secondary mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="text-small text-text-tertiary flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
