'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Code, Smartphone, Palette, Megaphone, Brain, Cloud, Cpu, BarChart, ArrowRight, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'
import Link from 'next/link'

const StudioServices = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const [expandedService, setExpandedService] = useState<number | null>(null)
  const { locale, isRTL } = useLanguage()

  const services = [
    { icon: Code, title: 'services.webDev', details: t(locale, 'services.webDev'), features: [t(locale, 'services.feature.webApps'), t(locale, 'services.feature.ecommerce'), t(locale, 'services.feature.cms'), t(locale, 'services.feature.api')], color: 'from-blue-500 to-cyan-500' },
    { icon: Smartphone, title: 'services.mobileApps', details: t(locale, 'services.mobileApps'), features: [t(locale, 'services.feature.ios'), t(locale, 'services.feature.android'), t(locale, 'services.feature.crossPlatform'), t(locale, 'services.feature.maintenance')], color: 'from-purple-500 to-pink-500' },
    { icon: Palette, title: 'services.design', details: t(locale, 'services.design'), features: [t(locale, 'services.feature.research'), t(locale, 'services.feature.wireframing'), t(locale, 'services.feature.prototyping'), t(locale, 'services.feature.designSystems')], color: 'from-pink-500 to-rose-500' },
    { icon: Megaphone, title: 'services.marketing', details: t(locale, 'services.marketing'), features: [t(locale, 'services.feature.seo'), t(locale, 'services.feature.socialMedia'), t(locale, 'services.feature.content'), t(locale, 'services.feature.ppc')], color: 'from-orange-500 to-red-500' },
    { icon: Brain, title: 'services.aiSolutions', details: t(locale, 'services.aiSolutions'), features: [t(locale, 'services.feature.ml'), t(locale, 'services.feature.nlp'), t(locale, 'services.feature.cv'), t(locale, 'services.feature.automation')], color: 'from-indigo-500 to-purple-500' },
    { icon: Cloud, title: 'services.cloudServices', details: t(locale, 'services.cloudServices'), features: [t(locale, 'services.feature.migration'), t(locale, 'services.feature.devops'), t(locale, 'services.feature.infrastructure'), t(locale, 'services.feature.security')], color: 'from-green-500 to-emerald-500' },
    { icon: Cpu, title: 'services.customSoftware', details: t(locale, 'services.customSoftware'), features: [t(locale, 'services.feature.enterprise'), t(locale, 'services.feature.saas'), t(locale, 'services.feature.integration'), t(locale, 'services.feature.consulting')], color: 'from-teal-500 to-cyan-500' },
    { icon: BarChart, title: 'services.analytics', details: t(locale, 'services.analytics'), features: [t(locale, 'services.feature.visualization'), t(locale, 'services.feature.predictive'), t(locale, 'services.feature.reporting'), t(locale, 'services.feature.dashboards')], color: 'from-amber-500 to-orange-500' }
  ]

  return (
    <section ref={elementRef} id="services" className="relative py-32" aria-labelledby="services-heading">
      <div className="container mx-auto px-[5%] max-w-[1600px] relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-20">
          <h2 id="services-heading" className="text-display-xl md:text-display lg:text-display-xl leading-[1.2] mb-8 font-bold uppercase tracking-tight text-white" style={{ fontFamily: 'system-ui, serif' }}>
            {t(locale, 'services.title')}
          </h2>
          <p className="text-body-lg md:text-h1 lg:text-display text-white/70 font-light leading-relaxed max-w-3xl mx-auto">
            {t(locale, 'services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 60 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
              <Card className={`relative overflow-hidden transition-all duration-700 cursor-pointer h-full ${expandedService === index ? 'border-accent-primary shadow-glow' : 'border-border-subtle hover:border-accent-primary/50 hover:-translate-y-1 hover:shadow-lg'}`}>
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <CardContent className="p-10">
                  <div className={`w-32 h-32 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700 shadow-lg`}>
                    <service.icon className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-display font-semibold text-text-primary mb-4 group-hover:text-accent-primary transition-colors">{t(locale, service.title as any)}</h3>
                  <p className="text-body-lg text-text-secondary mb-6 leading-relaxed">{t(locale, 'services.subtitle')}</p>

                  <motion.div initial={false}
                    animate={{ height: expandedService === index ? 'auto' : 0, opacity: expandedService === index ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
                    <div className="pt-6 border-t border-border-subtle">
                      <p className="text-body-lg text-text-secondary mb-6 leading-relaxed">{service.details}</p>
                      <ul className="space-y-4 mb-8">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-body-lg text-text-tertiary">
                            <ChevronRight className={`w-6 h-6 text-accent-primary ${isRTL ? 'rotate-180' : ''}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button size="lg" variant="outline" className="w-full group">
                        {t(locale, 'cta.learnMore')}
                        <ArrowRight className={`w-6 h-6 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                      </Button>
                    </div>
                  </motion.div>

                  <div className={`flex items-center gap-2 text-accent-primary mt-6 ${expandedService === index ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
                    <span className="text-body-lg font-medium">{t(locale, 'services.explore')}</span>
                    <ArrowRight className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA for services */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }} className="mt-20 text-center">
          <Link href="/contact">
            <Button size="lg" variant="premium" className="group text-body-lg px-10 py-5">
              {t(locale, 'cta.startProject')}
              <ArrowRight className={`w-6 h-6 ${isRTL ? 'mr-4 rotate-180' : 'ml-4'} group-hover:translate-x-1 transition-transform`} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default StudioServices
