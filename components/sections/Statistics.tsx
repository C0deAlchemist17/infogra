'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { TrendingUp, Users, Award, Target } from 'lucide-react'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const AnimatedCounter = ({ value, suffix = '', duration = 2 }: { value: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * value))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, value, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const Statistics = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { locale } = useLanguage()

  const stats = [
    { icon: TrendingUp, value: 150, suffix: '+', label: t(locale, 'stats.delivered'), description: 'Across multiple industries' },
    { icon: Users, value: 80, suffix: '+', label: t(locale, 'hero.stats.clients'), description: 'Global partnerships' },
    { icon: Award, value: 25, suffix: '+', label: t(locale, 'hero.stats.awards'), description: 'Industry recognition' },
    { icon: Target, value: 98, suffix: '%', label: t(locale, 'stats.satisfaction'), description: 'Exceeding expectations' },
  ]

  return (
    <section ref={elementRef} className="relative py-40 bg-background-primary">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-24">
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">{t(locale, 'stats.title')}</h2>
          <p className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary max-w-3xl mx-auto leading-relaxed">{t(locale, 'stats.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 60 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative p-10 rounded-2xl glass border border-border-subtle hover:border-accent-primary/30 transition-all duration-700 group hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-20 h-20 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700">
                <stat.icon className="w-10 h-10 text-accent-primary" />
              </div>
              <div className="text-display font-bold gradient-text mb-6">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={3} />
              </div>
              <div className="text-h4 font-semibold text-text-primary mb-3">{stat.label}</div>
              <div className="text-small text-text-tertiary leading-relaxed">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Statistics
