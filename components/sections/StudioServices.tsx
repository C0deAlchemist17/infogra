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

const StudioServices = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const [expandedService, setExpandedService] = useState<number | null>(null)
  const { locale, isRTL } = useLanguage()

  const services = [
    { icon: Code, title: 'services.webDev', details: 'Full-stack development using React, Next.js, Node.js, and more. We build scalable, performant web solutions.', features: ['Custom Web Apps', 'E-commerce Solutions', 'CMS Development', 'API Integration'] },
    { icon: Smartphone, title: 'services.mobileApps', details: 'iOS and Android development using React Native and Flutter. We create seamless mobile experiences.', features: ['iOS Development', 'Android Development', 'Cross-Platform', 'App Maintenance'] },
    { icon: Palette, title: 'services.design', details: 'Beautiful, intuitive interfaces designed with user experience at the core. From wireframes to final designs.', features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'] },
    { icon: Megaphone, title: 'services.marketing', details: 'Comprehensive digital marketing to grow your online presence and drive conversions.', features: ['SEO Optimization', 'Social Media', 'Content Marketing', 'PPC Advertising'] },
    { icon: Brain, title: 'services.aiSolutions', details: 'Cutting-edge AI and ML solutions to automate processes and gain insights from data.', features: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Automation'] },
    { icon: Cloud, title: 'services.cloudServices', details: 'Cloud architecture, migration, and management for optimal performance and cost-efficiency.', features: ['Cloud Migration', 'DevOps', 'Infrastructure', 'Security'] },
    { icon: Cpu, title: 'services.customSoftware', details: 'Bespoke software development to solve your unique business challenges.', features: ['Enterprise Software', 'SaaS Products', 'Integration', 'Consulting'] },
    { icon: BarChart, title: 'services.analytics', details: 'Transform your data into actionable insights with advanced analytics solutions.', features: ['Data Visualization', 'Predictive Analytics', 'Reporting', 'Dashboards'] }
  ]

  return (
    <section ref={elementRef} id="services" className="relative py-40 bg-background-secondary/50" aria-labelledby="services-heading">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">{t(locale, 'services.badge')}</span>
          </div>
          <h2 id="services-heading" className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">{t(locale, 'services.title')}</h2>
          <p className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary max-w-3xl mx-auto leading-relaxed">{t(locale, 'services.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 60 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
              <Card className={`relative overflow-hidden transition-all duration-700 cursor-pointer h-full ${expandedService === index ? 'border-accent-primary shadow-glow' : 'border-border-subtle hover:border-accent-primary/50 hover:-translate-y-2'}`}
                onClick={() => setExpandedService(expandedService === index ? null : index)}>
                <CardContent className="p-10">
                  <div className="w-20 h-20 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700">
                    <service.icon className="w-10 h-10 text-accent-primary" />
                  </div>
                  <h3 className="text-h4 font-semibold text-text-primary mb-4">{t(locale, service.title as any)}</h3>
                  <p className="text-body text-text-secondary mb-6 leading-relaxed">{t(locale, 'services.subtitle')}</p>

                  <motion.div initial={false}
                    animate={{ height: expandedService === index ? 'auto' : 0, opacity: expandedService === index ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
                    <div className="pt-6 border-t border-border-subtle">
                      <p className="text-small text-text-secondary mb-6 leading-relaxed">{service.details}</p>
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-small text-text-tertiary">
                            <ChevronRight className={`w-4 h-4 text-accent-primary ${isRTL ? 'rotate-180' : ''}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button size="sm" variant="outline" className="w-full group">
                        {t(locale, 'cta.learnMore')}
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                      </Button>
                    </div>
                  </motion.div>

                  <div className={`flex items-center gap-2 text-accent-primary mt-6 ${expandedService === index ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
                    <span className="text-small font-medium">{t(locale, 'services.explore')}</span>
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StudioServices
