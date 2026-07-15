'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Lightbulb, Code2, Rocket, ArrowRight } from 'lucide-react'

const Process = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  const steps = [
    {
      icon: Search,
      step: '01',
      title: 'Discovery & Research',
      description: 'We dive deep into your business, audience, and goals to build a strategic foundation for success.',
      details: ['Market Analysis', 'User Research', 'Competitor Audit', 'Strategy Planning']
    },
    {
      icon: Lightbulb,
      step: '02',
      title: 'Design & Prototype',
      description: 'Our designers craft stunning interfaces with pixel-perfect attention to detail and user experience.',
      details: ['Wireframing', 'UI Design', 'Prototyping', 'User Testing']
    },
    {
      icon: Code2,
      step: '03',
      title: 'Develop & Build',
      description: 'Our engineers bring designs to life with clean, performant, and scalable code.',
      details: ['Frontend Dev', 'Backend Systems', 'API Integration', 'Performance Optimization']
    },
    {
      icon: Rocket,
      step: '04',
      title: 'Launch & Grow',
      description: 'We deploy, monitor, and continuously optimize to ensure your digital success.',
      details: ['Deployment', 'Analytics Setup', 'SEO Optimization', 'Ongoing Support']
    }
  ]

  return (
    <section ref={elementRef} className="relative py-40 bg-background-primary overflow-hidden">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">How We Work</span>
          </div>
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">
            Our <span className="gradient-text">Process</span>
          </h2>
          <p className="text-body-lg md:text-h4 text-text-secondary max-w-3xl mx-auto leading-relaxed">
            A proven methodology that transforms ideas into exceptional digital experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 60 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={addHoverEffect}
              onMouseLeave={removeHoverEffect}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-accent-primary/30 to-accent-primary/10" />
              )}
              
              <Card className="h-full border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow text-center">
                <CardContent className="p-10">
                  <div className="text-caption font-bold text-accent-primary/50 mb-6 tracking-widest">STEP {step.step}</div>
                  <div className="w-24 h-24 bg-accent-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <step.icon className="w-12 h-12 text-accent-primary" />
                  </div>
                  <h3 className="text-h4 font-semibold text-text-primary mb-4">{step.title}</h3>
                  <p className="text-body text-text-secondary mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="text-small text-text-tertiary flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
