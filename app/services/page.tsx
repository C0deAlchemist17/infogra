'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Code, Smartphone, Palette, Megaphone, Brain, Cloud, Cpu, BarChart, ArrowRight, Sparkles, CheckCircle, ChevronRight, Zap, Globe } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const SectionBackground = dynamic(() => import('@/components/three/SectionBackground'), {
  ssr: false,
  loading: () => null
})

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Custom web applications built with Next.js, React, and modern technologies. Scalable, performant, and SEO-optimized.',
    features: ['Next.js & React', 'E-commerce Platforms', 'API Integration', 'Performance Optimization'],
    gradient: 'from-blue-500 to-cyan-500',
    stats: { projects: '150+', satisfaction: '98%' }
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications for iOS and Android with seamless user experiences.',
    features: ['iOS & Android', 'React Native', 'Push Notifications', 'Offline Support'],
    gradient: 'from-purple-500 to-pink-500',
    stats: { projects: '80+', satisfaction: '96%' }
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'User-centered design that combines aesthetics with functionality to create intuitive digital experiences.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    gradient: 'from-pink-500 to-rose-500',
    stats: { projects: '200+', satisfaction: '99%' }
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Data-driven digital marketing strategies to grow your online presence and drive conversions.',
    features: ['SEO', 'Social Media', 'Content Strategy', 'Analytics'],
    gradient: 'from-orange-500 to-amber-500',
    stats: { projects: '100+', satisfaction: '95%' }
  },
  {
    icon: Brain,
    title: 'AI Solutions',
    description: 'Intelligent automation and AI-powered features to enhance your digital products and workflows.',
    features: ['Chatbots', 'ML Integration', 'Process Automation', 'Data Analytics'],
    gradient: 'from-green-500 to-emerald-500',
    stats: { projects: '50+', satisfaction: '97%' }
  },
  {
    icon: Cloud,
    title: 'Cloud Services',
    description: 'Scalable cloud infrastructure, deployment, and DevOps solutions for enterprise-grade applications.',
    features: ['AWS & Azure', 'CI/CD Pipelines', 'Container Orchestration', 'Monitoring'],
    gradient: 'from-indigo-500 to-violet-500',
    stats: { projects: '75+', satisfaction: '98%' }
  },
  {
    icon: Globe,
    title: 'Brand Strategy',
    description: 'Complete brand identity solutions including logos, visual guidelines, and brand strategy.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Strategy'],
    gradient: 'from-teal-500 to-cyan-500',
    stats: { projects: '120+', satisfaction: '99%' }
  },
  {
    icon: Zap,
    title: 'Consulting',
    description: 'Strategic technology consulting to guide your digital transformation journey.',
    features: ['Tech Audits', 'Architecture Review', 'Digital Strategy', 'Team Training'],
    gradient: 'from-yellow-500 to-orange-500',
    stats: { projects: '60+', satisfaction: '96%' }
  },
]

const processSteps = [
  { step: '01', title: 'Discovery', description: 'We analyze your needs, goals, and target audience to create a strategic roadmap.' },
  { step: '02', title: 'Design', description: 'Our designers craft beautiful, intuitive interfaces that delight users.' },
  { step: '03', title: 'Develop', description: 'Engineers build robust, scalable solutions using cutting-edge technologies.' },
  { step: '04', title: 'Deploy', description: 'We launch, monitor, and optimize to ensure peak performance.' },
]

export default function ServicesPage() {
  const { elementRef: heroRef, hasBeenVisible: heroVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { elementRef: servicesRef, hasBeenVisible: servicesVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { elementRef: processRef, hasBeenVisible: processVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { elementRef: ctaRef, hasBeenVisible: ctaVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <SectionBackground opacity={0.4} />
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary/30 via-background-primary/60 to-background-primary" />
        
        <div className="container mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8"
            >
              <Sparkles className="w-5 h-5 text-accent-highlight" />
              <span className="text-small text-text-secondary">What We Do</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-display-xs md:text-display lg:text-display-xl font-bold text-text-primary mb-8 leading-tight"
            >
              <span className="gradient-text">Premium Digital</span>
              <br />
              <span className="text-text-primary">Services</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              End-to-end digital solutions crafted with precision, creativity, and cutting-edge technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.1, duration: 1.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/contact">
                <Button size="xl" variant="premium" className="group">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="xl" variant="outline" className="group glass border-border-subtle">
                  View Our Work
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={servicesRef} className="relative py-24">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={servicesVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.8, ease: 'easeOut' }}
                onMouseEnter={addHoverEffect}
                onMouseLeave={removeHoverEffect}
              >
                <Card className="h-full glass border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-h4 font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-body text-text-secondary mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-small text-text-tertiary">
                          <CheckCircle className="w-4 h-4 text-accent-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-small font-bold text-accent-primary">{service.stats.projects}</div>
                          <div className="text-caption text-text-tertiary">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="text-small font-bold text-accent-success">{service.stats.satisfaction}</div>
                          <div className="text-caption text-text-tertiary">Satisfaction</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-accent-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="relative py-24 bg-background-secondary/50">
        <SectionBackground opacity={0.2} />
        <div className="container mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={processVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-h2 font-bold text-text-primary mb-6">Our Process</h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              A proven methodology that delivers exceptional results every time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                animate={processVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-h3 font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-h4 font-bold text-text-primary mb-3">{step.title}</h3>
                <p className="text-body text-text-secondary">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5 }}
          >
            <Card className="bg-gradient-primary border-none text-white overflow-hidden">
              <CardContent className="p-16 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <h2 className="text-h2 font-bold mb-6">Ready to Start Your Project?</h2>
                  <p className="text-body-lg mb-10 opacity-90 leading-relaxed">
                    Let&apos;s create something amazing together. Get in touch and let&apos;s discuss how we can help bring your vision to life.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link href="/contact">
                      <Button size="xl" className="bg-white text-accent-primary hover:bg-background-tertiary">
                        Get in Touch
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/store/pc-builder">
                      <Button size="xl" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-accent-primary">
                        Build Your PC
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
