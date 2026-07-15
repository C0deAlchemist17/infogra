import { Message, PageType, UserPreferences, ProductSuggestion, ServiceSuggestion } from '@/types/ai-assistant'
import { products, categories, brands } from '@/data/products'

// Simple language detection
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

// Egyptian Arabic (Masri) friendly response templates
const masriResponses = {
  greeting: [
    'أهلاً وسهلاً بيكي/بيك! 😊 أنا مساعد INFOGRA وجاي أساعدك في أي حاجة تحتاجها!',
    'يا مرحب يا مرحب! 👋 أنا هنا عشان أساعدك تلاقي اللي بتدور عليه!',
    'هلا والله! 🎉 أنا مساعد INFOGRA الذكي وجاهز أساعدك!',
  ],
  thanks: [
    'العفو يا غالي/يا غالية! 💙 أنا دايماً موجود لو محتاج أي حاجة تانية!',
    'أي وقت يا حبيبي/يا حبيبتي! 😊 لو عندك أي سؤال تاني، أنا هنا!',
    'الله يخليك! 🌟 متحرجش تسأل في أي وقت!',
  ],
  help: [
    'طبعاً هساعدك! 🤗 قولي بتدور على إيه وأنا هلاقيهولك!',
    'يلا نشوف اللي محتاجه! 💪 أنا هنا عشان أساعدك تختار الأفضل!',
  ],
  notFound: [
    'مش لاقي حاجة مظبوطة لبحثك ده 😅 بس ممكن تجرب كلمات تانية أو تتفرج على المنتجات عندنا!',
    'معلش، مش لاقي النتيجة المظبوطة 🤔 بس عندنا منتجات تانية حلوة ممكن تعجبك!',
  ],
}

// Arabic to English mapping for common tech terms
const arabicToEnglish: Record<string, string[]> = {
  'لابتوب': ['laptop', 'notebook'],
  'جهاز': ['pc', 'computer'],
  'شاشة': ['monitor', 'display'],
  'لوحة مفاتيح': ['keyboard'],
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
}

