import { Message, PageType, UserPreferences, ProductSuggestion, ServiceSuggestion } from '@/types/ai-assistant'
import { categories as staticCategories, brands as staticBrands } from '@/data/products'

// Type for product from JSON storage
interface StorageProduct {
  id: string
  name: string
  price: number
  images: string[]
  slug: string
  brand: string
  category: string
  description?: string
  specifications?: Record<string, any>
  features?: string[]
  stock?: number
}

// Fetch products from JSON storage
async function fetchProductsFromStorage(): Promise<StorageProduct[]> {
  try {
    const response = await fetch('/api/products?storage=true&limit=100')
    if (response.ok) {
      const data = await response.json()
      return data.products || []
    }
  } catch (error) {
    console.error('Failed to fetch products from storage:', error)
  }
  return []
}

// Cache products to avoid repeated API calls
let cachedProducts: StorageProduct[] = []
let productsCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getProducts(): Promise<StorageProduct[]> {
  const now = Date.now()
  if (cachedProducts.length > 0 && now - productsCacheTime < CACHE_DURATION) {
    return cachedProducts
  }
  cachedProducts = await fetchProductsFromStorage()
  productsCacheTime = now
  return cachedProducts
}

// Language detection based on user input
function detectLanguage(text: string): 'en' | 'ar' {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  return arabicRegex.test(text) ? 'ar' : 'en'
}

// Get page context
export function getPageType(pathname: string): PageType {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/store')) return pathname.includes('/product/') ? 'product' : 'store'
  if (pathname.startsWith('/services')) return 'services'
  if (pathname.startsWith('/projects') || pathname.startsWith('/portfolio')) return 'portfolio'
  if (pathname.startsWith('/contact')) return 'contact'
  if (pathname.startsWith('/faq')) return 'faq'
  if (pathname.startsWith('/about')) return 'about'
  if (pathname.startsWith('/blog')) return 'blog'
  return 'other'
}

// Super human-like intelligent responses with enhanced context awareness
const intelligentResponses = {
  greeting: {
    en: [
      "Hello! I'm your advanced INFOGRA AI assistant. I can help you with our services, products, technical questions, comparisons, recommendations, and much more. What would you like to explore today?",
      "Welcome! I'm your intelligent INFOGRA companion. I have access to our entire product catalog, services, and can provide detailed technical advice. How can I assist you?",
      "Hi there! I'm your smart INFOGRA assistant powered by advanced AI. I can help with product comparisons, technical specifications, service recommendations, and answer complex questions. What interests you?"
    ],
    ar: [
      "أهلاً وسهلاً! أنا مساعد INFOGRA الذكي المتقدم. أقدر أساعدك في خدماتنا، منتجاتنا، الأسئلة التقنية، المقارنات، التوصيات، وأكتر كتير. إيه اللي عايز تستكشف النهاردة؟",
      "مرحباً! أنا رفيق INFOGRA الذكي. عندي وصول لكل كتالوج منتجاتنا وخدماتنا، وأقدر أقدم نصائح تقنية مفصلة. إيه اللي ممكن أساعدك فيه؟",
      "يا هلا! أنا مساعد INFOGRA الذكي المدعوم بذكاء اصطناعي متقدم. أقدر أساعد في مقارنات المنتجات، المواصفات التقنية، توصيات الخدمات، والإجابة على أسئلة معقدة. إيه اللي يهمك؟"
    ]
  },
  thanks: {
    en: [
      "You're welcome! I'm always here if you need any assistance. Is there anything else I can help you with?",
      "My pleasure! Don't hesitate to reach out if you have more questions. I'm here to help!",
      "Glad I could help! Feel free to ask me anything else you need. I'm at your service!"
    ],
    ar: [
      "عفواً! أنا دايماً موجود لو محتاج أي حاجة تانية. في حاجة تانية؟",
      "يسعدني! لو عندك أي سؤال تاني، تفضل اسألني. أنا هنا عشان أساعدك!",
      "الله يخليك! متحرش تسأل في أي وقت، أنا موجود عشان أساعدك!"
    ]
  },
  help: {
    en: [
      "I can help you with: product research and comparisons, technical specifications, service recommendations, project consultations, system optimization, custom PC builds, finding the best deals, answering technical questions, and much more. What specific area would you like to explore?",
      "I'm your comprehensive assistant for: detailed product analysis, performance comparisons, service selection, technical troubleshooting, budget optimization, component recommendations, and expert advice. What would you like to focus on?",
      "Let me assist you with: finding the perfect products, understanding technical specs, comparing options, getting service recommendations, building custom systems, optimizing performance, and providing expert guidance. What interests you most?"
    ],
    ar: [
      "أقدر أساعدك في: بحث المنتجات والمقارنات، المواصفات التقنية، توصيات الخدمات، استشارات المشاريع، تحسين الأنظمة، تجميع PC مخصص، أفضل العروض، الإجابة على الأسئلة التقنية، وأكتر كتير. إيه المجال اللي عايز تستكشف؟",
      "أنا مساعدك الشامل لـ: تحليل المنتجات المفصل، مقارنات الأداء، اختيار الخدمات، حل المشاكل التقنية، تحسين الميزانية، توصيات المكونات، ونصائح الخبراء. إيه اللي عايز تركز عليه؟",
      "خليني أساعدك في: إيجاد المنتجات المثالية، فهم المواصفات التقنية، مقارنة الخيارات، الحصول على توصيات الخدمات، تجميع أنظمة مخصصة، تحسين الأداء، وتقديم إرشادات الخبراء. إيه اللي يهمك أكتر؟"
    ]
  },
  notFound: {
    en: [
      "I couldn't find what you're looking for. Let me help you find it - could you try different keywords or check our products page?",
      "I didn't find a match for that. Would you like me to help you search differently or explore our products?",
      "No exact match found. Let me help you find what you need - could you rephrase or try searching our products?"
    ],
    ar: [
      "مش لاقي حاجة مظبوطة لبحثك. خليني أساعدك تلاقيها - ممكن تجرب كلمات تانية أو تستكشف منتجاتنا؟",
      "معلش، مش لاقي النتيجة المظبوطة. تحب أساعدك بطريقة تانية أو تستكشف منتجاتنا؟",
      "مش لاقي تطابق دقيق. خليني أساعدك تلاقي اللي تحتاج - ممكن تعيد صياغة السؤال أو تبحث في منتجاتنا؟"
    ]
  }
}

// Arabic to English mapping for common tech terms (including Egyptian Arabic)
const arabicToEnglish: Record<string, string[]> = {
  'لابتوب': ['laptop', 'notebook'],
  'جهاز': ['pc', 'computer'],
  'شاشة': ['monitor', 'display'],
  'لوحة مفاتيح': ['keyboard'],
  'كيبورد': ['keyboard'],
  'ماوس': ['mouse'],
  'كرت شاشة': ['gpu', 'graphics', 'video card'],
  'بروسسور': ['cpu', 'processor'],
  'رام': ['ram', 'memory'],
  'كارت شاشة': ['gpu', 'graphics'],
  'سماعة': ['headset', 'headphones'],
  'طابعة': ['printer'],
  'روتر': ['router', 'wifi'],
  'كيس': ['case', 'chassis'],
  'مروحة': ['fan', 'cooling'],
  'power supply': ['psu', 'power'],
  // Egyptian Arabic variations
  'بوت': ['laptop', 'pc'],
  'كمبيوتر': ['pc', 'computer'],
  'مونيتور': ['monitor', 'display'],
  'جرافيكس': ['gpu', 'graphics'],
  'هارد': ['hdd', 'storage'],
  'استوريج': ['storage', 'ssd'],
  'سوكت': ['socket'],
  'مذربورد': ['motherboard'],
  'كارت صوت': ['sound card'],
  'كارت شبكة': ['network card'],
  'شحن': ['charger', 'power adapter'],
  'بطارية': ['battery'],
  'فلاش': ['flash drive', 'usb'],
  'ميموري': ['memory', 'ram'],
  'بروسيس': ['cpu', 'processor'],
  'جرافيك': ['gpu', 'graphics'],
}

