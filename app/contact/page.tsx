'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AnimatedText from '@/components/ui/AnimatedText'
import MagneticButton from '@/components/ui/MagneticButton'
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle } from 'lucide-react'

export default function Contact() {
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { elementRef: heroRef, hasBeenVisible: heroVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })

  const { elementRef: formRef, hasBeenVisible: formVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'infogra174@gmail.com',
      link: 'mailto:infogra174@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+20 106 186 6211',
      link: 'tel:+201061866211'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Alexandria, Egypt',
      link: '#'
    }
  ]

  return (
    <div className="min-h-screen bg-background-primary">
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="grid-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-background-primary via-background-primary/90 to-background-primary" />
        </div>

        <motion.div 
          className="relative z-10 text-center max-w-6xl mx-auto px-6"
          initial={{ opacity: 0, y: 60 }}
          animate={heroVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-accent-primary text-sm tracking-widest uppercase font-semibold">
              Get in Touch
            </span>
            <div className="w-16 h-px bg-accent-primary" />
          </div>
          
          <AnimatedText
            text="Let&apos;s Create Something Amazing Together"
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-8 leading-tight"
            type="words"
            animation="slideUp"
            stagger={0.1}
            delay={0.2}
          />
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section 
        ref={formRef}
        className="py-24 bg-background-secondary"
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={formVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-text-primary mb-4">Contact Information</h2>
                <p className="text-text-secondary text-lg">
                  Reach out to us through any of these channels. We&apos;re always ready to discuss your next project.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={formVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                    className="block group"
                  >
                    <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                          <info.icon className="w-6 h-6 text-accent-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-text-secondary mb-1">{info.title}</div>
                          <div className="text-text-primary font-medium group-hover:text-accent-primary transition-colors">
                            {info.value}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.a>
                ))}
              </div>

              <Card className="glass border-border-subtle mt-8">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-text-primary mb-4">Working Hours</h3>
                  <div className="space-y-3 text-text-secondary">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="text-text-primary">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="text-text-primary">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-text-primary">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={formVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
            >
              <Card className="glass border-border-subtle shadow-glow">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-text-primary mb-4">Message Sent!</h3>
                      <p className="text-text-secondary">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="bg-background-tertiary/50 border-border-subtle focus:border-accent-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="bg-background-tertiary/50 border-border-subtle focus:border-accent-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-2">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Project Inquiry"
                          className="bg-background-tertiary/50 border-border-subtle focus:border-accent-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          placeholder="Tell us about your project..."
                          className="w-full px-4 py-3 bg-background-tertiary/50 border border-border-subtle rounded-lg focus:border-accent-primary focus:outline-none transition-colors resize-none text-text-primary placeholder:text-text-secondary/50"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-accent-primary text-white hover:bg-accent-secondary hover:shadow-glow group"
                        onMouseEnter={addHoverEffect}
                        onMouseLeave={removeHoverEffect}
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background-primary">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={formVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Let&apos;s discuss how we can help bring your vision to life.
            </p>
            <MagneticButton
              size="xl"
              className="bg-accent-primary text-white hover:bg-accent-secondary hover:shadow-glow"
            >
              Schedule a Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
