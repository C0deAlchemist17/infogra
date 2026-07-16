'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { Button } from '@/components/ui/button'
import { ArrowDown, Play, Star, Zap, Globe, Sparkles, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'), {
  ssr: false,
  loading: () => null
})

const StudioHero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const { locale, isRTL } = useLanguage()
  
  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const parallaxOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  
  const { elementRef: titleRef, hasBeenVisible } = useScrollTrigger({ 
    threshold: 0.1,
    triggerOnce: true 
  })

  useEffect(() => { setIsClient(true) }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      setMousePosition({ x: clientX, y: clientY })
      const flare = document.querySelector('.lens-flare') as HTMLElement
      if (flare) { flare.style.left = `${clientX}px`; flare.style.top = `${clientY}px`; flare.classList.add('active') }
    }
    const handleMouseLeave = () => { document.querySelector('.lens-flare')?.classList.remove('active') }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseleave', handleMouseLeave) }
  }, [])

  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])
  useEffect(() => {
    setFloatingElements(Array.from({ length: 6 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 20 + 10, delay: i * 0.5
    })))
  }, [])

  const stats = [
    { icon: Globe, label: t(locale, 'hero.stats.projects'), value: '150+' },
    { icon: Star, label: t(locale, 'hero.stats.clients'), value: '80+' },
    { icon: Zap, label: t(locale, 'hero.stats.experience'), value: '8+' },
    { icon: Sparkles, label: t(locale, 'hero.stats.awards'), value: '25+' }
  ]

  return (
    <section ref={containerRef} id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-primary"
      aria-label={isRTL ? 'القسم الرئيسي' : 'Hero section'}
      style={{ minHeight: '100vh' }}>
      <div className="absolute inset-0">
        {isClient && <ThreeScene />}
        <div className="grid-overlay" />
        <div className="noise-overlay" />
        <div className="lens-flare" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-secondary/20 rounded-full blur-3xl" />
        {floatingElements.map((el) => (
          <motion.div key={el.id} className="absolute rounded-full bg-accent-primary/10"
            style={{ left: `${el.x}%`, top: `${el.y}%`, width: `${el.size}px`, height: `${el.size}px` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 6 + el.id, repeat: Infinity, ease: 'easeInOut', delay: el.delay }} />
        ))}
      </div>

      <motion.div ref={titleRef} className="relative z-10 text-center max-w-7xl mx-auto px-8"
        style={{ y: parallaxY, scale: parallaxScale, opacity: parallaxOpacity }}>
        <motion.div initial={{ opacity: 0, y: 30 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle">
            <Sparkles className="w-4 h-4 text-accent-highlight" />
            <span className="text-small text-text-secondary">{t(locale, 'hero.badge')}</span>
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 50 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-display-xs md:text-display lg:text-display-xl font-bold text-text-primary mb-12 leading-tight">
          <span className="gradient-text">{t(locale, 'hero.title.line1')}</span><br />
          <span className="text-text-primary">{t(locale, 'hero.title.line2')}</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary mb-16 max-w-4xl mx-auto leading-relaxed">
          {t(locale, 'hero.subtitle')}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24">
          <Button size="xl" variant="premium" className="group">
            {t(locale, 'cta.startProject')}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
          </Button>
          <Button size="xl" variant="outline" className="group">
            <Play className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t(locale, 'cta.viewWork')}
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 2.4 + index * 0.2, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center p-8 rounded-2xl glass hover:bg-background-tertiary/50 transition-all duration-700">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <stat.icon className="w-8 h-8 text-accent-primary" />
              </div>
              <div className="text-h3 font-bold text-text-primary mb-3">{stat.value}</div>
              <div className="text-small text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }}
        animate={hasBeenVisible ? { opacity: 1 } : {}}
        transition={{ delay: 3, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <motion.div animate={{ y: [0, 16, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-4">
          <span className="text-small text-text-secondary">{t(locale, 'hero.scroll')}</span>
          <ArrowDown className="w-5 h-5 text-text-secondary" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default StudioHero
