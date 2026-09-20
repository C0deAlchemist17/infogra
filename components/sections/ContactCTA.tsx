'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle, Phone, Mail, MapPin, Zap, Globe } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const ContactCTA = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale, isRTL } = useLanguage()

  const contactMethods = [
    { icon: Phone, label: 'Call Us', value: '+20 106 186 6211', color: 'from-blue-500 to-cyan-500' },
    { icon: Mail, label: 'Email Us', value: 'infograofficial1@gmail.com', color: 'from-purple-500 to-pink-500' },
    { icon: MapPin, label: 'Visit Us', value: 'Alexandria, Egypt', color: 'from-green-500 to-emerald-500' }
  ]

  return (
    <section ref={elementRef} className="relative py-24 overflow-hidden">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-12 hover:border-accent-primary/50 transition-all duration-500"
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

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/contact">
              <Button size="xl" variant="premium" className="group shadow-glow">
                {t(locale, 'cta.startProject')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
            </Link>
            <a href="tel:+201061866211">
              <Button size="xl" variant="outline" className="group glass border-border-subtle hover:border-accent-primary/50 transition-all duration-300">
                <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} group-hover:scale-110 transition-transform`} />
                {t(locale, 'cta.callUs')}
              </Button>
            </a>
          </div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                onMouseEnter={addHoverEffect}
                onMouseLeave={removeHoverEffect}
                className="glass rounded-xl p-6 border border-border-subtle hover:border-accent-primary/50 transition-all duration-500 group cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-small text-text-tertiary mb-1">{method.label}</div>
                <div className="text-body font-semibold text-text-primary group-hover:text-accent-primary transition-colors">{method.value}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={hasBeenVisible ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-small text-text-tertiary"
          >
            {t(locale, 'ctaSection.freeConsult')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactCTA
