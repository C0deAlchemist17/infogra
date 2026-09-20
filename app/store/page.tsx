'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

const Store = () => {
  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Cyber-style background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(13,9,26,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(13,9,26,0.7)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      </div>

      {/* COMING SOON - FULL PAGE */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary animate-gradient-x" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10 bg-grid" />

        <div className="container mx-auto px-2 md:px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-flex items-center gap-1.5 px-3 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 mb-2 md:mb-3 lg:mb-4"
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 text-white animate-pulse" />
              <span className="text-caption md:text-caption lg:text-caption font-bold text-white tracking-wider uppercase">
                Coming Soon
              </span>
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 text-white animate-pulse" />
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-h2 md:text-h1 lg:text-display font-bold text-white mb-1.5 md:mb-2 lg:mb-3 leading-tight"
            >
              Something Amazing is Brewing
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-body-sm md:text-body lg:text-body text-white/90 max-w-md lg:max-w-xl mx-auto leading-relaxed px-1 md:px-2 mb-3 md:mb-4 lg:mb-6"
            >
              We're working hard to bring you an enhanced shopping experience with new features, products, and innovations. Stay tuned for the grand reopening of our store!
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center items-center"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-accent-primary transition-all duration-300"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
              <Button
                size="sm"
                className="bg-white text-accent-primary hover:bg-background-tertiary transition-all duration-300"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Store
