'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Grid3X3, Code, Palette, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tag } from '@/components/ui/tag'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const StudioWork = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale, isRTL } = useLanguage()

  const projects = [
    { id: 1, title: 'Alkhunaizan Law Firm', category: 'web', categoryName: t(locale, 'work.filterWeb'), description: 'Professional legal website with modern design and seamless user experience.', tags: ['React', 'Tailwind', 'Legal'], color: 'from-blue-500 to-cyan-500', image: '/assets/img/alkunaizan/portfolio-details-1.jpg', slug: 'alkhunaizan' },
    { id: 2, title: 'Kareem Hafez Toolshop', category: 'web', categoryName: t(locale, 'work.filterWeb'), description: 'E-commerce platform for industrial tools with advanced filtering.', tags: ['Next.js', 'TypeScript', 'E-commerce'], color: 'from-purple-500 to-pink-500', image: '/assets/img/kareem hafez/photo_2023-10-30_01-16-39.jpg', slug: 'kareem-hafez' },
    { id: 3, title: 'Re Ramen Restaurant', category: 'web', categoryName: t(locale, 'work.filterWeb'), description: 'Modern restaurant website with online ordering system.', tags: ['React', 'Node.js', 'Restaurant'], color: 'from-orange-500 to-red-500', image: '/assets/img/re ramen en/Screenshot 2025-10-05 003904.png', slug: 're-ramen' },
    { id: 4, title: 'Maazen Elharam Real Estate', category: 'web', categoryName: t(locale, 'work.filterWeb'), description: 'Real estate platform with property listings and search.', tags: ['Vue.js', 'Laravel', 'Real Estate'], color: 'from-green-500 to-emerald-500', image: '/assets/img/maazen en/Screenshot 2025-10-05 015252.png', slug: 'maazen-elharam' },
    { id: 5, title: 'Hab Constructions', category: 'web', categoryName: t(locale, 'work.filterWeb'), description: 'Construction company showcase with project gallery and bilingual support.', tags: ['WordPress', 'PHP', 'Construction'], color: 'from-indigo-500 to-purple-500', image: '/assets/img/hab en/Screenshot 2025-09-18 190357.png', slug: 'hab-constructions' },
    { id: 6, title: 'Brand Identity - Baker', category: 'design', categoryName: t(locale, 'work.filterDesign'), description: 'Minimalist logo design for tech startup with full brand guidelines.', tags: ['Branding', 'Logo', 'Minimal'], color: 'from-pink-500 to-rose-500', image: '/assets/img/design/001.jfif', slug: 'brand-identity' },
    { id: 7, title: 'UI/UX Design System', category: 'design', categoryName: t(locale, 'work.filterDesign'), description: 'Complete design system with UI components and UX guidelines.', tags: ['UI/UX', 'Design System', 'Figma'], color: 'from-cyan-500 to-blue-500', image: '/assets/img/design/002.jfif', slug: 'ui-ux-design' },
    { id: 8, title: 'Social Media Campaign', category: 'design', categoryName: t(locale, 'work.filterDesign'), description: 'Creative social media assets and campaign materials.', tags: ['Social Media', 'Marketing', 'Creative'], color: 'from-amber-500 to-orange-500', image: '/assets/img/design/003.jfif', slug: 'social-media' },
  ]

  const filters = [
    { id: 'all', label: t(locale, 'work.filterAll'), icon: Grid3X3 },
    { id: 'web', label: t(locale, 'work.filterWeb'), icon: Code },
    { id: 'design', label: t(locale, 'work.filterDesign'), icon: Palette },
  ]

  const filteredProjects = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter)

  return (
    <section ref={elementRef} id="work" className="relative py-40 bg-background-primary" aria-labelledby="work-heading">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">{t(locale, 'work.badge')}</span>
          </div>
          <h2 id="work-heading" className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">{t(locale, 'work.title')}</h2>
          <p className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary max-w-3xl mx-auto leading-relaxed">{t(locale, 'work.subtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }} className="flex justify-center mb-24">
          <div className="inline-flex glass rounded-full p-1 border border-border-subtle" role="tablist" aria-label={isRTL ? 'تصفية المشاريع' : 'Project filters'}>
            {filters.map((filter) => (
              <button key={filter.id} onClick={() => setActiveFilter(filter.id)} onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}
                role="tab" aria-selected={activeFilter === filter.id}
                className={`px-8 py-4 rounded-full transition-all duration-700 flex items-center gap-2 ${activeFilter === filter.id ? 'bg-accent-primary text-white shadow-glow' : 'text-text-secondary hover:text-text-primary'}`}>
                <filter.icon className="w-4 h-4" />{filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeFilter} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
            {filteredProjects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                <Card className="group overflow-hidden border-border-subtle hover:border-accent-primary/50 transition-all duration-700 hover:-translate-y-2 hover:shadow-glow">
                  <div className="relative aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />
                    <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    <Badge className="absolute top-6 left-6 bg-accent-primary text-white border-none z-10">{project.categoryName}</Badge>
                  </div>
                  <CardContent className="p-10">
                    <h3 className="text-h4 font-semibold text-text-primary mb-4 group-hover:text-accent-primary transition-colors">{project.title}</h3>
                    <p className="text-body text-text-secondary mb-8 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {project.tags.map((tag) => (<Tag key={tag} variant="secondary" className="text-small">{tag}</Tag>))}
                    </div>
                    <Link href={`/projects/${project.slug}`}>
                      <Button variant="outline" size="sm" className="w-full group">
                        {t(locale, 'work.viewProject')}
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center">
          <Link href="/projects">
            <Button size="xl" variant="premium" className="group">
              {t(locale, 'cta.viewAll')}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default StudioWork
