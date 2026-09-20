'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { Code, Smartphone, Database, Cloud, Brain, Palette, Cpu, Globe, Shield, Zap, Layers } from 'lucide-react'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const SectionBackground = dynamic(() => import('@/components/three/SectionBackground'), {
  ssr: false,
  loading: () => null
})
const DNAHelix = dynamic(() => import('@/components/three/DNAHelix'), {
  ssr: false,
  loading: () => null
})

const Technologies = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])

  const techCategories = [
    { icon: Code, title: t(locale, 'tech.frontend'), techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js'], color: 'from-blue-500 to-cyan-500' },
    { icon: Database, title: t(locale, 'tech.backend'), techs: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'], color: 'from-green-500 to-emerald-500' },
    { icon: Smartphone, title: t(locale, 'tech.mobile'), techs: ['React Native', 'Flutter', 'iOS', 'Android', 'PWA'], color: 'from-purple-500 to-pink-500' },
    { icon: Cloud, title: t(locale, 'tech.cloudDevops'), techs: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD'], color: 'from-orange-500 to-red-500' },
    { icon: Brain, title: t(locale, 'tech.aiMl'), techs: ['TensorFlow', 'PyTorch', 'OpenAI', 'Computer Vision', 'NLP'], color: 'from-indigo-500 to-purple-500' },
    { icon: Palette, title: t(locale, 'tech.design'), techs: ['Figma', 'Adobe XD', 'Motion Design', '3D Modeling', 'Brand Identity'], color: 'from-pink-500 to-rose-500' },
  ]

  const techHighlights = [
    { icon: Globe, label: 'Global Deployment', value: '50+ Regions' },
    { icon: Shield, label: 'Security First', value: 'Enterprise Grade' },
    { icon: Zap, label: 'Lightning Fast', value: '< 1s Response' },
    { icon: Layers, label: 'Scalable Stack', value: 'Microservices' }
  ]

  return (
    <section ref={elementRef} className="relative py-24 overflow-hidden">
      <SectionBackground opacity={0.15} />
      
      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8 hover:border-accent-primary/50 transition-all duration-500">
            <Cpu className="w-4 h-4 text-accent-highlight" />
            <span className="text-small text-text-secondary">{t(locale, 'tech.badge')}</span>
          </div>
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">
            {t(locale, 'tech.title')}
          </h2>
          <p className="text-body-lg md:text-h4 text-text-secondary max-w-3xl mx-auto leading-relaxed">{t(locale, 'tech.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {techCategories.map((category, index) => (
            <motion.div key={category.title} initial={{ opacity: 0, y: 60 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
              <Card className="h-full border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow group overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${category.color}`} />
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-background-tertiary to-background-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-border-subtle">
                    <category.icon className="w-8 h-8 text-accent-primary" />
                  </div>
                  <h3 className="text-h4 font-semibold text-text-primary mb-6 group-hover:text-accent-primary transition-colors">{category.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.techs.map((tech) => (
                      <span key={tech}
                        className="px-4 py-2 rounded-full text-small text-text-secondary glass border border-border-subtle hover:border-accent-primary/50 hover:text-accent-primary transition-all duration-300 cursor-default">{tech}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tech Highlights */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techHighlights.map((highlight, index) => (
            <motion.div key={highlight.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2 + index * 0.1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass rounded-xl p-6 border border-border-subtle hover:border-accent-primary/50 transition-all duration-500 group">
              <div className="w-12 h-12 bg-accent-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <highlight.icon className="w-6 h-6 text-accent-primary" />
              </div>
              <div className="text-small font-semibold text-text-primary mb-1">{highlight.label}</div>
              <div className="text-caption text-text-secondary">{highlight.value}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Technologies
