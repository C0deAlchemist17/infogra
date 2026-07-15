'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'

const TrustedBy = () => {
  const { elementRef, isVisible, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })

  const clients = [
    { name: 'TechCorp', category: 'Technology' },
    { name: 'InnovateLabs', category: 'Startups' },
    { name: 'GlobalFinance', category: 'Finance' },
    { name: 'HealthPlus', category: 'Healthcare' },
    { name: 'EduWorld', category: 'Education' },
    { name: 'RetailMax', category: 'E-commerce' },
  ]

  return (
    <section
      ref={elementRef}
      className="relative py-32 border-b border-border-subtle bg-background-secondary/50"
    >
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-h4-sm md:text-h4 lg:text-h3 font-semibold text-text-secondary mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-body md:text-body-lg text-text-tertiary max-w-2xl mx-auto leading-relaxed">
            We&apos;ve had the privilege of working with innovative companies across various industries
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 30 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl glass hover:bg-background-tertiary/50 transition-all duration-700 group"
            >
              <div className="w-20 h-20 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700">
                <span className="text-3xl font-bold gradient-text">
                  {client.name.charAt(0)}
                </span>
              </div>
              <div className="text-small font-semibold text-text-primary mb-2">
                {client.name}
              </div>
              <div className="text-caption text-text-tertiary">{client.category}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedBy
