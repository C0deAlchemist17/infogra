'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Menu, X, Phone, ArrowRight, ChevronDown, Search, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mainNavigation, siteConfig } from '@/lib/navigation'
import { useLanguage } from '@/providers/LanguageProvider'
import { t } from '@/lib/translations'
import { cn } from '@/lib/utils'

const StudioHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { cursorRef, addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { locale, toggleLocale, isRTL } = useLanguage()

  const navLabel = (name: string): string => {
    const key: Record<string, string> = {
      'Home': 'nav.home',
      'Store': 'nav.store',
      'Services': 'nav.services',
      'Work': 'nav.work',
      'About': 'nav.about',
      'Blog': 'nav.blog',
      'Contact': 'nav.contact',
      'Search': 'nav.search',
    }
    const tk = key[name]
    return tk ? t(locale, tk as any) : name
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsMegaMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('#')) return false
    return pathname.startsWith(href)
  }

  const handleHashNav = (href: string) => {
    if (pathname !== '/') {
      router.push('/' + href)
    } else {
      if (typeof window !== 'undefined') {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background-primary/95 backdrop-blur-xl z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm glass-strong shadow-2xl p-8 border-l border-border-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-h3 font-bold text-text-primary">{locale === 'ar' ? 'القائمة' : 'Menu'}</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-background-tertiary" aria-label="Close menu">
                  <X className="w-6 h-6 text-text-primary" />
                </button>
              </div>
              <nav className="space-y-2" aria-label="Mobile navigation">
                {mainNavigation.map((item) =>
                  item.href.startsWith('#') ? (
                    <button key={item.name} onClick={() => { handleHashNav(item.href); setIsMobileMenuOpen(false) }}
                      className="block w-full text-left px-6 py-4 rounded-xl text-text-secondary hover:bg-background-tertiary hover:text-text-primary">
                      {navLabel(item.name)}
                    </button>
                  ) : (
                    <Link key={item.name} href={item.href}
                      className={cn('block w-full text-left px-6 py-4 rounded-xl transition-all',
                        isActive(item.href) ? 'bg-accent-primary text-white' : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary')}>
                      {navLabel(item.name)}
                    </Link>
                  )
                )}
                <Link href="/search" className="block w-full text-left px-6 py-4 rounded-xl text-text-secondary hover:bg-background-tertiary hover:text-text-primary">{navLabel('Search')}</Link>
              </nav>
              <div className="mt-6 pt-6 border-t border-border-subtle space-y-3">
                {/* Language Toggle in Mobile Menu */}
                <button
                  onClick={() => { toggleLocale(); setIsMobileMenuOpen(false) }}
                  className="flex items-center gap-3 w-full px-6 py-4 rounded-xl text-text-secondary hover:bg-background-tertiary hover:text-text-primary transition-all"
                >
                  <Globe className="w-5 h-5" />
                  <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
                </button>
                <Button asChild size="lg" className="w-full">
                  <Link href="/contact">{locale === 'ar' ? 'ابدأ مشروعك' : 'Start Your Project'} <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} /></Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMegaMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-40 hidden lg:block">
            <div className="glass-strong border-t border-border-subtle shadow-large">
              <div className="container mx-auto px-8 py-12">
                <div className="grid grid-cols-3 gap-8">
                  {mainNavigation.find(n => n.hasDropdown)?.children?.map((service, index) => (
                    <motion.div key={service.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                      <Link href={service.href} className="block p-6 rounded-xl hover:bg-background-tertiary transition-all group"
                        onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                        <h3 className="text-h4 font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">{service.name}</h3>
                        <p className="text-small text-text-secondary">{service.description}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        className={cn('fixed top-0 left-0 right-0 z-30 transition-all duration-400', isScrolled ? 'glass py-4' : 'bg-transparent py-6')}
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        role="banner"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text" aria-label="INFOGRA Home">INFOGRA</Link>

            <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
              {mainNavigation.map((item) => (
                <div key={item.name} className="relative"
                  onMouseEnter={() => item.hasDropdown && setIsMegaMenuOpen(true)}
                  onMouseLeave={() => item.hasDropdown && setIsMegaMenuOpen(false)}>
                  {item.href.startsWith('#') ? (
                    <button onClick={() => handleHashNav(item.href)} onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}
                      className="px-3 py-2 text-text-secondary hover:text-text-primary transition-colors">{navLabel(item.name)}</button>
                  ) : (
                    <Link href={item.href} onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}
                      className={cn('relative px-3 py-2 transition-colors inline-flex items-center gap-1',
                        isActive(item.href) ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary')}>
                      {navLabel(item.name)}
                      {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                      <span className={cn('absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary transition-opacity', isActive(item.href) ? 'opacity-100' : 'opacity-0')} />
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher Button */}
              <motion.button
                onClick={toggleLocale}
                onMouseEnter={addHoverEffect}
                onMouseLeave={removeHoverEffect}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl border border-border-subtle hover:border-accent-primary/50 bg-background-primary/50 hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{locale === 'en' ? 'AR' : 'EN'}</span>
                <motion.div
                  className="absolute inset-0 rounded-xl bg-accent-primary/5"
                  initial={false}
                  animate={{ opacity: isRTL ? 0.5 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <Button asChild variant="ghost" size="icon" aria-label={locale === 'en' ? 'Search' : 'بحث'}>
                <Link href="/search"><Search className="w-4 h-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-accent-primary text-accent-primary">
                <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}><Phone className="w-4 h-4 ltr:mr-2 rtl:ml-2" />{siteConfig.phone}</a>
              </Button>
              <Button asChild size="sm" variant="premium">
                <Link href="/contact">{locale === 'en' ? 'Get Started' : 'ابدأ مشروعك'} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} /></Link>
              </Button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl text-text-primary hover:bg-background-tertiary" aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <div ref={cursorRef} className="custom-cursor hidden md:block" />
    </>
  )
}

export default StudioHeader
