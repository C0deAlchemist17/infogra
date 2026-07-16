'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type Locale = 'en' | 'ar'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  isRTL: boolean
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem('infogra-locale') as Locale | null
      if (stored === 'ar' || stored === 'en') {
        setLocaleState(stored)
      }
    } catch {}
  }, [])

  // Apply locale to html element (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const html = document.documentElement
    html.setAttribute('lang', locale)
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    try {
      localStorage.setItem('infogra-locale', locale)
    } catch {}
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState(prev => prev === 'en' ? 'ar' : 'en')
  }, [])

  const isRTL = locale === 'ar'

  // Always wrap in provider to support SSR / static generation.
  // The actual dir/lang attributes and localStorage are handled client-side via useEffect.
  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        isRTL,
        dir: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
