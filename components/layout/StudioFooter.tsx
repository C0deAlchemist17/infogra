'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { siteConfig } from '@/lib/navigation'
import { useLanguage } from '@/providers/LanguageProvider'

const StudioFooter = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { locale } = useLanguage()

  return (
    <footer ref={elementRef} className="relative py-10" role="contentinfo">
      {/* Fixed footer text like the example */}
      <div className="fixed bottom-2 left-2 text-body-lg text-white/50 z-50 pointer-events-none">
        Digital Experience Architects - Premium Web Design & Development
      </div>

      <div className="container mx-auto px-[3%] max-w-[1600px] relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.8 }}>
          <Link href="/" className="text-display-lg md:text-display-xl font-bold gradient-text mb-4 block">INFOGRA</Link>
          <p className="text-body-lg md:text-display text-white/70 font-light leading-relaxed max-w-xl">
            {locale === 'ar' ? 'نصمم تجارب رقمية حيث يلتقي التصميم المبتكر مع التطوير القوي.' : 'We architect digital experiences where innovative design meets powerful development.'}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default StudioFooter
