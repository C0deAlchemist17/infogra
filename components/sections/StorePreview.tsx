'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const StorePreview = memo(function StorePreview() {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { locale } = useLanguage()

  return (
    <section ref={elementRef} className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={hasBeenVisible ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="text-body font-bold text-white tracking-wider uppercase">
              Coming Soon
            </span>
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={hasBeenVisible ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-display font-bold text-white mb-4 leading-tight"
          >
            {t(locale, 'store.title')}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={hasBeenVisible ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-body-lg text-white/90 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            {t(locale, 'store.subtitle')}
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={hasBeenVisible ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-accent-primary transition-all duration-300"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
            <Button
              size="lg"
              className="bg-white text-accent-primary hover:bg-background-tertiary transition-all duration-300"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})

export default StorePreview