// Product search with budget filtering
function searchProducts(query: string, language: 'en' | 'ar', budget?: [number, number]): ProductSuggestion[] {
  const queryLower = query.toLowerCase()
  const results: ProductSuggestion[] = []

  // Expand query with Arabic mappings
  let expandedQuery = queryLower
  for (const [arabic, englishTerms] of Object.entries(arabicToEnglish)) {
    if (queryLower.includes(arabic)) {
      expandedQuery += ' ' + englishTerms.join(' ')
    }
  }

  for (const product of products) {
    let score = 0
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

    if (nameLower.includes(expandedQuery)) score += 15
    if (categoryLower.includes(expandedQuery)) score += 8
    if (brandLower.includes(expandedQuery)) score += 5
    if (descLower.includes(expandedQuery)) score += 4
    if (featuresLower.includes(expandedQuery)) score += 3
    
    // Check for keywords
    const keywords = ['gaming', 'laptop', 'pc', 'monitor', 'keyboard', 'mouse', 'gpu', 'cpu', 'ram', 'ssd', 'headset', 'router', 'printer', 'webcam', 'microphone']
    for (const keyword of keywords) {
      if (expandedQuery.includes(keyword) && (nameLower.includes(keyword) || categoryLower.includes(keyword))) {
        score += 7
      }
    }

    if (score > 0) {
      results.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
        reason: language === 'ar' ? 'مناسب لبحثك 👍' : 'Matches your search 👍'
      })
    }
  }

  return results.slice(0, 5)
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
export function generateResponse(
  userMessage: string,
  pageType: PageType,
  language: 'en' | 'ar',
  preferences: UserPreferences
): { response: string; products: ProductSuggestion[]; services: ServiceSuggestion[]; navigation: any[]; suggestions: string[] } {
  const msgLower = userMessage.toLowerCase()
  const detectedLang = detectLanguage(userMessage) || language
  const isArabic = detectedLang === 'ar'
  const randomMasri = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

  // Thank you patterns
  const thanks = ['thanks', 'thank you', 'thank', 'شكر', 'مشكور', 'ممنون', 'ألف شكر', 'الله يخليك']
  if (thanks.some(g => msgLower.includes(g))) {
    return {
      response: randomMasri(masriResponses.thanks),
      products: [],
      services: [],
      navigation: [],
      suggestions: isArabic 
        ? ['المنتجات المميزة', 'خدماتنا', 'تواصل معنا']
        : ['Featured Products', 'Our Services', 'Contact Us']
    }
  }

  // Greeting patterns (Egyptian Arabic)
  const greetings = ['hi', 'hello', 'hey', 'مرحبا', 'السلام', 'اهلا', 'مرحباً', 'اهلاً', 'ازيك', 'ازيك؟', 'عامل ايه', 'عامله ايه', 'صباح الخير', 'مساء الخير', 'صباح الفل', 'يا سلامة', 'هلا']
  if (greetings.some(g => msgLower.includes(g))) {
    return {
      response: randomMasri(masriResponses.greeting),
      products: [],
      services: [],
      navigation: [],
      suggestions: isArabic 
        ? ['المنتجات المميزة 🛍️', 'خدماتنا ⚡', 'بناء PC 💻', 'تواصل معنا 📞']
        : ['Featured Products 🛍️', 'Our Services ⚡', 'Build PC 💻', 'Contact Us 📞']
    }
  }

  // Product search
  const productKeywords = ['laptop', 'pc', 'monitor', 'keyboard', 'mouse', 'gpu', 'cpu', 'gaming', 'notebook', 'جهاز', 'لابتوب', 'شاشة', 'لوحة مفاتيح', 'كرت شاشة', 'بروسسور', 'رام', 'سماعة', 'طابعة', 'روتر', 'كيس', 'مروحة', 'كيبورد', 'ماوس', 'ssd', 'هارد', 'วิดีโอ', 'วิดีโอการ์ด']
  if (productKeywords.some(k => msgLower.includes(k))) {
    const foundProducts = searchProducts(msgLower, detectedLang, preferences.budget)
    const foundNav = getNavigation(msgLower, detectedLang)
    if (foundProducts.length > 0) {
      return {
        response: isArabic
          ? `عثرت على ${foundProducts.length} منتجات ممكن تعجبك! 😍 اتفرج عليهم:`
          : `Found ${foundProducts.length} product(s) that might interest you! 😍 Check them out:`,
        products: foundProducts,
        services: [],
        navigation: foundNav,
        suggestions: isArabic
          ? ['المزيد من المنتجات 📦', 'مقارنة المنتجات ⚖️', 'الأسعار 💰']
          : ['More Products 📦', 'Compare Products ⚖️', 'Pricing 💰']
      }
    } else {
      return {
        response: randomMasri(masriResponses.notFound),
        products: [],
        services: [],
        navigation: foundNav,
        suggestions: isArabic
          ? ['تصفح المنتجات 🛍️', 'بناء PC 💻', 'تواصل معنا 📞']
          : ['Browse Products 🛍️', 'Build PC 💻', 'Contact Us 📞']
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
    const affordableProducts = products.filter(p => p.price < maxPrice).slice(0, 5)
    return {
      response: isArabic
        ? 'ده كلام! 😊 دي منتجاتنا بأسعار حلوة أوي. اتفرج واختار اللي يناسبك:'
        : 'Great question! 💰 Here are our products at awesome prices. Take a look:',
      products: affordableProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0],
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
      response: randomMasri(masriResponses.help),
      products: [],
      services: [],
      navigation: [],
      suggestions: isArabic
        ? ['المنتجات 🛍️', 'الخدمات ⚡', 'بناء PC 💻']
        : ['Products 🛍️', 'Services ⚡', 'Build PC 💻']
    }
  }

  // Default response
  return {
    response: isArabic
      ? `أهلاً بيك! 😊 أنا هنا عشان أساعدك. تقدر تسألني عن:

🛍️ **منتجاتنا** - لابتوبات، شاشات، قطع PC، وكل المعدات
⚡ **خدماتنا** - تطوير، تصميم، وعلامة تجارية
💻 **بناء PC** - تجميع جهاز مخصص
📞 **تواصل معنا** - WhatsApp أو صفحة الاتصال

قولي بتدور على إيه وأنا هلاقيهولك! 💪`
      : `Hey there! 😊 I'm here to help you out. You can ask me about:

🛍️ **Our Products** - Laptops, monitors, PC parts, and all equipment
⚡ **Our Services** - Development, design, and branding
💻 **Build PC** - Custom PC assembly
📞 **Contact Us** - WhatsApp or contact page

Just tell me what you're looking for and I'll find it for you! 💪`,
    products: [],
    services: [],
    navigation: [],
    suggestions: isArabic
      ? ['تصفح المنتجات 🛍️', 'خدماتنا ⚡', 'بناء PC 💻', 'تواصل معنا 📞']
      : ['Browse Products 🛍️', 'Our Services ⚡', 'Build PC 💻', 'Contact Us 📞']
  }
}