// Advanced product search with multi-factor scoring
async function searchProducts(query: string, language: 'en' | 'ar', budget?: [number, number]): Promise<ProductSuggestion[]> {
  const queryLower = query.toLowerCase()
  const results: ProductSuggestion[] = []

  // Fetch products from storage
  const products = await getProducts()

  // Expand query with Arabic mappings
  let expandedQuery = queryLower
  for (const [arabic, englishTerms] of Object.entries(arabicToEnglish)) {
    if (queryLower.includes(arabic)) {
      expandedQuery += ' ' + englishTerms.join(' ')
    }
  }

  // Detect intent from query
  const isGaming = queryLower.includes('gaming') || queryLower.includes('جيمنج') || queryLower.includes('لعاب')
  const isBudget = queryLower.includes('budget') || queryLower.includes('cheap') || queryLower.includes('رخيص') || queryLower.includes('اقتصادي')
  const isPremium = queryLower.includes('premium') || queryLower.includes('best') || queryLower.includes('top') || queryLower.includes('ممتاز') || queryLower.includes('أفضل')
  const isWork = queryLower.includes('work') || queryLower.includes('office') || queryLower.includes('business') || queryLower.includes('شغل') || queryLower.includes('عمل')

  for (const product of products) {
    let score = 0
    let reason = ''
    const nameLower = product.name.toLowerCase()
    const categoryLower = product.category.toLowerCase()
    const brandLower = product.brand.toLowerCase()
    const descLower = (product.description || '').toLowerCase()
    const featuresLower = (product.features || []).join(' ').toLowerCase()

    // Budget filtering
    if (budget) {
      const [, maxBudget] = budget
      if (product.price > maxBudget) continue
    }

    // Intent-based scoring
    if (isGaming && (nameLower.includes('gaming') || nameLower.includes('rtx') || nameLower.includes('rx'))) {
      score += 20
      reason = language === 'ar' ? 'مثالي للجيمنج 🎮' : 'Perfect for gaming 🎮'
    }
    if (isBudget && product.price < 5000) {
      score += 15
      reason = language === 'ar' ? 'سعر اقتصادي 💰' : 'Budget-friendly 💰'
    }
    if (isPremium && product.price > 20000) {
      score += 15
      reason = language === 'ar' ? 'ممتاز وأداء عالي ⭐' : 'Premium performance ⭐'
    }
    if (isWork && (nameLower.includes('pro') || nameLower.includes('business'))) {
      score += 15
      reason = language === 'ar' ? 'مثالي للعمل 💼' : 'Perfect for work 💼'
    }

    // Text matching with weighted scoring
    if (nameLower.includes(expandedQuery)) score += 15
    if (categoryLower.includes(expandedQuery)) score += 10
    if (brandLower.includes(expandedQuery)) score += 8
    if (descLower.includes(expandedQuery)) score += 6
    if (featuresLower.includes(expandedQuery)) score += 5

    // Enhanced keyword matching
    const keywords = ['gaming', 'laptop', 'pc', 'monitor', 'keyboard', 'mouse', 'gpu', 'cpu', 'ram', 'ssd', 'headset', 'router', 'printer', 'webcam', 'microphone', 'rtx', 'rx', 'intel', 'amd', 'nvidia']
    for (const keyword of keywords) {
      if (expandedQuery.includes(keyword) && (nameLower.includes(keyword) || categoryLower.includes(keyword))) {
        score += 10
      }
    }

    // Brand preference detection
    const brands = ['nvidia', 'amd', 'intel', 'samsung', 'lg', 'dell', 'hp', 'asus', 'msi', 'razer']
    for (const brand of brands) {
      if (expandedQuery.includes(brand) && brandLower.includes(brand)) {
        score += 12
        reason = language === 'ar' ? `علامة ${brand} موثوقة ✅` : `Trusted ${brand} brand ✅`
      }
    }

    if (score > 0) {
      results.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.png',
        slug: product.slug,
        reason: reason || (language === 'ar' ? 'مناسب لبحثك 👍' : 'Matches your search 👍')
      })
    }
  }

  // Sort by score and return top results
  return results.sort((a, b) => {
    const scoreA = results.find(r => r.id === a.id) ? 1 : 0
    const scoreB = results.find(r => r.id === b.id) ? 1 : 0
    return scoreB - scoreA
  }).slice(0, 5)
}

