'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import AnimatedText from '@/components/ui/AnimatedText'
import RevealImage from '@/components/ui/RevealImage'
import MagneticButton from '@/components/ui/MagneticButton'
import { Target, Users, TrendingUp, Award, ArrowRight, CheckCircle, Lightbulb, Rocket } from 'lucide-react'

const StudioAbout = () => {
  const [activeTab, setActiveTab] = useState('skills')
  
  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollTrigger({ 
    threshold: 0.1,
    triggerOnce: true 
  })

  const skills = [
    { name: 'React/Next.js', level: 95, color: 'from-blue-500 to-cyan-500' },
    { name: 'TypeScript', level: 90, color: 'from-indigo-500 to-purple-500' },
    { name: 'UI/UX Design', level: 85, color: 'from-pink-500 to-rose-500' },
    { name: 'Node.js', level: 88, color: 'from-green-500 to-emerald-500' },
    { name: 'Tailwind CSS', level: 92, color: 'from-teal-500 to-cyan-500' },
    { name: 'Framer Motion', level: 80, color: 'from-orange-500 to-red-500' }
  ]

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We embrace cutting-edge technologies and creative solutions to stay ahead of the curve.'
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Your success is our priority. We build long-term partnerships based on trust and results.'
    },
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'Every decision is made with your business goals in mind, ensuring measurable impact.'
    },
    {
      icon: Rocket,
      title: 'Agile Approach',
      description: 'We adapt quickly to changes and deliver solutions that evolve with your needs.'
    }
  ]

  const stats = [
    { value: '50+', label: 'Projects Completed', icon: Award },
    { value: '30+', label: 'Happy Clients', icon: Users },
    { value: '5+', label: 'Years Experience', icon: TrendingUp },
    { value: '10+', label: 'Team Members', icon: Target }
  ]

  const SkillBar = ({ skill, index }: { skill: typeof skills[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={sectionVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-primary">{skill.name}</span>
        <span className="text-sm text-text-secondary">{skill.level}%</span>
      </div>
      <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={sectionVisible ? { width: `${skill.level}%` } : {}}
          transition={{ delay: 0.6 + index * 0.1, duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
        />
      </div>
    </motion.div>
  )

  const ValueCard = ({ value, index }: { value: typeof values[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={sectionVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="bg-background-tertiary p-6 rounded-2xl border border-border-subtle hover:shadow-glow transition-all duration-300"
    >
      <div className="w-12 h-12 bg-accent-primary/20 rounded-xl flex items-center justify-center mb-4">
        <value.icon className="w-6 h-6 text-accent-primary" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{value.title}</h3>
      <p className="text-text-secondary leading-relaxed">{value.description}</p>
    </motion.div>
  )

  const StatCard = ({ stat, index }: { stat: typeof stats[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={sectionVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
      className="text-center"
    >
      <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <stat.icon className="w-8 h-8 text-accent-primary" />
      </div>
      <div className="text-3xl font-bold text-text-primary mb-2">{stat.value}</div>
      <div className="text-sm text-text-secondary">{stat.label}</div>
    </motion.div>
  )

  return (
    <section 
      ref={sectionRef}
      id="about"
      className="py-24 bg-background-secondary"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <AnimatedText
            text="About Infogra"
            className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
            type="words"
            animation="slideUp"
            stagger={0.1}
          />
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            We are architects of digital experiences, crafting innovative solutions that bridge the gap between design and technology
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={sectionVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              We Architect the Digital Experience
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              In today&apos;s digital age, your online presence is your storefront. At INFOGRA, we&apos;re more than just web developers and graphic designers; we&apos;re architects of the digital experience.
            </p>
            <p className="text-text-secondary leading-relaxed mb-8">
              We understand the power of a captivating website built with a seamless user journey in mind. Our team of passionate creatives and technical wizards weave together stunning visuals with robust code.
            </p>

            {/* Key Features */}
            <div className="space-y-4 mb-8">
              {[
                'Collaborative Approach',
                'Design & Development Sync',
                'Data-Driven Strategies',
                'Cutting-Edge Technology'
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={sectionVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                  <span className="text-text-secondary">{feature}</span>
                </motion.div>
              ))}
            </div>

            <MagneticButton
              size="lg"
              className="bg-accent-primary text-white hover:bg-accent-secondary hover:shadow-glow"
            >
              Learn More About Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </MagneticButton>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={sectionVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden">
              <RevealImage
                src="/images/work-1.jpg"
                alt="About Infogra"
                direction="up"
                delay={0.6}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-primary/20 to-transparent" />
            </div>
            
            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={sectionVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 bg-background-tertiary rounded-2xl p-6 shadow-glow"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">5+</div>
                <div className="text-sm text-text-secondary">Years Experience</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-16"
        >
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-background-tertiary rounded-full p-1">
              {[
                { id: 'skills', label: 'Skills' },
                { id: 'values', label: 'Values' },
                { id: 'stats', label: 'Stats' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-accent-primary text-white shadow-glow'
                      : 'text-text-secondary hover:text-accent-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'skills' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-6">Technical Expertise</h3>
                  {skills.map((skill, index) => (
                    <SkillBar key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-6">Design Skills</h3>
                  <div className="space-y-4">
                    {[
                      'UI/UX Design Principles',
                      'User Research & Testing',
                      'Prototyping & Wireframing',
                      'Design Systems',
                      'Brand Identity',
                      'Motion Design'
                    ].map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: 20 }}
                        animate={sectionVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                        className="flex items-center gap-3 p-3 bg-background-tertiary rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-accent-primary" />
                        <span className="text-text-secondary">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <ValueCard key={value.title} value={value} index={index} />
                ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <StatCard key={stat.label} stat={stat} index={index} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StudioAbout
