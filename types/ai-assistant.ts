export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  suggestions?: string[]
  products?: ProductSuggestion[]
  services?: ServiceSuggestion[]
  navigation?: NavigationAction[]
}

export interface ProductSuggestion {
  id: string
  name: string
  price: number
  image?: string
  slug: string
  reason: string
}

export interface ServiceSuggestion {
  id: string
  name: string
  description: string
  icon: string
  href: string
  reason: string
}

export interface NavigationAction {
  label: string
  href: string
  icon?: string
}

export interface ConversationContext {
  currentPage: string
  pageType: PageType
  language: 'en' | 'ar'
  preferences: UserPreferences
  messageHistory: Message[]
}

export type PageType = 
  | 'home' 
  | 'store' 
  | 'product' 
  | 'services' 
  | 'portfolio' 
  | 'contact' 
  | 'faq' 
  | 'about'
  | 'blog'
  | 'other'

export interface UserPreferences {
  language: 'en' | 'ar'
  budget?: [number, number]
  interests: string[]
  viewedProducts: string[]
  conversationCount: number
}

export interface AIAssistantState {
  isOpen: boolean
  isTyping: boolean
  messages: Message[]
  suggestions: string[]
  context: ConversationContext
}