// Service recommendations
function getServices(query: string, language: 'en' | 'ar'): ServiceSuggestion[] {
  const services = [
    { id: 'web', name: language === 'ar' ? 'تطوير المواقع' : 'Web Development', description: language === 'ar' ? 'مواقع احترافية وسريعة 🌐' : 'Professional fast websites 🌐', icon: 'Globe', href: '/services', reason: language === 'ar' ? 'خدمة مطلوبة جداً 🔥' : 'Very popular service 🔥' },
    { id: 'mobile', name: language === 'ar' ? 'تطبيقات الجوال' : 'Mobile Apps', description: language === 'ar' ? 'تطبيقات iOS و Android 📱' : 'iOS and Android apps 📱', icon: 'Smartphone', href: '/services', reason: language === 'ar' ? 'خدمة مطلوبة جداً 🔥' : 'Very popular service 🔥' },
    { id: 'design', name: language === 'ar' ? 'تصميم UI/UX' : 'UI/UX Design', description: language === 'ar' ? 'تصاميم تجربة مستخدم جامدة 🎨' : 'Stunning user experience designs 🎨', icon: 'Palette', href: '/services', reason: language === 'ar' ? 'خدمة مطلوبة جداً 🔥' : 'Very popular service 🔥' },
    { id: 'branding', name: language === 'ar' ? 'الهوية البصرية' : 'Branding', description: language === 'ar' ? 'تصميم شعار وهوية تجارية 🎯' : 'Logo and brand identity design 🎯', icon: 'Sparkles', href: '/services', reason: language === 'ar' ? 'خدمة مطلوبة جداً 🔥' : 'Very popular service 🔥' },
    { id: 'ai', name: language === 'ar' ? 'حلول الذكاء الاصطناعي' : 'AI Solutions', description: language === 'ar' ? 'أنظمة ذكية مخصصة لبيزنسك 🤖' : 'Custom AI systems for your business 🤖', icon: 'Brain', href: '/services', reason: language === 'ar' ? 'خدمة جديدة ورائعة ✨' : 'New and amazing service ✨' },
    { id: 'ecommerce', name: language === 'ar' ? 'المتاجر الإلكترونية' : 'E-commerce', description: language === 'ar' ? 'متجر إلكتروني متكامل وسهل 🛒' : 'Complete and easy online store 🛒', icon: 'ShoppingCart', href: '/services', reason: language === 'ar' ? 'خدمة مطلوبة جداً 🔥' : 'Very popular service 🔥' },
  ]

  const queryLower = query.toLowerCase()
  return services.filter(s => 
    s.name.toLowerCase().includes(queryLower) || 
    s.description.toLowerCase().includes(queryLower)
  ).slice(0, 3)
}

// Navigation suggestions
function getNavigation(query: string, language: 'en' | 'ar') {
  const navItems = [
    { label: language === 'ar' ? 'المتجر 🛍️' : 'Store 🛍️', href: '/store', keywords: ['store', 'shop', 'buy', 'product', 'laptop', 'المتجر', 'شراء', 'اشتري'] },
    { label: language === 'ar' ? 'الخدمات ⚡' : 'Services ⚡', href: '/services', keywords: ['service', 'work', 'الخدمات', 'خدمة'] },
    { label: language === 'ar' ? 'المشاريع 🎨' : 'Projects 🎨', href: '/projects', keywords: ['project', 'portfolio', 'work', 'المشاريع', 'مشروع'] },
    { label: language === 'ar' ? 'تواصل معنا 📞' : 'Contact 📞', href: '/contact', keywords: ['contact', 'reach', 'email', 'تواصل', 'كلمني'] },
    { label: language === 'ar' ? 'الأسئلة الشائعة ❓' : 'FAQ ❓', href: '/faq', keywords: ['faq', 'question', 'help', 'الأسئلة', 'سؤال'] },
    { label: language === 'ar' ? 'بناء PC 💻' : 'Build PC 💻', href: '/store/pc-builder', keywords: ['build', 'pc', 'custom', 'بناء', 'تجميع'] },
    { label: language === 'ar' ? 'الفئات 📂' : 'Categories 📂', href: '/store/categories', keywords: ['category', 'categories', 'browse', 'الفئات', 'قسم'] },
  ]

  const queryLower = query.toLowerCase()
  return navItems.filter(item => 
    item.keywords.some(k => queryLower.includes(k))
  )
}

