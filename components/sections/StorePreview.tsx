'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Truck, Zap, Award, Wrench } from 'lucide-react'
import { products } from '@/data/products'
import ProductCard from '@/components/store/ProductCard'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const StorePreview = () => {
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { locale, isRTL } = useLanguage()
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4)

  return (
    <section ref={elementRef} className="relative py-40 bg-background-primary overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
      </div>

      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
              <span className="text-small text-text-secondary">{t(locale, 'store.badge')}</span>
            </div>
            <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">
              {t(locale, 'store.title')}
            </h2>
            <p className="text-body-lg md:text-h4 text-text-secondary leading-relaxed">{t(locale, 'store.subtitle')}</p>
          </div>
          <Link href="/store">
            <Button size="xl" variant="premium" className="group mt-8 lg:mt-0">
              {t(locale, 'store.browse')}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 1 }} className="mb-16">
          <Card className="bg-gradient-to-r from-accent-primary to-accent-secondary border-none text-white overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-h3 font-bold mb-2">{t(locale, 'store.buildPC')}</h3>
                    <p className="text-body opacity-90">{t(locale, 'store.buildPCDesc')}</p>
                  </div>
                </div>
                <Link href="/store/pc-builder">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-accent-primary">
                    {t(locale, 'store.startBuilding')}
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-border-subtle">
          {[
            { icon: Shield, title: t(locale, 'store.warranty'), desc: t(locale, 'store.warrantyDesc') },
            { icon: Truck, title: t(locale, 'store.delivery'), desc: t(locale, 'store.deliveryDesc') },
            { icon: Zap, title: t(locale, 'store.prices'), desc: t(locale, 'store.pricesDesc') },
            { icon: Award, title: t(locale, 'store.authentic'), desc: t(locale, 'store.authenticDesc') },
          ].map((badge) => (
            <div key={badge.title} className="flex items-center gap-4 p-4 rounded-xl glass">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <div className="text-small font-semibold text-text-primary">{badge.title}</div>
                <div className="text-caption text-text-tertiary">{badge.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default StorePreview
