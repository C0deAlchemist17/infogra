'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}

export default function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  const { elementRef, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      ref={elementRef}
      className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-32 pb-16"
    >
      <div className="absolute inset-0">
        <div className="grid-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary via-background-primary/90 to-background-primary" />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-5xl mx-auto px-6 md:px-8"
        initial={{ opacity: 0, y: 40 }}
        animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {eyebrow && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-accent-primary text-sm tracking-widest uppercase font-semibold">
              {eyebrow}
            </span>
            <div className="w-16 h-px bg-accent-primary" />
          </div>
        )}
        <h1 className="text-h2-sm md:text-h1-sm lg:text-h1 font-bold text-text-primary mb-6 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-body-lg md:text-h4 text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </motion.div>
    </section>
  )
}