// Generate response based on context
export async function generateResponse(
  userMessage: string,
  pageType: PageType,
  language: 'en' | 'ar',
  preferences: UserPreferences
): Promise<{ response: string; products: ProductSuggestion[]; services: ServiceSuggestion[]; navigation: any[]; suggestions: string[] }> {
  const msgLower = userMessage.toLowerCase()
  // Detect language from user input - no default fallback
  const detectedLang = detectLanguage(userMessage)
  const isArabic = detectedLang === 'ar'
  const randomResponse = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

  // Thank you patterns
  const thanks = ['thanks', 'thank you', 'thank', 'شكر', 'مشكور', 'ممنون', 'ألف شكر', 'الله يخليك']
  if (thanks.some(g => msgLower.includes(g))) {
    return {
      response: randomResponse(intelligentResponses.thanks[detectedLang]),
      products: [],
      services: [],
      navigation: [],
      suggestions: isArabic 
        ? ['المنتجات المميزة', 'خدماتنا', 'تواصل معنا']
        : ['Featured Products', 'Our Services', 'Contact Us']
    }
  }

  // Greeting patterns
  const greetings = ['hi', 'hello', 'hey', 'مرحبا', 'السلام', 'اهلا', 'مرحباً', 'اهلاً', 'ازيك', 'ازيك؟', 'عامل ايه', 'عامله ايه', 'صباح الخير', 'مساء الخير', 'صباح الفل', 'يا سلامة', 'هلا']
  if (greetings.some(g => msgLower.includes(g))) {
    return {
      response: randomResponse(intelligentResponses.greeting[detectedLang]),
      products: [],
      services: [],
      navigation: [],
      suggestions: isArabic 
        ? ['المنتجات المميزة 🛍️', 'خدماتنا ⚡', 'بناء PC 💻', 'تواصل معنا 📞']
        : ['Featured Products 🛍️', 'Our Services ⚡', 'Build PC 💻', 'Contact Us 📞']
    }
  }

  // Product search with enhanced context
  const productKeywords = ['laptop', 'pc', 'monitor', 'keyboard', 'mouse', 'gpu', 'cpu', 'gaming', 'notebook', 'جهاز', 'لابتوب', 'شاشة', 'لوحة مفاتيح', 'كرت شاشة', 'بروسسور', 'رام', 'سماعة', 'طابعة', 'روتر', 'كيس', 'مروحة', 'كيبورد', 'ماوس', 'ssd', 'هارد', 'วิดีโอ', 'วิดีโอการ์ด', 'rtx', 'rx', 'intel', 'amd', 'nvidia', 'samsung', 'dell', 'hp', 'asus', 'msi']
  if (productKeywords.some(k => msgLower.includes(k))) {
    const foundProducts = await searchProducts(msgLower, detectedLang, preferences.budget)
    const foundNav = getNavigation(msgLower, detectedLang)

    // Detect specific intents
    const isComparison = msgLower.includes('compare') || msgLower.includes('vs') || msgLower.includes('مقارنة') || msgLower.includes('افضل')
    const isRecommendation = msgLower.includes('recommend') || msgLower.includes('best') || msgLower.includes('suggest') || msgLower.includes('توصية') || msgLower.includes('أفضل')

    if (foundProducts.length > 0) {
      let response = ''
      if (isComparison) {
        response = isArabic
          ? `إليك ${foundProducts.length} منتجات للمقارنة! 😊 كل منتج له مميزاته الخاصة:`
          : `Here are ${foundProducts.length} products for comparison! 😊 Each has its unique advantages:`
      } else if (isRecommendation) {
        response = isArabic
          ? `بناءً على طلبك، هذه أفضل ${foundProducts.length} توصيات! ⭐ تم اختيارها بعناية:`
          : `Based on your request, here are the top ${foundProducts.length} recommendations! ⭐ Carefully selected:`
      } else {
        response = isArabic
          ? `عثرت على ${foundProducts.length} منتجات ممكن تعجبك! 😍 اتفرج عليهم:`
          : `Found ${foundProducts.length} product(s) that might interest you! 😍 Check them out:`
      }

      return {
        response,
        products: foundProducts,
        services: [],
        navigation: foundNav,
        suggestions: isArabic
          ? ['المزيد من المنتجات 📦', 'مقارنة المنتجات ⚖️', 'الأسعار 💰', 'بناء PC 💻']
          : ['More Products 📦', 'Compare Products ⚖️', 'Pricing 💰', 'Build PC 💻']
      }
    } else {
      return {
        response: randomResponse(intelligentResponses.notFound[detectedLang]),
        products: [],
        services: [],
        navigation: foundNav,
        suggestions: isArabic
          ? ['تصفح المنتجات 🛍️', 'بناء PC 💻', 'تواصل معنا 📞', 'استشارة مجانية 🎯']
          : ['Browse Products 🛍️', 'Build PC 💻', 'Contact Us 📞', 'Free Consultation 🎯']
      }
    }
  }

  // Service keywords
  const serviceKeywords = ['service', 'web', 'design', 'brand', 'mobile', 'app', 'ai', 'ecommerce', 'خدمة', 'تصميم', 'تطوير', 'موقع', 'مواقع', 'تطبيق', 'تجارة']
  if (serviceKeywords.some(k => msgLower.includes(k))) {
    const foundServices = getServices(msgLower, detectedLang)
    return {
      response: isArabic
        ? 'ده كلام! 😎 دي خدماتنا الحلوة. قولي عايز تعرف عن إيه بالظبط:'
        : 'Absolutely! 😎 Here are our awesome services. Tell me which one you\'d like to know more about:',
      products: [],
      services: foundServices.length > 0 ? foundServices : getServices('web', detectedLang),
      navigation: [],
      suggestions: isArabic
        ? ['عرض كل الخدمات 📋', 'استشارة مجانية 🎯', 'تواصل معنا 📞']
        : ['View All Services 📋', 'Free Consultation 🎯', 'Contact Us 📞']
    }
  }

  // Navigation requests
  const navResults = getNavigation(msgLower, detectedLang)
  if (navResults.length > 0) {
    return {
      response: isArabic
        ? `يلا نروح ${navResults[0].label}! 🚀`
        : `Let's go to ${navResults[0].label}! 🚀`,
      products: [],
      services: [],
      navigation: navResults,
      suggestions: isArabic
        ? ['الرئيسية 🏠', 'المتجر 🛍️', 'الخدمات ⚡']
        : ['Home 🏠', 'Store 🛍️', 'Services ⚡']
    }
  }

  // Price/budget queries
  if (msgLower.includes('price') || msgLower.includes('budget') || msgLower.includes('cost') || msgLower.includes('سعر') || msgLower.includes('ميزانية') || msgLower.includes('كام') || msgLower.includes('ب') || msgLower.includes('غالي') || msgLower.includes('رخيص')) {
    const maxPrice = preferences.budget ? preferences.budget[1] : 50000
    const allProducts = await getProducts()
    const affordableProducts = allProducts.filter(p => p.price < maxPrice).slice(0, 5)
    return {
      response: isArabic
        ? 'ده كلام! 😊 دي منتجاتنا بأسعار حلوة أوي. اتفرج واختار اللي يناسبك:'
        : 'Great question! 💰 Here are our products at awesome prices. Take a look:',
      products: affordableProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0] || '/placeholder.png',
        slug: p.slug,
        reason: isArabic ? 'سعر تحفة 💸' : 'Amazing price 💸'
      })),
      services: [],
      navigation: [],
      suggestions: isArabic
        ? ['عروض الخصم 🔥', 'منتجات مميزة ⭐', 'بناء PC 💻']
        : ['Deals 🔥', 'Featured Products ⭐', 'Build PC 💻']
    }
  }

  // WhatsApp/contact
  if (msgLower.includes('whatsapp') || msgLower.includes('contact') || msgLower.includes('reach') || msgLower.includes('تواصل') || msgLower.includes('واتساب') || msgLower.includes('كلمني') || msgLower.includes('اتصل')) {
    return {
      response: isArabic
        ? 'طبعاً يا حبيبي! 😊 تقدر تكلمنا على WhatsApp أو تزور صفحة الاتصال. إحنا دايماً موجودين!'
        : 'Of course! 😊 You can reach us via WhatsApp or visit our contact page. We\'re always here for you!',
      products: [],
      services: [],
      navigation: [{ label: isArabic ? 'تواصل معنا 📞' : 'Contact Us 📞', href: '/contact' }],
      suggestions: isArabic
        ? ['فتح WhatsApp 📱', 'صفحة الاتصال 📍', 'حجز استشارة 🗓️']
        : ['Open WhatsApp 📱', 'Contact Page 📍', 'Book Consultation 🗓️']
    }
  }

  // About INFOGRA
  if (msgLower.includes('about') || msgLower.includes('who') || msgLower.includes('company') || msgLower.includes('من انتم') || msgLower.includes('عن الشركة') || msgLower.includes('ايه هي') || msgLower.includes('ايه ده')) {
    return {
      response: isArabic
        ? 'INFOGRA دي وكالة رقمية رائدة! 🚀 احنا متخصصين في تصميم وتطوير المواقع والتطبيقات. بنحول أفكارك لتجارب رقمية تجنن! 💫'
        : 'INFOGRA is a leading digital agency! 🚀 We specialize in web design and development. We turn your ideas into amazing digital experiences! 💫',
      products: [],
      services: [],
      navigation: [{ label: isArabic ? 'تعرف علينا أكثر ℹ️' : 'Learn More ℹ️', href: '/about' }],
      suggestions: isArabic
        ? ['خدماتنا ⚡', 'مشاريعنا 🎨', 'تواصل معنا 📞']
        : ['Our Services ⚡', 'Our Projects 🎨', 'Contact Us 📞']
    }
  }

  // Build PC
  if (msgLower.includes('build') || msgLower.includes('custom') || msgLower.includes('pc builder') || msgLower.includes('بناء') || msgLower.includes('تجميع') || msgLower.includes('تجميعة')) {
    return {
      response: isArabic
        ? 'تمام يا معلم! 💪 تقدر تبني PC مخصص معانا. هنساعدك تختار القطع اللي تناسب ميزانيتك واحتياجاتك!'
        : 'Awesome! 💪 You can build a custom PC with us. We\'ll help you choose the perfect components for your budget and needs!',
      products: [],
      services: [],
      navigation: [{ label: isArabic ? 'ابدأ التجميع 💻' : 'Start Building 💻', href: '/store/pc-builder' }],
      suggestions: isArabic
        ? ['قطع PC gaming 🎮', 'قطع PC مكتبية 💼', 'عروض التجميعات 🎁']
        : ['Gaming PC Parts 🎮', 'Office PC Parts 💼', 'Build Deals 🎁']
    }
  }

  // Help/request patterns
  const helpPatterns = ['help', 'عايز', 'عايزة', 'محتاج', 'محتاجة', 'ممكن', 'اريد', 'عاوز', 'عاوزة', 'قولي', 'دلني', 'ساعدني']
  if (helpPatterns.some(p => msgLower.includes(p))) {
    return {
      response: randomResponse(intelligentResponses.help[detectedLang]),
      products: [],
      services: [],
      navigation: [],
      suggestions: isArabic
        ? ['المنتجات 🛍️', 'الخدمات ⚡', 'بناء PC 💻']
        : ['Products 🛍️', 'Services ⚡', 'Build PC 💻']
    }
  }

  // Default response with enhanced capabilities
  return {
    response: isArabic
      ? `أهلاً بيك! 😊 أنا مساعد INFOGRA الذكي المتقدم. تقدر تسألني عن:

🛍️ **منتجاتنا** - لابتوبات، شاشات، قطع PC، وكل المعدات مع مقارنات تفصيلية
⚡ **خدماتنا** - تطوير، تصميم، وعلامة تجارية مع استشارات متخصصة
💻 **بناء PC** - تجميع جهاز مخصص مع توصيات المكونات
� **دعم تقني** - حل مشاكل، نصائح تحسين، واستشارات خبراء
📊 **مقارنات** - مقارنة بين المنتجات والمواصفات
💰 **ميزانية** - أفضل الخيارات حسب ميزانيتك
�📞 **تواصل معنا** - WhatsApp أو صفحة الاتصال

قولي بتدور على إيه وأنا هلاقيهولك بأفضل المعلومات! 💪`
      : `Hey there! 😊 I'm your advanced INFOGRA AI assistant. You can ask me about:

🛍️ **Our Products** - Laptops, monitors, PC parts, and all equipment with detailed comparisons
⚡ **Our Services** - Development, design, and branding with specialized consultations
💻 **Build PC** - Custom PC assembly with component recommendations
🔧 **Technical Support** - Troubleshooting, optimization tips, and expert advice
📊 **Comparisons** - Product and specification comparisons
💰 **Budget** - Best options based on your budget
📞 **Contact Us** - WhatsApp or contact page

Just tell me what you're looking for and I'll find it with the best information! 💪`,
    products: [],
    services: [],
    navigation: [],
    suggestions: isArabic
      ? ['تصفح المنتجات 🛍️', 'خدماتنا ⚡', 'بناء PC 💻', 'تواصل معنا 📞', 'استشارة مجانية 🎯']
      : ['Browse Products 🛍️', 'Our Services ⚡', 'Build PC 💻', 'Contact Us 📞', 'Free Consultation 🎯']
  }
}
