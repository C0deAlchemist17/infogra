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
  language: 'en',
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
  ]
  for (const pattern of budgetPatterns) {
    const match = content.match(pattern)
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ''), 10)
      if (!isNaN(num) && num > 0) return [0, num]
    }
  }
  return undefined
}

function extractInterests(content: string): string[] {
  const interests: string[] = []
  const interestKeywords: Record<string, string[]> = {
    gaming: ['gaming', 'game', 'gamer', 'ألعاب', 'قيمر'],
    programming: ['programming', 'code', 'developer', 'برمجة', 'مطور'],
    design: ['design', 'designer', 'ui', 'ux', 'تصميم'],
    business: ['business', 'office', 'company', 'أعمال', 'مكتب'],
    editing: ['editing', 'video', 'photo', 'photo editing', 'مونتاج', 'تصوير'],
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

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const isArabic = preferences.language === 'ar'
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: isArabic
          ? 'مرحباً! 👋 أنا مساعد INFOGRA الذكي. كيف يمكنني مساعدتك اليوم؟'
          : 'Hello! 👋 I\'m the INFOGRA AI Assistant. How can I help you today?',
        timestamp: Date.now(),
        suggestions: isArabic
          ? ['المنتجات المميزة', 'خدماتنا', 'بناء PC', 'تواصل معنا']
          : ['Featured Products', 'Our Services', 'Build PC', 'Contact Us']
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, preferences.language])

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
      
      const result = generateResponse(content, pageType, detectedLang, currentPrefs)

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
