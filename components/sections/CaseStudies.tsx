'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const CaseStudies = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  const caseStudies = [
    {
      title: 'Alkhunaizan Law Firm',
      industry: 'Legal Services',
      challenge: 'Outdated website with poor user experience and low conversion rates.',
      solution: 'Complete redesign with modern UI, improved navigation, and optimized performance.',
      results: [
        { label: 'Conversion Rate', value: '+150%' },
        { label: 'Page Load Time', value: '-60%' },
        { label: 'User Engagement', value: '+200%' }
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Kareem Hafez Toolshop',
      industry: 'E-commerce',
      challenge: 'Limited online presence with no e-commerce capabilities.',
      solution: 'Full e-commerce platform with advanced filtering, payment integration, and inventory management.',
      results: [
        { label: 'Online Sales', value: '+300%' },
        { label: 'Order Processing', value: '-80%' },
        { label: 'Customer Satisfaction', value: '+95%' }
      ],
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section
      ref={elementRef}
      className="relative py-40 bg-background-secondary/50"
    >
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">Success Stories</span>
          </div>
          <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">
            Featured Case Studies
          </h2>
          <p className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Deep dive into how we helped businesses achieve their digital transformation goals
          </p>
        </motion.div>

        <div className="space-y-24">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 80 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.3, duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="group"
            >
              <Card className="overflow-hidden border-border-subtle hover:border-accent-primary/30 transition-all duration-700 hover:shadow-glow">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className={`relative aspect-video lg:aspect-auto bg-gradient-to-br ${study.color} p-16 flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                        <Award className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="text-h3 font-bold text-white mb-3">{study.title}</h3>
                      <p className="text-body text-white/80">{study.industry}</p>
                    </div>
                  </div>

                  <CardContent className="p-16 flex flex-col justify-center">
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-small font-semibold text-accent-primary mb-3 uppercase tracking-wider">The Challenge</h4>
                        <p className="text-body text-text-secondary leading-relaxed">{study.challenge}</p>
                      </div>

                      <div>
                        <h4 className="text-small font-semibold text-accent-primary mb-3 uppercase tracking-wider">Our Solution</h4>
                        <p className="text-body text-text-secondary leading-relaxed">{study.solution}</p>
                      </div>

                      <div>
                        <h4 className="text-small font-semibold text-accent-primary mb-6 uppercase tracking-wider">Results</h4>
                        <div className="grid grid-cols-3 gap-6">
                          {study.results.map((result) => (
                            <div key={result.label} className="text-center p-6 rounded-xl bg-background-tertiary/50">
                              <div className="text-h4 font-bold gradient-text mb-2">{result.value}</div>
                              <div className="text-caption text-text-tertiary">{result.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-fit group"
                        onMouseEnter={addHoverEffect}
                        onMouseLeave={removeHoverEffect}
                      >
                        Read Full Case Study
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CaseStudies
