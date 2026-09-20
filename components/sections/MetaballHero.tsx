'use client'

import { useEffect, useRef, useState } from 'react'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { Button } from '@/components/ui/button'
import { ArrowDown, Play, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'
import dynamic from 'next/dynamic'

const MetaballShaderBackground = dynamic(() => import('@/components/three/MetaballShaderBackground'), {
  ssr: false,
  loading: () => null
})

const MetaballHero = memo(function MetaballHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { locale, isRTL } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  
  const { elementRef: titleRef, hasBeenVisible } = useScrollTrigger({ 
    threshold: 0.1,
    triggerOnce: true 
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section ref={containerRef} id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label={isRTL ? 'القسم الرئيسي' : 'Hero section'}
      style={{ minHeight: '100vh', paddingTop: '80px' }}>

      {/* Complex shader metaball background */}
      {isClient && <MetaballShaderBackground />}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-black pointer-events-none" />

      <motion.div ref={titleRef} className="relative z-10 text-center max-w-7xl mx-auto px-12">
        <motion.h1 initial={{ opacity: 0, y: 50 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-h1 md:text-display lg:text-display-xl leading-[1.2] mb-16 font-bold uppercase tracking-tight text-white"
          style={{ fontFamily: 'system-ui, serif' }}
        >
          <span className="gradient-text">{t(locale, 'hero.title.line1')}</span><br />
          <span className="text-white">{t(locale, 'hero.title.line2')}</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-body-lg md:text-h2 lg:text-h1 text-white/70 font-light leading-relaxed max-w-4xl mx-auto mb-20">
          {t(locale, 'hero.subtitle')}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-10 justify-center items-center mb-32">
          <Button size="lg" variant="premium" className="group text-body-lg px-10 py-5">
            {t(locale, 'cta.startProject')}
            <ArrowRight className={`w-6 h-6 ${isRTL ? 'mr-4 rotate-180' : 'ml-4'} group-hover:translate-x-1.5 transition-transform duration-300`} />
          </Button>
          <Button size="lg" variant="outline" className="group text-body-lg px-10 py-5">
            <Play className={`w-6 h-6 ${isRTL ? 'ml-4' : 'mr-4'} group-hover:scale-110 transition-transform duration-300`} />
            {t(locale, 'cta.viewWork')}
          </Button>
        </motion.div>

        {/* Hero stats/features */}
        <motion.div initial={{ opacity: 0, y: 30 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-display font-bold gradient-text mb-4">150+</div>
            <div className="text-body text-white/60">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-display font-bold gradient-text mb-4">80+</div>
            <div className="text-body text-white/60">Clients</div>
          </div>
          <div className="text-center">
            <div className="text-display font-bold gradient-text mb-4">8+</div>
            <div className="text-body text-white/60">Years</div>
          </div>
          <div className="text-center">
            <div className="text-display font-bold gradient-text mb-4">25+</div>
            <div className="text-body text-white/60">Awards</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }}
        animate={hasBeenVisible ? { opacity: 1 } : {}}
        transition={{ delay: 2.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <motion.div animate={{ y: [0, 12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3">
          <span className="text-body text-white/50">{t(locale, 'hero.scroll')}</span>
          <ArrowDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  )
})

export default MetaballHero
