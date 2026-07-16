import { Locale } from '@/providers/LanguageProvider'

export type TranslationKey = 
  | 'site.name'
  | 'site.tagline'
  | 'nav.home'
  | 'nav.store'
  | 'nav.services'
  | 'nav.work'
  | 'nav.about'
  | 'nav.blog'
  | 'nav.contact'
  | 'nav.search'
  | 'nav.menu'
  | 'services.web'
  | 'services.mobile'
  | 'services.uiux'
  | 'services.branding'
  | 'services.ai'
  | 'services.cloud'
  | 'cta.getStarted'
  | 'cta.startProject'
  | 'cta.viewWork'
  | 'cta.viewAll'
  | 'cta.browseStore'
  | 'cta.buildPC'
  | 'cta.learnMore'
  | 'cta.readCaseStudy'
  | 'cta.contactUs'
  | 'cta.bookConsultation'
  | 'footer.company'
  | 'footer.services'
  | 'footer.resources'
  | 'footer.legal'
  | 'footer.about'
  | 'footer.team'
  | 'footer.caseStudies'
  | 'footer.portfolio'
  | 'footer.webDev'
  | 'footer.marketing'
  | 'footer.consulting'
  | 'footer.faq'
  | 'footer.industries'
  | 'footer.privacy'
  | 'footer.terms'
  | 'footer.rights'
  | 'hero.badge'
  | 'hero.title.line1'
  | 'hero.title.line2'
  | 'hero.subtitle'
  | 'hero.scroll'
  | 'hero.stats.projects'
  | 'hero.stats.clients'
  | 'hero.stats.experience'
  | 'hero.stats.awards'
  | 'stats.title'
  | 'stats.subtitle'
  | 'stats.satisfaction'
  | 'stats.delivered'
  | 'stats.partnerships'
  | 'stats.recognition'
  | 'services.title'
  | 'services.subtitle'
  | 'services.explore'
  | 'services.webDev'
  | 'services.mobileApps'
  | 'services.design'
  | 'services.marketing'
  | 'services.aiSolutions'
  | 'services.cloudServices'
  | 'services.customSoftware'
  | 'services.analytics'
  | 'work.title'
  | 'work.subtitle'
  | 'work.filterAll'
  | 'work.filterWeb'
  | 'work.filterDesign'
  | 'work.viewProject'
  | 'about.title'
  | 'about.subtitle'
  | 'tech.title'
  | 'tech.badge'
  | 'tech.subtitle'
  | 'caseStudies.title'
  | 'caseStudies.subtitle'
  | 'caseStudies.challenge'
  | 'caseStudies.solution'
  | 'caseStudies.results'
  | 'testimonials.title'
  | 'testimonials.subtitle'
  | 'process.title'
  | 'process.subtitle'
  | 'process.step1'
  | 'process.step2'
  | 'process.step3'
  | 'process.step4'
  | 'process.desc1'
  | 'process.desc2'
  | 'process.desc3'
  | 'process.desc4'
  | 'why.title'
  | 'why.subtitle'
  | 'why.fast'
  | 'why.global'
  | 'why.security'
  | 'why.ontime'
  | 'why.client'
  | 'why.results'
  | 'trusted.title'
  | 'trusted.subtitle'
  | 'faq.title'
  | 'faq.subtitle'
  | 'contact.title'
  | 'contact.subtitle'
  | 'contact.send'
  | 'contact.whatsapp'
  | 'contact.location'
  | 'store.title'
  | 'store.subtitle'
  | 'store.featured'
  | 'store.browse'
  | 'store.buildPC'
  | 'store.buildPCDesc'
  | 'store.startBuilding'
  | 'store.warranty'
  | 'store.delivery'
  | 'store.prices'
  | 'store.authentic'

type TranslationMap = Record<TranslationKey, string>

