'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { ArrowRight, Users, Target, Award, Globe, Heart, Zap, Sparkles, TrendingUp, Code, Layers, CheckCircle2, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'

const SectionBackground = dynamic(() => import('@/components/three/SectionBackground'), {
  ssr: false,
  loading: () => null
})
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'), {
  ssr: false,
  loading: () => null
})

const About = () => {
  const { elementRef: heroRef, hasBeenVisible: heroVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { elementRef: storyRef, hasBeenVisible: storyVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { elementRef: valuesRef, hasBeenVisible: valuesVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { elementRef: teamRef, hasBeenVisible: teamVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })

  const { elementRef: statsRef, hasBeenVisible: statsVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })

  const { elementRef: timelineRef, hasBeenVisible: timelineVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  const values = [
    {
      icon: Users,
      title: 'People First',
      description: 'We believe in the power of human creativity and collaboration. Every project begins with understanding people.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We pursue excellence in every pixel, every line of code, and every interaction. Good enough is never enough.'
    },
    {
      icon: Award,
      title: 'Innovation',
      description: 'We push boundaries and explore new possibilities. Innovation is not just what we do, it\'s who we are.'
    },
    {
      icon: Globe,
      title: 'Impact',
      description: 'We create solutions that matter. Our work drives real business results and meaningful change.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We love what we do. Passion fuels our creativity and drives us to deliver exceptional work.'
    },
    {
      icon: Zap,
      title: 'Agility',
      description: 'We move fast and adapt quickly. In a digital world, agility is our competitive advantage.'
    }
  ]

  const team = [
    {
      name: 'Ahmed Mohamed',
      role: 'Founder & Creative Director',
      description: 'Visionary leader with 15+ years in digital design and brand strategy.'
    },
    {
      name: 'Sara Hassan',
      role: 'Technical Lead',
      description: 'Full-stack architect specializing in scalable enterprise solutions.'
    },
    {
      name: 'Omar Khaled',
      role: 'UX Director',
      description: 'User experience expert focused on creating intuitive digital journeys.'
    },
    {
      name: 'Nour Ahmed',
      role: 'Design Lead',
      description: 'Award-winning designer with expertise in visual identity and motion design.'
    }
  ]

  const stats = [
    { value: '8+', label: 'Years Experience', icon: Clock },
    { value: '200+', label: 'Projects Delivered', icon: CheckCircle2 },
    { value: '50+', label: 'Happy Clients', icon: Users },
    { value: '15+', label: 'Team Members', icon: Layers }
  ]

  const timeline = [
    { year: '2016', title: 'Foundation', description: 'INFOGRA was founded with a vision to bridge design and technology.' },
    { year: '2018', title: 'First Major Client', description: 'Secured our first enterprise partnership, marking our growth trajectory.' },
    { year: '2020', title: 'Team Expansion', description: 'Grew to 10+ team members and expanded our service offerings.' },
    { year: '2022', title: 'Global Reach', description: 'Started serving international clients across multiple continents.' },
    { year: '2024', title: 'Innovation Hub', description: 'Launched our AI and 3D capabilities, pushing digital boundaries.' }
  ]

  const techStack = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Three.js', category: '3D Graphics' },
    { name: 'Framer Motion', category: 'Animation' },
    { name: 'GSAP', category: 'Animation' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'AWS', category: 'Cloud' }
  ]

  return (
    <>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-primary"
        >
          <div className="absolute inset-0">
            <ThreeScene />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background-primary/50 via-background-primary/80 to-background-primary" />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 text-center max-w-6xl mx-auto px-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-12"
            >
              <Sparkles className="w-5 h-5 text-accent-highlight" />
              <span className="text-small text-text-secondary">Our Story</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-display-xs md:text-display lg:text-display-xl font-bold text-text-primary mb-12 leading-tight"
            >
              <span className="gradient-text">Architecting Digital</span>
              <br />
              <span className="text-text-primary">Excellence Since 2016</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary mb-16 max-w-4xl mx-auto leading-relaxed"
            >
              We are a team of passionate designers, developers, and strategists dedicated to creating 
              exceptional digital experiences that inspire, engage, and deliver measurable results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.1, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button size="xl" variant="premium" className="group" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button size="xl" variant="outline" className="group glass border-border-subtle" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                View Our Work
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section
          ref={statsRef}
          className="py-20 bg-background-secondary/50 border-b border-border-subtle"
        >
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                  className="text-center p-6 rounded-2xl glass hover:bg-background-tertiary/50 transition-all duration-400"
                >
                  <div className="w-14 h-14 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-accent-primary" />
                  </div>
                  <div className="text-h3 font-bold text-text-primary mb-2">{stat.value}</div>
                  <div className="text-small text-text-secondary">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="relative py-32">
          <SectionBackground opacity={0.3} />
          <div className="container mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={storyVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Card className="glass border-border-subtle shadow-glow h-full">
                  <CardContent className="p-12">
                    <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <Target className="w-8 h-8 text-accent-primary" />
                    </div>
                    <h2 className="text-h2 font-bold text-text-primary mb-6">Our Mission</h2>
                    <p className="text-body-lg text-text-secondary leading-relaxed mb-6">
                      To empower businesses with innovative digital solutions that drive growth, enhance user experiences, and create lasting impact. We transform complex challenges into elegant, user-centric designs that deliver measurable results.
                    </p>
                    <p className="text-body text-text-secondary leading-relaxed">
                      Every project we undertake is guided by our commitment to excellence, innovation, and client success. We don&apos;t just build websites and applications—we build digital experiences that matter.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={storyVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Card className="glass border-border-subtle shadow-glow h-full">
                  <CardContent className="p-12">
                    <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <TrendingUp className="w-8 h-8 text-accent-primary" />
                    </div>
                    <h2 className="text-h2 font-bold text-text-primary mb-6">Our Vision</h2>
                    <p className="text-body-lg text-text-secondary leading-relaxed mb-6">
                      To be the leading digital agency in Egypt and beyond, recognized for our innovative approach, exceptional quality, and transformative impact on businesses and communities.
                    </p>
                    <p className="text-body text-text-secondary leading-relaxed">
                      We envision a future where every business, regardless of size, has access to world-class digital solutions that help them thrive in the digital economy.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section
          ref={storyRef}
          className="relative py-32 bg-background-secondary/50"
        >
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={storyVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border-subtle mb-8">
                <span className="text-small text-text-secondary">Our Journey</span>
              </div>
              
              <h2 className="text-h2 font-bold text-text-primary mb-8">
                From Vision to Reality
              </h2>
              
              <div className="space-y-8 text-body-lg text-text-secondary leading-relaxed">
                <p>
                  Founded in 2016, INFOGRA began with a simple yet powerful vision: to bridge the gap between 
                  exceptional design and cutting-edge technology. What started as a small team of passionate 
                  creators has grown into a full-service digital agency trusted by businesses worldwide.
                </p>
                
                <p>
                  Our journey has been marked by continuous growth, learning, and evolution. We&apos;ve had the 
                  privilege of working with startups, enterprises, and everything in between, each project 
                  teaching us something new and pushing us to be better.
                </p>
                
                <p>
                  Today, we stand as a team of diverse talents united by a common purpose: to create digital 
                  experiences that don&apos;t just look beautiful but drive real business results. We believe that 
                  great design and great technology must go hand in hand.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section
          ref={timelineRef}
          className="py-32"
        >
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={timelineVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center mb-20"
            >
              <h2 className="text-h2 font-bold text-text-primary mb-6">Our Timeline</h2>
              <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
                Key milestones in our journey of growth and innovation
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                  animate={timelineVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex gap-8 mb-12 last:mb-0"
                >
                  <div className="flex-shrink-0 w-24">
                    <div className="text-h3 font-bold gradient-text">{item.year}</div>
                  </div>
                  <Card className="flex-1 glass border-border-subtle">
                    <CardContent className="p-6">
                      <h3 className="text-h4 font-semibold text-text-primary mb-2">{item.title}</h3>
                      <p className="text-body text-text-secondary">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section
          ref={valuesRef}
          className="relative py-32 bg-background-secondary/50"
        >
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border-subtle mb-8">
                <span className="text-small text-text-secondary">What We Believe</span>
              </div>
              
              <h2 className="text-h2 font-bold text-text-primary mb-6">
                Our Core Values
              </h2>
              
              <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
                These principles guide everything we do, from how we work with clients to how we craft solutions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 60 }}
                  animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    delay: 0.2 + index * 0.1, 
                    duration: 1.2, 
                    ease: [0.25, 0.1, 0.25, 1] 
                  }}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  <Card className="h-full glass border-border-subtle hover:border-accent-primary/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-glow">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <value.icon className="w-8 h-8 text-accent-primary" />
                      </div>
                      
                      <h3 className="text-h4 font-semibold text-text-primary mb-4">
                        {value.title}
                      </h3>
                      
                      <p className="text-body text-text-secondary leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="relative py-32">
          <SectionBackground opacity={0.2} />
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={timelineVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border-subtle mb-8">
                <Code className="w-4 h-4 text-accent-primary" />
                <span className="text-small text-text-secondary">Our Tech</span>
              </div>
              <h2 className="text-h2 font-bold text-text-primary mb-6">Technology Stack</h2>
              <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
                Modern tools and frameworks we use to build exceptional digital experiences
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={timelineVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-small font-semibold text-text-primary mb-1">{tech.name}</div>
                      <div className="text-caption text-text-tertiary">{tech.category}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section
          ref={teamRef}
          className="relative py-32 bg-background-secondary/50"
        >
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={teamVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border-subtle mb-8">
                <span className="text-small text-text-secondary">The Team</span>
              </div>
              
              <h2 className="text-h2 font-bold text-text-primary mb-6">
                Meet Our Leaders
              </h2>
              
              <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
                The talented individuals who drive our vision forward every day.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 60 }}
                  animate={teamVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    delay: 0.2 + index * 0.1, 
                    duration: 1.2, 
                    ease: [0.25, 0.1, 0.25, 1] 
                  }}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  <Card className="h-full glass border-border-subtle hover:border-accent-primary/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-glow">
                    <CardContent className="p-8 text-center">
                      <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl font-bold text-white">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      
                      <h3 className="text-h4 font-semibold text-text-primary mb-2">
                        {member.name}
                      </h3>
                      
                      <p className="text-small text-accent-primary mb-4">
                        {member.role}
                      </p>
                      
                      <p className="text-body text-text-secondary leading-relaxed">
                        {member.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Card className="bg-gradient-primary border-none text-white overflow-hidden shadow-glow">
                <CardContent className="p-16 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold mb-8">Ready to Start Your Project?</h2>
                    <p className="text-body-lg md:text-h4 lg:text-h3 mb-12 opacity-90 leading-relaxed">
                      Let&apos;s create something amazing together. Get in touch and let&apos;s discuss how we can help bring your vision to life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Button size="xl" className="bg-white text-accent-primary hover:bg-background-tertiary" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                        Get in Touch
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button size="xl" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-accent-primary" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                        View Our Work
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
    </>
  )
}

export default About
