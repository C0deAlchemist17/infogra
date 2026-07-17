'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Grid3X3, Code, Palette, ArrowRight, ExternalLink, Eye, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tag } from '@/components/ui/tag'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  
  const { elementRef, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale, isRTL } = useLanguage()

  const projects = [
    {
      id: 1,
      title: t(locale, 'project.alkhunaizan.title'),
      category: 'web',
      categoryName: t(locale, 'work.filterWeb'),
      description: t(locale, 'project.alkhunaizan.desc'),
      tags: ['React', 'Tailwind', 'Legal'],
      color: 'from-blue-500 to-cyan-500',
      featured: true,
      image: '/assets/img/alkunaizan/portfolio-details-1.jpg',
      slug: 'alkhunaizan'
    },
    {
      id: 2,
      title: t(locale, 'project.kareem.title'),
      category: 'web',
      categoryName: t(locale, 'work.filterWeb'),
      description: t(locale, 'project.kareem.desc'),
      tags: ['Next.js', 'TypeScript', 'E-commerce'],
      color: 'from-purple-500 to-pink-500',
      featured: true,
      image: '/assets/img/kareem hafez/photo_2023-10-30_01-16-39.jpg',
      slug: 'kareem-hafez'
    },
    {
      id: 3,
      title: t(locale, 'project.reramen.title'),
      category: 'web',
      categoryName: t(locale, 'work.filterWeb'),
      description: t(locale, 'project.reramen.desc'),
      tags: ['React', 'Node.js', 'Restaurant'],
      color: 'from-orange-500 to-red-500',
      featured: false,
      image: '/assets/img/re ramen en/Screenshot 2025-10-05 003904.png',
      slug: 're-ramen'
    },
    {
      id: 4,
      title: t(locale, 'project.maazen.title'),
      category: 'web',
      categoryName: t(locale, 'work.filterWeb'),
      description: t(locale, 'project.maazen.desc'),
      tags: ['Vue.js', 'Laravel', 'Real Estate'],
      color: 'from-green-500 to-emerald-500',
      featured: false,
      image: '/assets/img/maazen en/Screenshot 2025-10-05 015252.png',
      slug: 'maazen-elharam'
    },
    {
      id: 5,
      title: t(locale, 'project.hab.title'),
      category: 'web',
      categoryName: t(locale, 'work.filterWeb'),
      description: t(locale, 'project.hab.desc'),
      tags: ['WordPress', 'PHP', 'Construction'],
      color: 'from-indigo-500 to-purple-500',
      featured: false,
      image: '/assets/img/hab en/Screenshot 2025-09-18 190357.png',
      slug: 'hab-constructions'
    },
    {
      id: 6,
      title: t(locale, 'project.brand.title'),
      category: 'design',
      categoryName: t(locale, 'work.filterDesign'),
      description: t(locale, 'project.brand.desc'),
      tags: ['Branding', 'Guidelines', 'Design System'],
      color: 'from-pink-500 to-rose-500',
      featured: false,
      image: '/assets/img/design/UI&UX plan 01 (ps).jpg',
      slug: 'brand-identity'
    }
  ]

  const filters = [
    { id: 'all', label: t(locale, 'work.filterAll'), icon: Grid3X3 },
    { id: 'web', label: t(locale, 'work.filterWeb'), icon: Code },
    { id: 'design', label: t(locale, 'work.filterDesign'), icon: Palette }
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter)

  return (
    <>
        {/* Hero Section */}
        <section
          ref={elementRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-primary"
        >
          <div className="absolute inset-0">
            <div className="grid-overlay" />
            <div className="noise-overlay" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 text-center max-w-6xl mx-auto px-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-12"
            >
              <Filter className="w-5 h-5 text-accent-primary" />
              <span className="text-small text-text-secondary">{t(locale, 'projects.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-display md:text-h1 font-bold text-text-primary mb-8 leading-tight"
            >
              <span className="gradient-text">{t(locale, 'projects.title')}</span>
              <br />
              <span className="text-text-primary">{t(locale, 'projects.subtitle')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-body-lg md:text-h4 text-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              {t(locale, 'projects.heroDesc')}
            </motion.p>
          </motion.div>
        </section>

        {/* Projects Grid */}
        <section className="relative py-32 bg-background-secondary/50">
          <div className="container mx-auto px-8">
            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex justify-center mb-20"
            >
              <div className="inline-flex glass rounded-full p-1 border border-border-subtle" role="tablist" aria-label="Project filters">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    onMouseEnter={addHoverEffect}
                    onMouseLeave={removeHoverEffect}
                    role="tab"
                    aria-selected={activeFilter === filter.id}
                    aria-label={`Filter by ${filter.label}`}
                    className={`px-8 py-4 rounded-full transition-all duration-700 flex items-center gap-2 ${
                      activeFilter === filter.id
                        ? 'bg-accent-primary text-white shadow-glow'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <filter.icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 1.2, 
                      ease: [0.25, 0.1, 0.25, 1] 
                    }}
                    onMouseEnter={addHoverEffect}
                    onMouseLeave={removeHoverEffect}
                  >
                    <Link href={`/projects/${project.slug}`} key={project.id}>
                      <Card className="group overflow-hidden border-border-subtle hover:border-accent-primary/50 transition-all duration-700 hover:-translate-y-2 hover:shadow-glow h-full">
                        <div className="relative aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />
                          
                          {project.featured && (
                            <Badge className="absolute top-4 right-4 bg-accent-primary text-white border-none z-10">
                              {locale === 'ar' ? 'مميز' : 'Featured'}
                            </Badge>
                          )}
                          
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />

                          <Badge className="absolute top-4 left-4 bg-background-tertiary/80 text-white border-none z-10">
                            {project.categoryName}
                          </Badge>
                        </div>

                        <CardContent className="p-8">
                          <h3 className="text-h4 font-semibold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                            {project.title}
                          </h3>
                          
                          <p className="text-body text-text-secondary mb-6 leading-relaxed">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.map((tag) => (
                              <Tag key={tag} variant="secondary" className="text-small">
                                {tag}
                              </Tag>
                            ))}
                          </div>

                          <Button variant="outline" size="sm" className="w-full group">
                            {t(locale, 'work.viewProject')}
                            <ArrowRight className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'} group-hover:translate-x-1 transition-transform`} />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <Button size="xl" variant="premium" className="group" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                {t(locale, 'projects.cta')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
            </motion.div>
          </div>
        </section>
      </>
  )
}

export default Projects
