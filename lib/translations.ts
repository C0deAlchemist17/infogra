import { Locale } from '@/providers/LanguageProvider'

export type TranslationKey =
  // Site
  | 'site.name' | 'site.tagline'
  // Nav
  | 'nav.home' | 'nav.store' | 'nav.services' | 'nav.work' | 'nav.about' | 'nav.blog' | 'nav.contact' | 'nav.search' | 'nav.menu'
  // Services dropdown
  | 'services.web' | 'services.mobile' | 'services.uiux' | 'services.branding' | 'services.ai' | 'services.cloud'
  // CTA buttons
  | 'cta.getStarted' | 'cta.startProject' | 'cta.viewWork' | 'cta.viewAll' | 'cta.browseStore' | 'cta.buildPC'
  | 'cta.learnMore' | 'cta.readCaseStudy' | 'cta.contactUs' | 'cta.bookConsultation' | 'cta.callUs' | 'cta.startChat'
  | 'cta.startBuilding'
  // Footer
  | 'footer.company' | 'footer.services' | 'footer.resources' | 'footer.legal'
  | 'footer.about' | 'footer.team' | 'footer.caseStudies' | 'footer.portfolio'
  | 'footer.webDev' | 'footer.marketing' | 'footer.consulting' | 'footer.faq'
  | 'footer.industries' | 'footer.privacy' | 'footer.terms' | 'footer.rights'
  | 'footer.description' | 'footer.stayUpdated' | 'footer.subscribeDesc' | 'footer.subscribe' | 'footer.emailPlaceholder'
  | 'footer.madeWith' | 'footer.inEgypt'
  // Hero
  | 'hero.badge' | 'hero.title.line1' | 'hero.title.line2' | 'hero.subtitle' | 'hero.scroll'
  | 'hero.stats.projects' | 'hero.stats.clients' | 'hero.stats.experience' | 'hero.stats.awards'
  // Stats section
  | 'stats.badge' | 'stats.title' | 'stats.subtitle'
  | 'stats.delivered' | 'stats.partnerships' | 'stats.recognition' | 'stats.satisfaction'
  // Services section
  | 'services.badge' | 'services.title' | 'services.subtitle' | 'services.explore'
  | 'services.webDev' | 'services.mobileApps' | 'services.design' | 'services.marketing'
  | 'services.aiSolutions' | 'services.cloudServices' | 'services.customSoftware' | 'services.analytics'
  // Work section
  | 'work.badge' | 'work.title' | 'work.subtitle' | 'work.filterAll' | 'work.filterWeb' | 'work.filterDesign' | 'work.viewProject'
  // Technologies section
  | 'tech.badge' | 'tech.title' | 'tech.subtitle'
  | 'tech.frontend' | 'tech.backend' | 'tech.mobile' | 'tech.cloudDevops' | 'tech.aiMl' | 'tech.design'
  // Case Studies section
  | 'caseStudies.badge' | 'caseStudies.title' | 'caseStudies.subtitle'
  | 'caseStudies.challenge' | 'caseStudies.solution' | 'caseStudies.results'
  | 'caseStudies.conversion' | 'caseStudies.loadTime' | 'caseStudies.engagement'
  | 'caseStudies.sales' | 'caseStudies.processing' | 'caseStudies.satisfaction'
  | 'caseStudies.legalTitle' | 'caseStudies.legalIndustry' | 'caseStudies.legalChallenge' | 'caseStudies.legalSolution'
  | 'caseStudies.ecomTitle' | 'caseStudies.ecomIndustry' | 'caseStudies.ecomChallenge' | 'caseStudies.ecomSolution'
  // Testimonials section
  | 'testimonials.badge' | 'testimonials.title' | 'testimonials.subtitle'
  // Process section
  | 'process.badge' | 'process.title' | 'process.subtitle'
  | 'process.step1' | 'process.step2' | 'process.step3' | 'process.step4'
  | 'process.desc1' | 'process.desc2' | 'process.desc3' | 'process.desc4'
  // Why INFOGRA section
  | 'why.badge' | 'why.title' | 'why.subtitle'
  | 'why.fast' | 'why.global' | 'why.security' | 'why.ontime' | 'why.client' | 'why.results'
  | 'why.fastDesc' | 'why.globalDesc' | 'why.securityDesc' | 'why.ontimeDesc' | 'why.clientDesc' | 'why.resultsDesc'
  // Trusted By section
  | 'trusted.title' | 'trusted.subtitle'
  // FAQ section
  | 'faq.badge' | 'faq.title' | 'faq.subtitle'
  // Contact section
  | 'contact.badge' | 'contact.title' | 'contact.subtitle'
  | 'contact.send' | 'contact.whatsapp' | 'contact.location' | 'contact.info' | 'contact.infoDesc'
  | 'contact.name' | 'contact.email' | 'contact.phone' | 'contact.company' | 'contact.message' | 'contact.service'
  | 'contact.selectService' | 'contact.namePlaceholder' | 'contact.emailPlaceholder' | 'contact.phonePlaceholder'
  | 'contact.companyPlaceholder' | 'contact.messagePlaceholder' | 'contact.sending' | 'contact.thankYou'
  | 'contact.thankYouDesc' | 'contact.subjectService'
  | 'contact.hours' | 'contact.monFri' | 'contact.sat' | 'contact.sun' | 'contact.closed'
  | 'contact.quickHelp' | 'contact.quickHelpDesc'
  // CTA section (bottom)
  | 'ctaSection.badge' | 'ctaSection.title' | 'ctaSection.subtitle' | 'ctaSection.freeConsult'
  // Store Preview section
  | 'store.badge' | 'store.title' | 'store.subtitle'
  | 'store.browse' | 'store.buildPC' | 'store.buildPCDesc' | 'store.startBuilding'
  | 'store.warranty' | 'store.warrantyDesc' | 'store.delivery' | 'store.deliveryDesc'
  | 'store.prices' | 'store.pricesDesc' | 'store.authentic' | 'store.authenticDesc'
  | 'store.productWarranty'

