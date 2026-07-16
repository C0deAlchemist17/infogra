'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const ContactCTA = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale, isRTL } = useLanguage()

  return (
    <section ref={elementRef} className="relative py-40 bg-background-primary overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/10 rounded-full blur-[200px]" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-12"
          >
            <MessageCircle className="w-4 h-4 text-accent-highlight" />
            <span className="text-small text-text-secondary">{t(locale, 'ctaSection.badge')}</span>
          </motion.div>

          <h2 className="text-display-xs md:text-display lg:text-display-lg font-bold text-text-primary mb-8 leading-tight">
            {t(locale, 'ctaSection.title')}
          </h2>

          <p className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary mb-16 max-w-3xl mx-auto leading-relaxed">
            {t(locale, 'ctaSection.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/contact">
              <Button size="xl" variant="premium" className="group">
                {t(locale, 'cta.startProject')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
            </Link>
            <a href="tel:+201061866211">
              <Button size="xl" variant="outline" className="group glass border-border-subtle">
                <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t(locale, 'cta.callUs')}
              </Button>
            </a>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={hasBeenVisible ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 text-small text-text-tertiary"
          >
            {t(locale, 'ctaSection.freeConsult')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactCTA
