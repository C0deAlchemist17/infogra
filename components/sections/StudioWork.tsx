'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Grid3X3, Code, Palette, ArrowRight, ExternalLink, Calendar, Award } from 'lucide-react'
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
    { 
      id: 1, 
      title: 'Alkhunaizan Law Firm', 
      category: 'web', 
      categoryName: t(locale, 'work.filterWeb'), 
      description: 'Professional legal website with modern design and seamless user experience, featuring bilingual support and case management.', 
      tags: ['React', 'Tailwind', 'Legal', 'Bilingual'], 
      color: 'from-blue-500 to-cyan-500', 
      image: '/assets/img/alkunaizan/portfolio-details-1.jpg', 
      slug: 'alkhunaizan',
      year: '2023',
      award: 'Best Legal Website'
    },
    { 
      id: 2, 
      title: 'Kareem Hafez Toolshop', 
      category: 'web', 
      categoryName: t(locale, 'work.filterWeb'), 
      description: 'E-commerce platform for industrial tools with advanced filtering, inventory management, and WhatsApp integration.', 
      tags: ['Next.js', 'TypeScript', 'E-commerce', 'WhatsApp'], 
      color: 'from-purple-500 to-pink-500', 
      image: '/assets/img/kareem hafez/photo_2023-10-30_01-16-39.jpg', 
      slug: 'kareem-hafez',
      year: '2023',
      award: 'Innovation Award'
    },
    { 
      id: 3, 
      title: 'Re Ramen Restaurant', 
      category: 'web', 
      categoryName: t(locale, 'work.filterWeb'), 
      description: 'Modern restaurant website with online ordering system, menu management, and reservation booking.', 
      tags: ['React', 'Node.js', 'Restaurant', 'POS'], 
      color: 'from-orange-500 to-red-500', 
      image: '/assets/img/re ramen en/Screenshot 2025-10-05 003904.png', 
      slug: 're-ramen',
      year: '2024',
      award: 'User Experience Award'
    },
    { 
      id: 4, 
      title: 'Maazen Elharam Real Estate', 
      category: 'web', 
      categoryName: t(locale, 'work.filterWeb'), 
      description: 'Real estate platform with property listings, advanced search, virtual tours, and bilingual interface.', 
      tags: ['Vue.js', 'Laravel', 'Real Estate', '3D Tours'], 
      color: 'from-green-500 to-emerald-500', 
      image: '/assets/img/maazen en/Screenshot 2025-10-05 015252.png', 
      slug: 'maazen-elharam',
      year: '2024',
      award: 'Best Platform'
    },
    { 
      id: 5, 
      title: 'Hab Constructions', 
      category: 'web', 
      categoryName: t(locale, 'work.filterWeb'), 
      description: 'Construction company showcase with project gallery, bilingual support, and client testimonials.', 
      tags: ['WordPress', 'PHP', 'Construction', 'Gallery'], 
      color: 'from-indigo-500 to-purple-500', 
      image: '/assets/img/hab en/Screenshot 2025-09-18 190357.png', 
      slug: 'hab-constructions',
      year: '2023',
      award: 'Construction Excellence'
    },
    { 
      id: 6, 
      title: 'Brand Identity - Baker', 
      category: 'design', 
      categoryName: t(locale, 'work.filterDesign'), 
      description: 'Minimalist logo design for tech startup with full brand guidelines and visual identity system.', 
      tags: ['Branding', 'Logo', 'Minimal', 'Identity'], 
      color: 'from-pink-500 to-rose-500', 
      image: '/assets/img/design/001.jfif', 
      slug: 'brand-identity',
      year: '2023',
      award: 'Design Excellence'
    },
    { 
      id: 7, 
      title: 'UI/UX Design System', 
      category: 'design', 
      categoryName: t(locale, 'work.filterDesign'), 
      description: 'Complete design system with UI components, UX guidelines, and comprehensive documentation.', 
      tags: ['UI/UX', 'Design System', 'Figma', 'Components'], 
      color: 'from-cyan-500 to-blue-500', 
      image: '/assets/img/design/002.jfif', 
      slug: 'ui-ux-design',
      year: '2024',
      award: 'System Innovation'
    },
    { 
      id: 8, 
      title: 'Social Media Campaign', 
      category: 'design', 
      categoryName: t(locale, 'work.filterDesign'), 
      description: 'Creative social media assets and campaign materials with consistent visual language.', 
      tags: ['Social Media', 'Marketing', 'Creative', 'Campaign'], 
      color: 'from-amber-500 to-orange-500', 
      image: '/assets/img/design/003.jfif', 
      slug: 'social-media',
      year: '2024',
      award: 'Creative Impact'
    },
  ]

  const filters = [
    { id: 'all', label: t(locale, 'work.filterAll'), icon: Grid3X3 },
    { id: 'web', label: t(locale, 'work.filterWeb'), icon: Code },
    { id: 'design', label: t(locale, 'work.filterDesign'), icon: Palette },
  ]

  const filteredProjects = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter)

  return (
    <section ref={elementRef} id="work" className="relative py-24" aria-labelledby="work-heading">
      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8 hover:border-accent-primary/50 transition-all duration-500">
            <Award className="w-4 h-4 text-accent-highlight" />
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
                className={`px-8 py-4 rounded-full transition-all duration-700 flex items-center gap-2 ${activeFilter === filter.id ? 'bg-accent-primary text-white shadow-glow' : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary/50'}`}>
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
                transition={{ delay: index * 0.1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                <Card className="group overflow-hidden border-border-subtle hover:border-accent-primary/50 transition-all duration-700 hover:-translate-y-2 hover:shadow-glow">
                  <div className="relative aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-15 group-hover:opacity-25 transition-opacity duration-700`} />
                    <Image 
                      src={project.image} 
                      alt={project.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <Badge className="bg-accent-primary text-white border-none shadow-lg">{project.categoryName}</Badge>
                      {project.award && (
                        <Badge className="bg-accent-highlight text-white border-none shadow-lg flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {project.award}
                        </Badge>
                      )}
                    </div>

                    {/* Year badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="glass px-3 py-1 rounded-full text-small text-text-secondary flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.year}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-h4 font-semibold text-text-primary mb-3 group-hover:text-accent-primary transition-colors line-clamp-1">{project.title}</h3>
                    <p className="text-body text-text-secondary mb-6 leading-relaxed line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.slice(0, 4).map((tag) => (<Tag key={tag} variant="secondary" className="text-small">{tag}</Tag>))}
                    </div>
                    <Link href={`/projects/${project.slug}`} className="block">
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

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: '50+', label: 'Projects Delivered' },
            { value: '15+', label: 'Happy Clients' },
            { value: '8+', label: 'Awards Won' },
            { value: '5+', label: 'Years Experience' }
          ].map((stat, index) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2 + index * 0.1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="glass rounded-xl p-6 border border-border-subtle text-center hover:border-accent-primary/50 transition-all duration-500">
              <div className="text-h3 font-bold text-text-primary mb-1">{stat.value}</div>
              <div className="text-small text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }} className="text-center">
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
