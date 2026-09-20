'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'

interface CosmicSectionProps {
  title: string
  description: string
  index: number
}

export function CosmicSection({ title, description, index }: CosmicSectionProps) {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ 
    threshold: 0.2,
    triggerOnce: true 
  })

  return (
    <section 
      ref={elementRef}
      className="h-screen w-full flex items-center relative"
      style={{ minHeight: '100vh' }}
    >
      <div className="w-full px-[5%] max-w-[1600px] mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-h1 md:text-display-lg lg:text-display-xl leading-[1.2] mb-6 font-bold uppercase tracking-tight text-white"
          style={{ fontFamily: 'system-ui, serif' }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-body-lg md:text-h4 lg:text-h3 max-w-[600px] mb-8 text-white/70 font-light leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </section>
  )
}
