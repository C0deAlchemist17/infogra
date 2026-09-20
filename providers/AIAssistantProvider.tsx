'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Message, UserPreferences, PageType } from '@/types/ai-assistant'
import { generateResponse, getPageType } from '@/lib/ai/conversation-service'

interface AIAssistantContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isTyping: boolean
  messages: Message[]
  suggestions: string[]
  preferences: UserPreferences
  sendMessage: (content: string) => void
  clearChat: () => void
  trackProductView: (productId: string) => void
  currentPage: string
  pageType: PageType
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined)

const defaultPreferences: UserPreferences = {
  language: undefined, // No default - detect from user input
  budget: undefined,
  interests: [],
  viewedProducts: [],
  conversationCount: 0,
}

// Pure functions - defined outside component to avoid recreation on every render
function extractBudget(content: string): [number, number] | undefined {
  const budgetPatterns = [
    /under\s*(\d[\d,]*)/i,
    /below\s*(\d[\d,]*)/i,
    /less than\s*(\d[\d,]*)/i,
    /أقل من\s*(\d[\d,]*)/,
    /تحت\s*(\d[\d,]*)/,
    /ميزانية\s*(\d[\d,]*)/,
    /budget\s*(\d[\d,]*)/i,
    // Egyptian Arabic patterns
    /في حدود\s*(\d[\d,]*)/,
    /حول\s*(\d[\d,]*)/,
    /تقريبا\s*(\d[\d,]*)/,
    /حوالي\s*(\d[\d,]*)/,
    // Mixed patterns
    /(\d[\d,]*)\s*egp/i,
    /(\d[\d,]*)\s*ج\.م/i,
    /(\d[\d,]*)\s*جنيه/i,
    /(\d[\d,]*)\s*k/i,
    /(\d[\d,]*)\s*الف/i,
  ]
  for (const pattern of budgetPatterns) {
    const match = content.match(pattern)
    if (match) {
      let num = parseInt(match[1].replace(/,/g, ''), 10)
      // Handle "k" or "الف" (thousand)
      if (content.toLowerCase().includes('k') || content.includes('الف')) {
        num = num * 1000
      }
      if (!isNaN(num) && num > 0) return [0, num]
    }
  }
  return undefined
}

function extractInterests(content: string): string[] {
  const interests: string[] = []
  const interestKeywords: Record<string, string[]> = {
    gaming: ['gaming', 'game', 'gamer', 'ألعاب', 'قيمر', 'جيمنج', 'لعب', 'لعيب'],
    programming: ['programming', 'code', 'developer', 'برمجة', 'مطور', 'كود', 'سوفتوير'],
    design: ['design', 'designer', 'ui', 'ux', 'تصميم', 'ديزاين', 'جرافيك'],
    business: ['business', 'office', 'company', 'أعمال', 'مكتب', 'شركة'],
    editing: ['editing', 'video', 'photo', 'photo editing', 'مونتاج', 'تصوير', 'فيديو'],
    content: ['content', 'social media', 'content creation', 'محتوى', 'سوشيال ميديا'],
    music: ['music', 'audio', 'sound', 'موسيقى', 'صوت', 'أوديو'],
    student: ['student', 'study', 'school', 'university', 'طالب', 'دراسة', 'جامعة'],
    casual: ['casual', 'home', 'personal', 'استخدام شخصي', 'بيت', 'منزلي'],
  }
  const contentLower = content.toLowerCase()
  for (const [interest, keywords] of Object.entries(interestKeywords)) {
    if (keywords.some(k => contentLower.includes(k))) {
      interests.push(interest)
    }
  }
  return interests
}

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([
    'Featured Products', 'Our Services', 'Build PC', 'Contact Us'
  ])
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  
  const pathname = usePathname()
  const pageType = getPageType(pathname)

  // Keyboard shortcut: Ctrl+/ or Cmd+/ to toggle assistant
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Welcome message on first open - removed to let user initiate conversation
  // This ensures language detection happens from user input, not default
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Empty welcome - let user speak first for language detection
      setSuggestions(['Featured Products', 'Our Services', 'Build PC', 'Contact Us'])
    }
  }, [isOpen, messages.length])

  // Update suggestions based on page type
  useEffect(() => {
    const pageSuggestions: Record<PageType, string[]> = {
      home: ['Featured Products', 'Our Services', 'Build PC', 'Contact Us'],
      store: ['Gaming Laptops', 'Graphics Cards', 'Build PC', 'Deals'],
      product: ['Specifications', 'Compare', 'WhatsApp Inquiry', 'Related Products'],
      services: ['Web Development', 'UI/UX Design', 'Branding', 'AI Solutions'],
      portfolio: ['Our Process', 'Start Project', 'View Services', 'Contact Us'],
      contact: ['Send Message', 'WhatsApp', 'Book Consultation', 'Office Location'],
      faq: ['Contact Support', 'View Services', 'Build PC', 'Store'],
      about: ['Our Team', 'Services', 'Portfolio', 'Contact'],
      blog: ['Latest Posts', 'Subscribe', 'Contact Us', 'Services'],
      other: ['Home', 'Store', 'Services', 'Contact'],
    }
    setSuggestions(pageSuggestions[pageType] || pageSuggestions.other)
  }, [pageType])

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Detect language
    const detectedLang = /[\u0600-\u06FF]/.test(content) ? 'ar' : 'en'
    
    // Extract and update preferences
    const budget = extractBudget(content)
    const interests = extractInterests(content)
    
    setPreferences(prev => ({
      ...prev,
      language: detectedLang as 'en' | 'ar',
      conversationCount: prev.conversationCount + 1,
      budget: budget || prev.budget,
      interests: interests.length > 0 
        ? Array.from(new Set([...prev.interests, ...interests]))
        : prev.interests,
    }))

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    try {
      // Get fresh preferences for response generation
      const currentPrefs: UserPreferences = {
        language: detectedLang as 'en' | 'ar',
        conversationCount: preferences.conversationCount + 1,
        budget: budget || preferences.budget,
        interests: interests.length > 0 
          ? Array.from(new Set([...preferences.interests, ...interests]))
          : preferences.interests,
        viewedProducts: preferences.viewedProducts,
      }
      
      const result = await generateResponse(content, pageType, detectedLang, currentPrefs)

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
        products: result.products,
        services: result.services,
        navigation: result.navigation,
        suggestions: result.suggestions
      }

      setMessages(prev => [...prev, assistantMessage])
      setSuggestions(result.suggestions)
    } catch (error) {
      console.error('AI response error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: detectedLang === 'ar'
          ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى. 😊'
          : 'Sorry, something went wrong. Please try again. 😊',
        timestamp: Date.now(),
        suggestions: detectedLang === 'ar'
          ? ['تواصل معنا', 'الرئيسية']
          : ['Contact Us', 'Home']
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }, [pageType, preferences])

  const trackProductView = useCallback((productId: string) => {
    setPreferences(prev => ({
      ...prev,
      viewedProducts: Array.from(new Set([...prev.viewedProducts, productId])).slice(-20)
    }))
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    setPreferences(defaultPreferences)
    setSuggestions(['Featured Products', 'Our Services', 'Build PC', 'Contact Us'])
  }, [])

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isTyping,
        messages,
        suggestions,
        preferences,
        sendMessage,
        clearChat,
        trackProductView,
        currentPage: pathname,
        pageType
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  )
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext)
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider')
  }
  return context
}
