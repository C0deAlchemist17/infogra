'use client'

import { motion } from 'framer-motion'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import AnimatedText from '@/components/ui/AnimatedText'
import MagneticButton from '@/components/ui/MagneticButton'
import { ArrowLeft, Calendar, Users, Clock, ExternalLink, Code, Palette, Target } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectClientProps {
  project: {
    title: string
    category: string
    description: string
    image: string
    gallery?: string[]
    tags: string[]
    overview: string
    challenge: string
    solution: string
    technologies: string[]
    timeline: string
    team: number
  }
  slug: string
}

const StudioProjectClient = ({ project, slug }: ProjectClientProps) => {
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  
  const { elementRef: heroRef, isVisible: heroVisible, hasBeenVisible: heroHasBeenVisible } = useScrollTrigger({ 
    threshold: 0.1,
    triggerOnce: true 
  })

  const { elementRef: contentRef, isVisible: contentVisible, hasBeenVisible: contentHasBeenVisible } = useScrollTrigger({ 
    threshold: 0.1,
    triggerOnce: true 
  })

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <div className="grid-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-background-primary via-background-primary/90 to-background-primary" />
        </div>

        {/* Main Content */}
        <motion.div 
          className="relative z-10 text-center max-w-6xl mx-auto px-6"
          initial={{ opacity: 0, y: 60 }}
          animate={heroHasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={heroHasBeenVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
            className="absolute top-8 left-6"
          >
            <Link href="/projects">
              <MagneticButton
                variant="outline"
                size="sm"
                className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Project Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroHasBeenVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
            className="relative w-full max-w-4xl mx-auto mb-12 aspect-video rounded-2xl overflow-hidden"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-infogra-background/50 to-transparent" />
          </motion.div>

          {/* Project Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroHasBeenVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-accent-primary text-sm tracking-widest uppercase font-semibold">
                {project.category}
              </span>
              <div className="w-16 h-px bg-accent-primary" />
            </div>
            <AnimatedText
              text={project.title}
              className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight"
              type="words"
              animation="slideUp"
              stagger={0.1}
              delay={1}
            />
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {project.description}
            </p>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroHasBeenVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.4, duration: 1, ease: 'easeOut' }}
            className="flex flex-wrap justify-center gap-3"
          >
            {project.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroHasBeenVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
                className="px-4 py-2 bg-accent-primary/20 border border-accent-primary/30 rounded-full text-sm text-text-secondary"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Project Details */}
      <section 
        ref={contentRef}
        className="py-24 bg-background-secondary"
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={contentHasBeenVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
              >
                <h2 className="text-3xl font-bold text-text-primary mb-6">Overview</h2>
                <p className="text-text-secondary leading-relaxed text-lg">
                  {project.overview}
                </p>
              </motion.div>

              {/* Challenge */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={contentHasBeenVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-accent-primary" />
                  <h3 className="text-2xl font-bold text-text-primary">Challenge</h3>
                </div>
                <p className="text-text-secondary leading-relaxed text-lg">
                  {project.challenge}
                </p>
              </motion.div>

              {/* Solution */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={contentHasBeenVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Code className="w-6 h-6 text-accent-primary" />
                  <h3 className="text-2xl font-bold text-text-primary">Solution</h3>
                </div>
                <p className="text-text-secondary leading-relaxed text-lg">
                  {project.solution}
                </p>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={contentHasBeenVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-6 h-6 text-accent-primary" />
                  <h3 className="text-2xl font-bold text-text-primary">Technologies Used</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.technologies.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={contentHasBeenVisible ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                      className="bg-background-tertiary px-4 py-3 rounded-lg border border-border-medium/20 text-center"
                    >
                      <span className="text-text-primary font-medium">{tech}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={contentHasBeenVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                className="bg-background-tertiary rounded-2xl p-8 border border-border-medium/20"
              >
                <h3 className="text-xl font-bold text-text-primary mb-6">Project Details</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Timeline</div>
                      <div className="text-text-primary font-medium">{project.timeline}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Team Size</div>
                      <div className="text-text-primary font-medium">{project.team} members</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">Status</div>
                      <div className="text-text-primary font-medium">Completed</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={contentHasBeenVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
              >
                <MagneticButton
                  size="lg"
                  className="w-full bg-accent-primary text-white hover:bg-accent-secondary hover:shadow-glow"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Live Project
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StudioProjectClient
