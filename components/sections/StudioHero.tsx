'use client'

import { useEffect, useRef, useState } from 'react'
import { memo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { Button } from '@/components/ui/button'
import { ArrowDown, Play, Star, Zap, Globe, Sparkles, ArrowRight, Cpu, Monitor, Smartphone, Palette } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'
import Image from 'next/image'

const StudioHero = memo(function StudioHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const { locale, isRTL } = useLanguage()
  
  // Parallax effects disabled for performance
  // const { scrollYProgress } = useScroll()
  // const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50])
  // const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  // const parallaxOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  
  const { elementRef: titleRef, hasBeenVisible } = useScrollTrigger({ 
    threshold: 0.1,
    triggerOnce: true 
  })

  useEffect(() => { setIsClient(true) }, [])

  // Mouse effect disabled for performance
  // useEffect(() => {
  //   if (typeof window === 'undefined') return
  //   const handleMouseMove = (e: MouseEvent) => {
  //     const { clientX, clientY } = e
  //     setMousePosition({ x: clientX, y: clientY })
  //     const flare = document.querySelector('.lens-flare') as HTMLElement
  //     if (flare) { flare.style.left = `${clientX}px`; flare.style.top = `${clientY}px`; flare.classList.add('active') }
  //   }
  //   const handleMouseLeave = () => { document.querySelector('.lens-flare')?.classList.remove('active') }
  //   document.addEventListener('mousemove', handleMouseMove)
  //   document.addEventListener('mouseleave', handleMouseLeave)
  //   return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseleave', handleMouseLeave) }
  // }, [])

  // Floating elements disabled for performance
  // const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])
  // useEffect(() => {
  //   setFloatingElements(Array.from({ length: 8 }, (_, i) => ({
  //     id: i, x: Math.random() * 100, y: Math.random() * 100,
  //     size: Math.random() * 30 + 15, delay: i * 0.4
  //   })))
  // }, [])

  const stats = [
    { icon: Globe, label: t(locale, 'hero.stats.projects'), value: '150+' },
    { icon: Star, label: t(locale, 'hero.stats.clients'), value: '80+' },
    { icon: Zap, label: t(locale, 'hero.stats.experience'), value: '8+' },
    { icon: Sparkles, label: t(locale, 'hero.stats.awards'), value: '25+' }
  ]

  const techShowcase = [
    { icon: Cpu, label: 'Hardware', color: 'from-blue-500 to-cyan-500' },
    { icon: Monitor, label: 'Software', color: 'from-purple-500 to-pink-500' },
    { icon: Smartphone, label: 'Mobile', color: 'from-green-500 to-emerald-500' },
    { icon: Palette, label: 'Design', color: 'from-orange-500 to-red-500' }
  ]

  return (
    <section ref={containerRef} id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label={isRTL ? 'القسم الرئيسي' : 'Hero section'}
      style={{ minHeight: '100vh' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>

      <motion.div ref={titleRef} className="relative z-10 text-center max-w-7xl mx-auto px-12"
        // Parallax disabled for performance
        // style={{ y: parallaxY, scale: parallaxScale, opacity: parallaxOpacity }}
      >
        <motion.div initial={{ opacity: 0, y: 30 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-gray-700 hover:border-blue-500/50 transition-all duration-500">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-body text-gray-300">{t(locale, 'hero.badge')}</span>
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 50 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-display-lg md:text-display lg:text-display-xl font-bold text-white mb-8 leading-tight">
          <span className="gradient-text">{t(locale, 'hero.title.line1')}</span><br />
          <span className="text-white">{t(locale, 'hero.title.line2')}</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-body md:text-body-lg lg:text-h2 text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          {t(locale, 'hero.subtitle')}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
          <Button size="lg" variant="premium" className="group text-body-lg px-10 py-5">
            {t(locale, 'cta.startProject')}
            <ArrowRight className={`w-6 h-6 ${isRTL ? 'mr-4 rotate-180' : 'ml-4'} group-hover:translate-x-1.5 transition-transform duration-300`} />
          </Button>
          <Button size="lg" variant="outline" className="group text-body-lg px-10 py-5">
            <Play className={`w-6 h-6 ${isRTL ? 'ml-4' : 'mr-4'} group-hover:scale-110 transition-transform duration-300`} />
            {t(locale, 'cta.viewWork')}
          </Button>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
          {stats.map((stat, index) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 2.4 + index * 0.2, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center p-10 rounded-2xl glass hover:bg-gray-800/50 transition-all duration-700 hover:shadow-glow group">
              <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                <stat.icon className="w-12 h-12 text-blue-500" />
              </div>
              <div className="text-display font-bold text-white mb-4">{stat.value}</div>
              <div className="text-body text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Showcase */}
        <motion.div initial={{ opacity: 0, y: 30 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.8, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {techShowcase.map((tech, index) => (
            <motion.div key={tech.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 3 + index * 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass rounded-xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1 group">
              <div className={`w-20 h-20 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <tech.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-body font-medium text-white">{tech.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }}
        animate={hasBeenVisible ? { opacity: 1 } : {}}
        transition={{ delay: 3.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <motion.div animate={{ y: [0, 16, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-4">
          <span className="text-small text-gray-400">{t(locale, 'hero.scroll')}</span>
          <ArrowDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  )
})

export default StudioHero
