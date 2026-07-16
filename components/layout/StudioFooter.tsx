'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Send, Globe, Heart, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { footerNavigation, siteConfig } from '@/lib/navigation'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'

const StudioFooter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { elementRef, hasBeenVisible } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale, isRTL } = useLanguage()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribed(true)
    setTimeout(() => { setIsSubscribed(false); setEmail('') }, 3000)
  }

  const footerSections = [
    { icon: Globe, label: t(locale, 'footer.company'), links: footerNavigation.company },
    { icon: Send, label: t(locale, 'footer.services'), links: footerNavigation.services },
    { icon: Globe, label: t(locale, 'footer.resources'), links: footerNavigation.resources },
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/infogra', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/infogra', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/infogra', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/infogra', label: 'LinkedIn' },
  ]

  return (
    <footer ref={elementRef} className="relative bg-background-primary border-t border-border-subtle" role="contentinfo">
      <div className="container mx-auto px-4 md:px-8">
        <div className="py-16 md:py-20">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10 md:gap-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.8 }} className="lg:col-span-1">
              <Link href="/" className="text-2xl md:text-3xl font-bold gradient-text mb-6 block">INFOGRA</Link>
              <p className="text-body text-text-secondary leading-relaxed mb-8">
                {locale === 'ar' ? 'نصمم تجارب رقمية حيث يلتقي التصميم المبتكر مع التطوير القوي.' : 'We architect digital experiences where innovative design meets powerful development.'}
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a key={social.label} href={social.href} aria-label={social.label}
                    initial={{ opacity: 0, scale: 0.8 }} animate={hasBeenVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }} whileHover={{ scale: 1.1, y: -2 }}
                    onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}
                    className="w-11 h-11 glass rounded-xl flex items-center justify-center hover:bg-accent-primary/20 hover:text-accent-primary text-text-secondary transition-all">
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {footerSections.map((section, sectionIndex) => (
              <motion.div key={section.label} initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + sectionIndex * 0.1, duration: 0.8 }}>
                <div className="flex items-center gap-2 mb-5">
                  <section.icon className="w-5 h-5 text-accent-primary" />
                  <h3 className="text-h4 font-semibold text-text-primary">{section.label}</h3>
                </div>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}
                        className="text-body-sm text-text-secondary hover:text-accent-primary transition-colors flex items-center gap-2 group">
                        {link.name}
                        <ChevronRight className={`w-4 h-4 opacity-0 ${isRTL ? 'translate-x-2 group-hover:translate-x-0' : '-translate-x-2 group-hover:translate-x-0'} group-hover:opacity-100 transition-all`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 30 }} animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
              <h3 className="text-h4 font-semibold text-text-primary mb-4">{locale === 'ar' ? 'ابق على اطلاع' : 'Stay Updated'}</h3>
              <p className="text-body-sm text-text-secondary mb-5">{locale === 'ar' ? 'اشترك لتصلك أحدث المقالات والتحديثات.' : 'Subscribe for the latest insights and updates.'}</p>
              {isSubscribed ? (
                <div className="bg-accent-success/20 border border-accent-success/30 rounded-xl p-4 text-center">
                  <p className="text-accent-success text-small font-medium">Thank you for subscribing!</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'} required className="w-full" />
                  <Button type="submit" size="sm" variant="premium" className="w-full" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                    {locale === 'ar' ? 'اشتراك' : 'Subscribe'} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        <div className="border-t border-border-subtle py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <p className="text-small text-text-secondary">© {new Date().getFullYear()} INFOGRA. {t(locale, 'footer.rights')}</p>
              <div className="flex items-center gap-4">
                {footerNavigation.legal.map((link) => (
                  <Link key={link.name} href={link.href} className="text-small text-text-tertiary hover:text-accent-primary transition-colors">{link.name}</Link>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-small text-text-tertiary">
                {locale === 'ar' ? 'صنع بـ' : 'Made with'} <Heart className="w-4 h-4 text-accent-primary" /> {locale === 'ar' ? 'في مصر' : 'in Egypt'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-small text-text-secondary hover:text-accent-primary transition-colors">
                <Mail className="w-4 h-4" />{siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-small text-text-secondary hover:text-accent-primary transition-colors">
                <Phone className="w-4 h-4" />{siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default StudioFooter
