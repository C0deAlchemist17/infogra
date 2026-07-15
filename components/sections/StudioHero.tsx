'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { Button } from '@/components/ui/button'
import { ArrowDown, Play, Star, Zap, Globe, Sparkles, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'), {
  ssr: false,
  loading: () => null
})

const StudioHero = () => {
  // Custom cursor is handled by StudioHeader, don't duplicate here
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const parallaxOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  
  const { elementRef: titleRef, isVisible: titleVisible, hasBeenVisible } = useScrollTrigger({ 
    threshold: 0.1,
    triggerOnce: true 
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      setMousePosition({ x: clientX, y: clientY })
      
      const flare = document.querySelector('.lens-flare') as HTMLElement
      if (flare) {
        flare.style.left = `${clientX}px`
        flare.style.top = `${clientY}px`
        flare.classList.add('active')
      }
    }

    const handleMouseLeave = () => {
      const flare = document.querySelector('.lens-flare') as HTMLElement
      if (flare) {
        flare.classList.remove('active')
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    setFloatingElements(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: i * 0.5
    })))
  }, [])

  const stats = [
    { icon: Globe, label: 'Projects Delivered', value: '150+' },
    { icon: Star, label: 'Happy Clients', value: '80+' },
    { icon: Zap, label: 'Years Experience', value: '8+' },
    { icon: Sparkles, label: 'Awards Won', value: '25+' }
  ]

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-primary"
      aria-label="Hero section"
      style={{ minHeight: '100vh' }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Three.js Scene */}
        <ThreeScene />
        
        {/* Grid Overlay */}
        <div className="grid-overlay" />
        
        {/* Noise Texture */}
        <div className="noise-overlay" />
        
        {/* Lens Flare */}
        <div className="lens-flare" />
        
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-secondary/20 rounded-full blur-3xl"
        />
        
        {/* Floating Elements */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-accent-primary/10"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 6 + element.id,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: element.delay
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        ref={titleRef}
        className="relative z-10 text-center max-w-7xl mx-auto px-8"
        style={{ y: parallaxY, scale: parallaxScale, opacity: parallaxOpacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle">
            <Sparkles className="w-4 h-4 text-accent-highlight" />
            <span className="text-small text-text-secondary">Premium Digital Agency</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-display-xs md:text-display lg:text-display-xl font-bold text-text-primary mb-12 leading-tight"
        >
          <span className="gradient-text">We Architect</span>
          <br />
          <span className="text-text-primary">Digital Excellence</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary mb-16 max-w-4xl mx-auto leading-relaxed"
        >
          Transform your vision into reality with our premium web development, 
          design, and digital marketing services. We build experiences that captivate and convert.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24"
        >
          <Button size="xl" variant="premium" className="group">
            Start Your Project
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button size="xl" variant="outline" className="group">
            <Play className="w-5 h-5 mr-2" />
            View Our Work
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 2.4 + index * 0.2, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center p-8 rounded-2xl glass hover:bg-background-tertiary/50 transition-all duration-700"
            >
              <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <stat.icon className="w-8 h-8 text-accent-primary" />
              </div>
              <div className="text-h3 font-bold text-text-primary mb-3">{stat.value}</div>
              <div className="text-small text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={hasBeenVisible ? { opacity: 1 } : {}}
        transition={{ delay: 3, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-small text-text-secondary">Scroll to explore</span>
          <ArrowDown className="w-5 h-5 text-text-secondary" />
        </motion.div>
      </motion.div>

      {/* Custom Cursor is handled by StudioHeader */}
    </section>
  )
}

export default StudioHero
