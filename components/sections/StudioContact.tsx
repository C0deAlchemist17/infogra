'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const SectionBackground = dynamic(() => import('@/components/three/SectionBackground'), {
  ssr: false,
  loading: () => null
})
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const StudioContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { elementRef, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  const services = [
    'Web Development',
    'UI/UX Design',
    'Digital Marketing',
    'Brand Strategy',
    'Consulting',
    'Other'
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'infogra174@gmail.com',
      link: 'mailto:infogra174@gmail.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+20 106 186 6211',
      link: 'tel:+201061866211',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Alexandria, Egypt',
      link: '#',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!formData.name.trim()) {
      alert('Please enter your name')
      return
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }
    if (!formData.message.trim()) {
      alert('Please enter a message')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', phone: '', company: '', message: '', service: '' })
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
    
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section
      ref={elementRef}
      id="contact"
      className="relative py-40 bg-background-secondary/50"
    >
      <SectionBackground opacity={0.2} />
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-8">
            <span className="text-small text-text-secondary">Get in Touch</span>
          </div>
          <h2 id="contact-heading" className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8">
            Let&apos;s Start Your Project
          </h2>
          <p className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Ready to transform your digital presence? We&apos;d love to hear from you. Let&apos;s create something extraordinary together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={hasBeenVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-2"
          >
            <Card className="glass-strong border-border-subtle">
              <CardContent className="p-16">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-accent-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-accent-success" />
                    </div>
                    <h3 className="text-h3 font-bold text-text-primary mb-4">
                      Thank You!
                    </h3>
                    <p className="text-body text-text-secondary">
                      Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-labelledby="contact-heading">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-small font-medium text-text-primary mb-2">
                          Name *
                        </label>
                        <Input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-small font-medium text-text-primary mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          aria-required="true"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-small font-medium text-text-primary mb-2">
                          Phone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-small font-medium text-text-primary mb-2">
                          Company
                        </label>
                        <Input
                          id="company"
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-small font-medium text-text-primary mb-2">
                        Service Interest
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="flex h-14 w-full rounded-xl border border-border-subtle bg-background-tertiary/50 px-6 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-400 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
                      >
                        <option value="">Select a service</option>
                        {services.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-small font-medium text-text-primary mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="flex w-full rounded-xl border border-border-subtle bg-background-tertiary/50 px-6 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-400 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 resize-none"
                        placeholder="Tell us about your project..."
                        aria-required="true"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      variant="premium"
                      disabled={isSubmitting}
                      className="w-full"
                      onMouseEnter={addHoverEffect}
                      onMouseLeave={removeHoverEffect}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={hasBeenVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-h3 font-bold text-text-primary mb-6">Contact Information</h3>
              <p className="text-body text-text-secondary mb-8 leading-relaxed">
                Have a project in mind? We&apos;d love to hear about it. Reach out and let&apos;s start the conversation.
              </p>
            </div>

            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.15, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Card className="glass border-border-subtle hover:border-accent-primary/30 transition-all duration-700 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-6`}>
                      <info.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-small font-semibold text-text-primary mb-3">{info.title}</h3>
                    <a 
                      href={info.link}
                      className="text-body text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      {info.value}
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Card className="glass border-border-subtle">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-accent-primary" />
                    <h3 className="text-small font-semibold text-text-primary">Business Hours</h3>
                  </div>
                  <div className="space-y-3 text-body text-text-secondary">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Chat CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Card className="bg-gradient-primary border-none text-white overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <MessageSquare className="w-10 h-10 mb-6 relative z-10" />
                  <h3 className="text-h4 font-bold mb-3 relative z-10">Need Quick Help?</h3>
                  <p className="text-body mb-6 opacity-90 relative z-10 leading-relaxed">
                    Chat with us directly for immediate assistance.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-2 border-white text-white hover:bg-white hover:text-accent-primary w-full relative z-10"
                    onMouseEnter={addHoverEffect}
                    onMouseLeave={removeHoverEffect}
                    onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-assistant'))}
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default StudioContact