type TranslationMap = Record<TranslationKey, string>

export const translations: Record<Locale, TranslationMap> = {
  en: {
    'site.name': 'INFOGRA',
    'site.tagline': 'Digital Experience Architects',
    'nav.home': 'Home', 'nav.store': 'Store', 'nav.services': 'Services', 'nav.work': 'Work',
    'nav.about': 'About', 'nav.blog': 'Blog', 'nav.contact': 'Contact', 'nav.search': 'Search', 'nav.menu': 'Menu',
    'services.web': 'Web Development', 'services.mobile': 'Mobile Apps', 'services.uiux': 'UI/UX Design',
    'services.branding': 'Branding', 'services.ai': 'AI Solutions', 'services.cloud': 'Cloud Services',
    'cta.getStarted': 'Get Started', 'cta.startProject': 'Start Your Project', 'cta.viewWork': 'View Our Work',
    'cta.viewAll': 'View All Projects', 'cta.browseStore': 'Browse Store', 'cta.buildPC': 'Build Your Dream PC',
    'cta.learnMore': 'Learn More', 'cta.readCaseStudy': 'Read Full Case Study', 'cta.contactUs': 'Contact Us',
    'cta.bookConsultation': 'Book Consultation', 'cta.callUs': 'Call Us Now', 'cta.startChat': 'Start Chat',
    'cta.startBuilding': 'Start Building',
    'footer.company': 'Company', 'footer.services': 'Services', 'footer.resources': 'Resources', 'footer.legal': 'Legal',
    'footer.about': 'About Us', 'footer.team': 'Our Team', 'footer.caseStudies': 'Case Studies',
    'footer.portfolio': 'Portfolio', 'footer.webDev': 'Web Development', 'footer.marketing': 'Digital Marketing',
    'footer.consulting': 'Consulting', 'footer.faq': 'FAQ', 'footer.industries': 'Industries',
    'footer.privacy': 'Privacy Policy', 'footer.terms': 'Terms of Service', 'footer.rights': 'All rights reserved.',
    'footer.description': 'We architect digital experiences where innovative design meets powerful development.',
    'footer.stayUpdated': 'Stay Updated',
    'footer.subscribeDesc': 'Subscribe for the latest insights and updates.',
    'footer.subscribe': 'Subscribe',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.madeWith': 'Made with', 'footer.inEgypt': 'in Egypt',
    'hero.badge': 'Premium Digital Agency',
    'hero.title.line1': 'We Architect', 'hero.title.line2': 'Digital Excellence',
    'hero.subtitle': 'Transform your vision into reality with our premium web development, design, and digital marketing services. We build experiences that captivate and convert.',
    'hero.scroll': 'Scroll to explore',
    'hero.stats.projects': 'Projects Delivered', 'hero.stats.clients': 'Happy Clients',
    'hero.stats.experience': 'Years Experience', 'hero.stats.awards': 'Awards Won',
    'stats.badge': 'Our Impact', 'stats.title': 'Our Impact in Numbers',
    'stats.subtitle': 'We measure our success by the results we deliver for our clients',
    'stats.delivered': 'Projects Delivered', 'stats.partnerships': 'Global partnerships',
    'stats.recognition': 'Industry recognition', 'stats.satisfaction': 'Client Satisfaction',
    'services.badge': 'What We Do', 'services.title': 'Premium Digital Services',
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
    'work.badge': 'Our Work', 'work.title': 'Featured Projects',
    'work.subtitle': 'Explore our portfolio of award-winning digital experiences',
    'work.filterAll': 'All Projects', 'work.filterWeb': 'Web Development', 'work.filterDesign': 'Graphic Design',
    'work.viewProject': 'View Project',
    'tech.badge': 'Our Stack', 'tech.title': 'Technologies We Master',
    'tech.subtitle': 'Cutting-edge tools and frameworks powering the next generation of digital experiences',
    'tech.frontend': 'Frontend', 'tech.backend': 'Backend', 'tech.mobile': 'Mobile',
    'tech.cloudDevops': 'Cloud & DevOps', 'tech.aiMl': 'AI & ML', 'tech.design': 'Design',
    'caseStudies.badge': 'Success Stories', 'caseStudies.title': 'Featured Case Studies',
    'caseStudies.subtitle': 'Deep dive into how we helped businesses achieve their digital transformation goals',
    'caseStudies.challenge': 'The Challenge', 'caseStudies.solution': 'Our Solution', 'caseStudies.results': 'Results',
    'caseStudies.conversion': 'Conversion Rate', 'caseStudies.loadTime': 'Page Load Time',
    'caseStudies.engagement': 'User Engagement', 'caseStudies.sales': 'Online Sales',
    'caseStudies.processing': 'Order Processing', 'caseStudies.satisfaction': 'Customer Satisfaction',
    'caseStudies.legalTitle': 'Alkhunaizan Law Firm', 'caseStudies.legalIndustry': 'Legal Services',
    'caseStudies.legalChallenge': 'Outdated website with poor user experience and low conversion rates.',
    'caseStudies.legalSolution': 'Complete redesign with modern UI, improved navigation, and optimized performance.',
    'caseStudies.ecomTitle': 'Kareem Hafez Toolshop', 'caseStudies.ecomIndustry': 'E-commerce',
    'caseStudies.ecomChallenge': 'Limited online presence with no e-commerce capabilities.',
    'caseStudies.ecomSolution': 'Full e-commerce platform with advanced filtering, payment integration, and inventory management.',
    'testimonials.badge': 'Testimonials', 'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': "Don't just take our word for it — hear from the businesses we've helped transform",
    'process.badge': 'How We Work', 'process.title': 'Our Process',
    'process.subtitle': 'A proven methodology that transforms ideas into exceptional digital experiences',
    'process.step1': 'Discovery & Research', 'process.step2': 'Design & Prototype',
    'process.step3': 'Develop & Build', 'process.step4': 'Launch & Grow',
    'process.desc1': 'We dive deep into your business, audience, and goals to build a strategic foundation for success.',
    'process.desc2': 'Our designers craft stunning interfaces with pixel-perfect attention to detail and user experience.',
    'process.desc3': 'Our engineers bring designs to life with clean, performant, and scalable code.',
    'process.desc4': 'We deploy, monitor, and continuously optimize to ensure your digital success.',
    'why.badge': 'Why Choose Us',
    'why.title': 'Why INFOGRA',
    'why.subtitle': "We don't just build websites — we architect digital experiences that drive real business results",
    'why.fast': 'Lightning Fast',
    'why.global': 'Global Reach',
    'why.security': 'Enterprise Security',
    'why.ontime': 'On-Time Delivery',
    'why.client': 'Client-First',
    'why.results': 'Proven Results',
    'why.fastDesc': 'Performance-optimized websites that load in milliseconds and score 100 on Core Web Vitals.',
    'why.globalDesc': 'Multilingual, multi-currency solutions built for international audiences and markets.',
    'why.securityDesc': 'Bank-grade security with SSL, data encryption, and compliance with global standards.',
    'why.ontimeDesc': 'Agile methodology ensures projects are delivered on schedule with transparent milestones.',
    'why.clientDesc': 'Dedicated project managers and 24/7 support to ensure your complete satisfaction.',
    'why.resultsDesc': 'Data-driven approach that delivers measurable ROI and sustainable business growth.',
    'trusted.title': 'Trusted by Industry Leaders',
    'trusted.subtitle': "We've had the privilege of working with innovative companies across various industries",
    'faq.badge': 'Help Center',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions about our services, process, and technology store',
    'contact.badge': 'Get in Touch',
    'contact.title': "Let's Start Your Project",
    'contact.subtitle': "Ready to transform your digital presence? We'd love to hear from you. Let's create something extraordinary together.",
    'contact.send': 'Send Message', 'contact.whatsapp': 'WhatsApp', 'contact.location': 'Office Location',
    'contact.info': 'Contact Information', 'contact.infoDesc': "Have a project in mind? We'd love to hear about it. Reach out and let's start the conversation.",
    'contact.name': 'Name *', 'contact.email': 'Email *', 'contact.phone': 'Phone', 'contact.company': 'Company',
    'contact.message': 'Message *', 'contact.service': 'Service Interest', 'contact.selectService': 'Select a service',
    'contact.subjectService': 'Service Interest',
    'contact.namePlaceholder': 'John Doe', 'contact.emailPlaceholder': 'john@example.com',
    'contact.phonePlaceholder': '+1 234 567 8900', 'contact.companyPlaceholder': 'Acme Corp',
    'contact.messagePlaceholder': 'Tell us about your project...',
    'contact.sending': 'Sending...',
    'contact.thankYou': 'Thank You!',
    'contact.thankYouDesc': "Your message has been sent successfully. We'll get back to you within 24 hours.",
    'contact.hours': 'Business Hours', 'contact.monFri': 'Monday - Friday', 'contact.sat': 'Saturday',
    'contact.sun': 'Sunday', 'contact.closed': 'Closed',
    'contact.quickHelp': 'Need Quick Help?', 'contact.quickHelpDesc': 'Chat with us directly for immediate assistance.',
    'ctaSection.badge': "Let's Talk",
    'ctaSection.title': 'Ready to Transform Your Digital Presence?',
    'ctaSection.subtitle': "Whether you need a stunning website, a powerful e-commerce platform, or a complete digital transformation — we're here to make it happen.",
    'ctaSection.freeConsult': 'Free consultation · No commitment · Response within 24 hours',
    'store.badge': 'Technology Store',
    'store.title': 'Premium Technology at Your Fingertips',
    'store.subtitle': "Discover gaming laptops, desktop PCs, components, and accessories from the world's leading brands.",
    'store.browse': 'Browse Store',
    'store.buildPC': 'Build Your Dream PC',
    'store.buildPCDesc': 'Custom configurations for gaming, work, and creativity',
    'store.startBuilding': 'Start Building',
    'store.warranty': 'Warranty', 'store.warrantyDesc': '1-3 Year Coverage',
    'store.delivery': 'Fast Delivery', 'store.deliveryDesc': 'Nationwide Shipping',
    'store.prices': 'Best Prices', 'store.pricesDesc': 'Competitive EGP Pricing',
    'store.authentic': 'Authentic', 'store.authenticDesc': '100% Genuine Products',
    'store.productWarranty': '1-3 Year Coverage',
  },
  ar: {
    'site.name': 'إنفوجرا', 'site.tagline': 'مهندسي التجارب الرقمية',
    'nav.home': 'الرئيسية', 'nav.store': 'المتجر', 'nav.services': 'الخدمات', 'nav.work': 'أعمالنا',
    'nav.about': 'عن الشركة', 'nav.blog': 'المدونة', 'nav.contact': 'تواصل معنا', 'nav.search': 'بحث', 'nav.menu': 'القائمة',
    'services.web': 'تطوير المواقع', 'services.mobile': 'تطبيقات الجوال', 'services.uiux': 'تصميم UI/UX',
    'services.branding': 'الهوية البصرية', 'services.ai': 'حلول الذكاء الاصطناعي', 'services.cloud': 'الخدمات السحابية',
    'cta.getStarted': 'ابدأ مشروعك', 'cta.startProject': 'ابدأ مشروعك', 'cta.viewWork': 'شاهد أعمالنا',
    'cta.viewAll': 'عرض كل المشاريع', 'cta.browseStore': 'تصفح المتجر', 'cta.buildPC': 'ابنِ جهازك المثالي',
    'cta.learnMore': 'اعرف المزيد', 'cta.readCaseStudy': 'اقرأ دراسة الحالة', 'cta.contactUs': 'تواصل معنا',
    'cta.bookConsultation': 'احجز استشارة', 'cta.callUs': 'اتصل بنا الآن', 'cta.startChat': 'ابدأ المحادثة',
    'cta.startBuilding': 'ابدأ التجميع',
    'footer.company': 'الشركة', 'footer.services': 'الخدمات', 'footer.resources': 'المصادر', 'footer.legal': 'القانونية',
    'footer.about': 'من نحن', 'footer.team': 'فريقنا', 'footer.caseStudies': 'دراسات الحالة',
    'footer.portfolio': 'معرض الأعمال', 'footer.webDev': 'تطوير المواقع', 'footer.marketing': 'التسويق الرقمي',
    'footer.consulting': 'الاستشارات', 'footer.faq': 'الأسئلة الشائعة', 'footer.industries': 'المجالات',
    'footer.privacy': 'سياسة الخصوصية', 'footer.terms': 'شروط الخدمة', 'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.description': 'نصمم تجارب رقمية حيث يلتقي التصميم المبتكر مع التطوير القوي.',
    'footer.stayUpdated': 'ابق على اطلاع',
    'footer.subscribeDesc': 'اشترك لتصلك أحدث المقالات والتحديثات.',
    'footer.subscribe': 'اشتراك',
    'footer.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'footer.madeWith': 'صنع بـ', 'footer.inEgypt': 'في مصر',
    'hero.badge': 'وكالة رقمية متميزة',
    'hero.title.line1': 'نحن نصمم', 'hero.title.line2': 'التميز الرقمي',
    'hero.subtitle': 'حول رؤيتك إلى واقع مع خدماتنا المتميزة في تطوير المواقع والتصميم والتسويق الرقمي. نبني تجارب تأسر وتحول.',
    'hero.scroll': 'اسفل للمزيد',
    'hero.stats.projects': 'مشروع تم تسليمه', 'hero.stats.clients': 'عميل سعيد',
    'hero.stats.experience': 'سنوات خبرة', 'hero.stats.awards': 'جائزة حصلنا عليها',
    'stats.badge': 'أثرنا', 'stats.title': 'أثرنا بالأرقام',
    'stats.subtitle': 'نقيس نجاحنا بالنتائج التي نحققها لعملائنا',
    'stats.delivered': 'مشروع تم تسليمه', 'stats.partnerships': 'شراكات عالمية',
    'stats.recognition': 'جوائز صناعية', 'stats.satisfaction': 'رضا العملاء',
    'services.badge': 'ماذا نقدم', 'services.title': 'خدمات رقمية متميزة',
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
    'work.badge': 'أعمالنا', 'work.title': 'مشاريعنا المميزة',
    'work.subtitle': 'استكشف محفظتنا من التجارب الرقمية الحائزة على جوائز',
    'work.filterAll': 'كل المشاريع', 'work.filterWeb': 'تطوير المواقع', 'work.filterDesign': 'التصميم الجرافيكي',
    'work.viewProject': 'عرض المشروع',
    'tech.badge': 'تقنياتنا', 'tech.title': 'التقنيات التي نتقنها',
    'tech.subtitle': 'أدوات وأطر عمل متطورة تقود الجيل القادم من التجارب الرقمية',
    'tech.frontend': 'الواجهات الأمامية', 'tech.backend': 'الخوادم', 'tech.mobile': 'التطبيقات',
    'tech.cloudDevops': 'السحابة والتشغيل', 'tech.aiMl': 'الذكاء الاصطناعي', 'tech.design': 'التصميم',
    'caseStudies.badge': 'قصص النجاح', 'caseStudies.title': 'دراسات الحالة المميزة',
    'caseStudies.subtitle': 'تعمق في كيفية مساعدتنا للشركات لتحقيق أهداف التحول الرقمي',
    'caseStudies.challenge': 'التحدي', 'caseStudies.solution': 'الحل', 'caseStudies.results': 'النتائج',
    'caseStudies.conversion': 'معدل التحويل', 'caseStudies.loadTime': 'سرعة التحميل',
    'caseStudies.engagement': 'تفاعل المستخدمين', 'caseStudies.sales': 'المبيعات عبر الإنترنت',
    'caseStudies.processing': 'معالجة الطلبات', 'caseStudies.satisfaction': 'رضا العملاء',
    'caseStudies.legalTitle': 'مكتب الخنيزان القانوني', 'caseStudies.legalIndustry': 'خدمات قانونية',
    'caseStudies.legalChallenge': 'موقع قديم بتجربة مستخدم ضعيفة ومعدلات تحويل منخفضة.',
    'caseStudies.legalSolution': 'إعادة تصميم كاملة بواجهة حديثة وتحسين الأداء وتجربة المستخدم.',
    'caseStudies.ecomTitle': 'معدات كريم حافظ', 'caseStudies.ecomIndustry': 'تجارة إلكترونية',
    'caseStudies.ecomChallenge': 'تواجد محدود على الإنترنت بدون قدرات تجارة إلكترونية.',
    'caseStudies.ecomSolution': 'منصة تجارة إلكترونية كاملة مع فلترة متقدمة وربط الدفع وإدارة المخزون.',
    'testimonials.badge': 'الشهادات', 'testimonials.title': 'ماذا يقول عملاؤنا',
    'testimonials.subtitle': 'لا تأخذ كلامنا فقط — اسمع من الشركات التي ساعدناها في التحول',
    'process.badge': 'كيف نعمل', 'process.title': 'عملية عملنا',
    'process.subtitle': 'منهجية مثبتة تحول الأفكار إلى تجارب رقمية استثنائية',
    'process.step1': 'الاكتشاف والبحث', 'process.step2': 'التصميم والنمذجة',
    'process.step3': 'التطوير والبناء', 'process.step4': 'الإطلاق والنمو',
    'process.desc1': 'نغوص في أعمالك وجمهورك وأهدافك لبناء أساس استراتيجي للنجاح.',
    'process.desc2': 'يصمم مصممونا واجهات مذهلة مع الاهتمام بأدق التفاصيل وتجربة المستخدم.',
    'process.desc3': 'يحول مهندسونا التصاميم إلى واقع بكود نظيف وعالي الأداء وقابل للتوسع.',
    'process.desc4': 'ننشر ونراقب ونحسن باستمرار لضمان نجاحك الرقمي.',
    'why.badge': 'لماذا تختارنا',
    'why.title': 'لماذا إنفوجرا',
    'why.subtitle': 'لا نبني مواقع فقط — بل نصمم تجارب رقمية تحقق نتائج أعمال حقيقية',
    'why.fast': 'سرعة فائقة', 'why.global': 'وصول عالمي', 'why.security': 'أمان مؤسسي',
    'why.ontime': 'تسليم في الوقت المحدد', 'why.client': 'العميل أولاً', 'why.results': 'نتائج مثبتة',
    'why.fastDesc': 'مواقع محسنة للأداء يتم تحميلها بالميلي ثانية وتحصل على 100 في مؤشرات الأداء.',
    'why.globalDesc': 'حلول متعددة اللغات والعملات مصممة للجمهور والأسواق الدولية.',
    'why.securityDesc': 'أمان على مستوى البنوك مع تشفير البيانات والامتثال للمعايير العالمية.',
    'why.ontimeDesc': 'منهجية أجايل تضمن تسليم المشاريع في الموعد المحدد بمراحل واضحة وشفافة.',
    'why.clientDesc': 'مديري مشاريع ودعم 24/7 لضمان رضاك التام.',
    'why.resultsDesc': 'منهج قائم على البيانات يحقق عائد استثمار ملموس ونمو أعمال مستدام.',
    'trusted.title': 'موثوق من قبل قادة الصناعة',
    'trusted.subtitle': 'تشرفنا بالعمل مع شركات مبتكرة في مختلف المجالات',
    'faq.badge': 'مركز المساعدة', 'faq.title': 'الأسئلة الشائعة',
    'faq.subtitle': 'اعثر على إجابات للأسئلة الشائعة حول خدماتنا وعملية العمل والمتجر التقني',
    'contact.badge': 'تواصل معنا', 'contact.title': 'لنبدأ مشروعك',
    'contact.subtitle': 'مستعد لتحويل حضورك الرقمي؟ يسعدنا سماعك. لنبدع شيئاً استثنائياً معاً.',
    'contact.send': 'أرسل رسالة', 'contact.whatsapp': 'واتساب', 'contact.location': 'موقع المكتب',
    'contact.info': 'معلومات الاتصال',
    'contact.infoDesc': 'هل لديك مشروع في ذهنك؟ يسعدنا سماعك. تواصل معنا ودعنا نبدأ المحادثة.',
    'contact.name': 'الاسم *', 'contact.email': 'البريد الإلكتروني *', 'contact.phone': 'الهاتف',
    'contact.company': 'الشركة', 'contact.message': 'الرسالة *', 'contact.service': 'الخدمة المطلوبة',
    'contact.selectService': 'اختر خدمة', 'contact.subjectService': 'الخدمة المطلوبة',
    'contact.namePlaceholder': 'محمد أحمد', 'contact.emailPlaceholder': 'mohamed@example.com',
    'contact.phonePlaceholder': '+20 123 456 7890', 'contact.companyPlaceholder': 'شركتك',
    'contact.messagePlaceholder': 'أخبرنا عن مشروعك...',
    'contact.sending': 'جارٍ الإرسال...',
    'contact.thankYou': 'شكراً لك!',
    'contact.thankYouDesc': 'تم إرسال رسالتك بنجاح. سنتواصل معك خلال 24 ساعة.',
    'contact.hours': 'ساعات العمل', 'contact.monFri': 'الإثنين - الجمعة', 'contact.sat': 'السبت',
    'contact.sun': 'الأحد', 'contact.closed': 'مغلق',
    'contact.quickHelp': 'هل تحتاج مساعدة سريعة؟', 'contact.quickHelpDesc': 'تحدث معنا مباشرة للحصول على مساعدة فورية.',
    'ctaSection.badge': 'لنتحدث',
    'ctaSection.title': 'مستعد لتحويل حضورك الرقمي؟',
    'ctaSection.subtitle': 'سواء كنت تحتاج موقعاً مذهلاً، منصة تجارة إلكترونية قوية، أو تحولاً رقمياً كاملاً — نحن هنا لتحقيق ذلك.',
    'ctaSection.freeConsult': 'استشارة مجانية · بدون التزام · رد خلال 24 ساعة',
    'store.badge': 'المتجر التقني',
    'store.title': 'تقنية متميزة بين يديك',
    'store.subtitle': 'اكتشف لابتوبات الألعاب، أجهزة الكمبيوتر المكتبية، المكونات والإكسسوارات من أشهر الماركات العالمية.',
    'store.browse': 'تصفح المتجر',
    'store.buildPC': 'ابنِ جهاز أحلامك',
    'store.buildPCDesc': 'تكوينات مخصصة للألعاب والعمل والإبداع',
    'store.startBuilding': 'ابدأ التجميع',
    'store.warranty': 'الضمان', 'store.warrantyDesc': 'تغطية من 1-3 سنوات',
    'store.delivery': 'توصيل سريع', 'store.deliveryDesc': 'شحن لجميع أنحاء الجمهورية',
    'store.prices': 'أفضل الأسعار', 'store.pricesDesc': 'أسعار تنافسية بالجنيه المصري',
    'store.authentic': 'منتجات أصلية', 'store.authenticDesc': 'منتجات 100% أصلية',
    'store.productWarranty': 'تغطية من 1-3 سنوات',
  },
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || key
}