export const translations: Record<Locale, TranslationMap> = {
  en: {
    'site.name': 'INFOGRA',
    'site.tagline': 'Digital Experience Architects',
    'nav.home': 'Home',
    'nav.store': 'Store',
    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.search': 'Search',
    'nav.menu': 'Menu',
    'services.web': 'Web Development',
    'services.mobile': 'Mobile Apps',
    'services.uiux': 'UI/UX Design',
    'services.branding': 'Branding',
    'services.ai': 'AI Solutions',
    'services.cloud': 'Cloud Services',
    'cta.getStarted': 'Get Started',
    'cta.startProject': 'Start Your Project',
    'cta.viewWork': 'View Our Work',
    'cta.viewAll': 'View All Projects',
    'cta.browseStore': 'Browse Store',
    'cta.buildPC': 'Build Your Dream PC',
    'cta.learnMore': 'Learn More',
    'cta.readCaseStudy': 'Read Full Case Study',
    'cta.contactUs': 'Contact Us',
    'cta.bookConsultation': 'Book Consultation',
    'footer.company': 'Company',
    'footer.services': 'Services',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',
    'footer.about': 'About Us',
    'footer.team': 'Our Team',
    'footer.caseStudies': 'Case Studies',
    'footer.portfolio': 'Portfolio',
    'footer.webDev': 'Web Development',
    'footer.marketing': 'Digital Marketing',
    'footer.consulting': 'Consulting',
    'footer.faq': 'FAQ',
    'footer.industries': 'Industries',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',
    'hero.badge': 'Premium Digital Agency',
    'hero.title.line1': 'We Architect',
    'hero.title.line2': 'Digital Excellence',
    'hero.subtitle': 'Transform your vision into reality with our premium web development, design, and digital marketing services. We build experiences that captivate and convert.',
    'hero.scroll': 'Scroll to explore',
    'hero.stats.projects': 'Projects Delivered',
    'hero.stats.clients': 'Happy Clients',
    'hero.stats.experience': 'Years Experience',
    'hero.stats.awards': 'Awards Won',
    'stats.title': 'Our Impact in Numbers',
    'stats.subtitle': 'We measure our success by the results we deliver for our clients',
    'stats.delivered': 'Projects Delivered',
    'stats.partnerships': 'Global partnerships',
    'stats.recognition': 'Industry recognition',
    'stats.satisfaction': 'Client Satisfaction',
    'services.title': 'Premium Digital Services',
    'services.subtitle': 'Comprehensive solutions tailored to elevate your digital presence and drive business growth',
    'services.explore': 'Explore',
    'services.webDev': 'Custom web applications built with modern technologies',
    'services.mobileApps': 'Native and cross-platform mobile solutions',
    'services.design': 'User-centered design that converts',
    'services.marketing': 'Data-driven marketing strategies',
    'services.aiSolutions': 'Intelligent automation and machine learning',
    'services.cloudServices': 'Scalable cloud infrastructure and deployment',
    'services.customSoftware': 'Tailored software solutions for your business',
    'services.analytics': 'Data insights and business intelligence',
    'work.title': 'Featured Projects',
    'work.subtitle': 'Explore our portfolio of award-winning digital experiences',
    'work.filterAll': 'All Projects',
    'work.filterWeb': 'Web Development',
    'work.filterDesign': 'Graphic Design',
    'work.viewProject': 'View Project',
    'about.title': 'About INFOGRA',
    'about.subtitle': 'We architect digital experiences that drive business growth',
    'tech.title': 'Technologies We Master',
    'tech.badge': 'Our Stack',
    'tech.subtitle': 'Cutting-edge tools and frameworks powering the next generation of digital experiences',
    'caseStudies.title': 'Featured Case Studies',
    'caseStudies.subtitle': 'Deep dive into how we helped businesses achieve their digital transformation goals',
    'caseStudies.challenge': 'The Challenge',
    'caseStudies.solution': 'Our Solution',
    'caseStudies.results': 'Results',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': "Don't just take our word for it — hear from the businesses we've helped transform",
    'process.title': 'Our Process',
    'process.subtitle': 'A proven methodology that transforms ideas into exceptional digital experiences',
    'process.step1': 'Discovery & Research',
    'process.step2': 'Design & Prototype',
    'process.step3': 'Develop & Build',
    'process.step4': 'Launch & Grow',
    'process.desc1': 'We dive deep into your business, audience, and goals to build a strategic foundation for success.',
    'process.desc2': 'Our designers craft stunning interfaces with pixel-perfect attention to detail and user experience.',
    'process.desc3': 'Our engineers bring designs to life with clean, performant, and scalable code.',
    'process.desc4': 'We deploy, monitor, and continuously optimize to ensure your digital success.',
    'why.title': 'Why INFOGRA',
    'why.subtitle': "We don't just build websites — we architect digital experiences that drive real business results",
    'why.fast': 'Lightning Fast',
    'why.global': 'Global Reach',
    'why.security': 'Enterprise Security',
    'why.ontime': 'On-Time Delivery',
    'why.client': 'Client-First',
    'why.results': 'Proven Results',
    'trusted.title': 'Trusted by Industry Leaders',
    'trusted.subtitle': "We've had the privilege of working with innovative companies across various industries",
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Everything you need to know about our services and process',
    'contact.title': "Let's Work Together",
    'contact.subtitle': 'Ready to start your project? Get in touch with us today.',
    'contact.send': 'Send Message',
    'contact.whatsapp': 'WhatsApp',
    'contact.location': 'Office Location',
    'store.title': 'Premium Technology at Your Fingertips',
    'store.subtitle': 'Discover gaming laptops, desktop PCs, components, and accessories from the world\'s leading brands.',
    'store.featured': 'Featured Products',
    'store.browse': 'Browse Store',
    'store.buildPC': 'Build Your Dream PC',
    'store.buildPCDesc': 'Custom configurations for gaming, work, and creativity',
    'store.startBuilding': 'Start Building',
    'store.warranty': 'Warranty',
    'store.delivery': 'Fast Delivery',
    'store.prices': 'Best Prices',
    'store.authentic': 'Authentic Products',
  },
  ar: {
    'site.name': 'إنفوجرا',
    'site.tagline': 'مهندسي التجارب الرقمية',
    'nav.home': 'الرئيسية',
    'nav.store': 'المتجر',
    'nav.services': 'الخدمات',
    'nav.work': 'أعمالنا',
    'nav.about': 'عن الشركة',
    'nav.blog': 'المدونة',
    'nav.contact': 'تواصل معنا',
    'nav.search': 'بحث',
    'nav.menu': 'القائمة',
    'services.web': 'تطوير المواقع',
    'services.mobile': 'تطبيقات الجوال',
    'services.uiux': 'تصميم UI/UX',
    'services.branding': 'الهوية البصرية',
    'services.ai': 'حلول الذكاء الاصطناعي',
    'services.cloud': 'الخدمات السحابية',
    'cta.getStarted': 'ابدأ مشروعك',
    'cta.startProject': 'ابدأ مشروعك',
    'cta.viewWork': 'شاهد أعمالنا',
    'cta.viewAll': 'عرض كل المشاريع',
    'cta.browseStore': 'تصفح المتجر',
    'cta.buildPC': 'ابنِ جهازك المثالي',
    'cta.learnMore': 'اعرف المزيد',
    'cta.readCaseStudy': 'اقرأ دراسة الحالة',
    'cta.contactUs': 'تواصل معنا',
    'cta.bookConsultation': 'احجز استشارة',
    'footer.company': 'الشركة',
    'footer.services': 'الخدمات',
    'footer.resources': 'المصادر',
    'footer.legal': 'القانونية',
    'footer.about': 'من نحن',
    'footer.team': 'فريقنا',
    'footer.caseStudies': 'دراسات الحالة',
    'footer.portfolio': 'معرض الأعمال',
    'footer.webDev': 'تطوير المواقع',
    'footer.marketing': 'التسويق الرقمي',
    'footer.consulting': 'الاستشارات',
    'footer.faq': 'الأسئلة الشائعة',
    'footer.industries': 'المجالات',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'hero.badge': 'وكالة رقمية متميزة',
    'hero.title.line1': 'نحن نصمم',
    'hero.title.line2': 'التميز الرقمي',
    'hero.subtitle': 'حول رؤيتك إلى واقع مع خدماتنا المتميزة في تطوير المواقع والتصميم والتسويق الرقمي. نبني تجارب تأسر وتحول.',
    'hero.scroll': 'اسفل للمزيد',
    'hero.stats.projects': 'مشروع تم تسليمه',
    'hero.stats.clients': 'عميل سعيد',
    'hero.stats.experience': 'سنوات خبرة',
    'hero.stats.awards': 'جائزة حصلنا عليها',
    'stats.title': 'أثرنا بالأرقام',
    'stats.subtitle': 'نقيس نجاحنا بالنتائج التي نحققها لعملائنا',
    'stats.delivered': 'مشروع تم تسليمه',
    'stats.partnerships': 'شراكات عالمية',
    'stats.recognition': 'جوائز صناعية',
    'stats.satisfaction': 'رضا العملاء',
    'services.title': 'خدمات رقمية متميزة',
    'services.subtitle': 'حلول شاملة مصممة لتعزيز حضورك الرقمي ودفع نمو أعمالك',
    'services.explore': 'استكشف',
    'services.webDev': 'تطبيقات ويب مخصصة بتقنيات حديثة',
    'services.mobileApps': 'حلول تطبيقات جوال أصلية ومتعددة المنصات',
    'services.design': 'تصميم يركز على المستخدم لتحقيق التحويلات',
    'services.marketing': 'استراتيجيات تسويق مبنية على البيانات',
    'services.aiSolutions': 'أتمتة ذكية وتعلم آلي',
    'services.cloudServices': 'بنية تحتية سحابية قابلة للتوسع',
    'services.customSoftware': 'حلول برمجية مخصصة لأعمالك',
    'services.analytics': 'تحليلات بيانات وذكاء أعمال',
    'work.title': 'مشاريعنا المميزة',
    'work.subtitle': 'استكشف محفظتنا من التجارب الرقمية الحائزة على جوائز',
    'work.filterAll': 'كل المشاريع',
    'work.filterWeb': 'تطوير المواقع',
    'work.filterDesign': 'التصميم الجرافيكي',
    'work.viewProject': 'عرض المشروع',
    'about.title': 'عن إنفوجرا',
    'about.subtitle': 'نصمم تجارب رقمية تدفع عجلة نمو الأعمال',
    'tech.title': 'التقنيات التي نتقنها',
    'tech.badge': 'تقنياتنا',
    'tech.subtitle': 'أدوات وأطر عمل متطورة تقود الجيل القادم من التجارب الرقمية',
    'caseStudies.title': 'دراسات الحالة المميزة',
    'caseStudies.subtitle': 'تعمق في كيفية مساعدتنا للشركات لتحقيق أهداف التحول الرقمي',
    'caseStudies.challenge': 'التحدي',
    'caseStudies.solution': 'الحل',
    'caseStudies.results': 'النتائج',
    'testimonials.title': 'ماذا يقول عملاؤنا',
    'testimonials.subtitle': 'لا تأخذ كلامنا فقط — اسمع من الشركات التي ساعدناها في التحول',
    'process.title': 'عملية عملنا',
    'process.subtitle': 'منهجية مثبتة تحول الأفكار إلى تجارب رقمية استثنائية',
    'process.step1': 'الاكتشاف والبحث',
    'process.step2': 'التصميم والنمذجة',
    'process.step3': 'التطوير والبناء',
    'process.step4': 'الإطلاق والنمو',
    'process.desc1': 'نغوص في أعمالك وجمهورك وأهدافك لبناء أساس استراتيجي للنجاح.',
    'process.desc2': 'يصمم مصممونا واجهات مذهلة مع الاهتمام بأدق التفاصيل وتجربة المستخدم.',
    'process.desc3': 'يحول مهندسونا التصاميم إلى واقع بكود نظيف وعالي الأداء وقابل للتوسع.',
    'process.desc4': 'ننشر ونراقب ونحسن باستمرار لضمان نجاحك الرقمي.',
    'why.title': 'لماذا إنفوجرا',
    'why.subtitle': 'لا نبني مواقع فقط — بل نصمم تجارب رقمية تحقق نتائج أعمال حقيقية',
    'why.fast': 'سرعة فائقة',
    'why.global': 'وصول عالمي',
    'why.security': 'أمان مؤسسي',
    'why.ontime': 'تسليم في الوقت المحدد',
    'why.client': 'العميل أولاً',
    'why.results': 'نتائج مثبتة',
    'trusted.title': 'موثوق من قبل قادة الصناعة',
    'trusted.subtitle': 'تشرفنا بالعمل مع شركات مبتكرة في مختلف المجالات',
    'faq.title': 'الأسئلة الشائعة',
    'faq.subtitle': 'كل ما تحتاج معرفته عن خدماتنا وعملية العمل',
    'contact.title': 'دعنا نعمل معاً',
    'contact.subtitle': 'مستعد لبدء مشروعك؟ تواصل معنا اليوم.',
    'contact.send': 'أرسل رسالة',
    'contact.whatsapp': 'واتساب',
    'contact.location': 'موقع المكتب',
    'store.title': 'تقنية متميزة بين يديك',
    'store.subtitle': 'اكتشف لابتوبات الألعاب، أجهزة الكمبيوتر المكتبية، المكونات والإكسسوارات من أشهر الماركات العالمية.',
    'store.featured': 'منتجات مميزة',
    'store.browse': 'تصفح المتجر',
    'store.buildPC': 'ابنِ جهاز أحلامك',
    'store.buildPCDesc': 'تكوينات مخصصة للألعاب والعمل والإبداع',
    'store.startBuilding': 'ابدأ التجميع',
    'store.warranty': 'الضمان',
    'store.delivery': 'توصيل سريع',
    'store.prices': 'أفضل الأسعار',
    'store.authentic': 'منتجات أصلية',
  },
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || key
}

export function useTranslation(locale: Locale) {
  return {
    t: (key: TranslationKey) => t(locale, key),
    locale,
  }
}
