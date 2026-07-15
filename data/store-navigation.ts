// Complete store navigation matching elhamdstore.com structure
export interface StoreCategory {
  id: string
  name: string
  nameAr: string
  slug: string
  icon: string
  subcategories: StoreSubcategory[]
  productCount?: number
}

export interface StoreSubcategory {
  id: string
  name: string
  nameAr: string
  slug: string
  productCount?: number
}

export const storeNavigation: StoreCategory[] = [
  {
    id: 'laptops',
    name: 'Laptops',
    nameAr: 'لابتوبات',
    slug: 'laptops',
    icon: '💻',
    subcategories: [
      { id: 'gaming-laptops', name: 'Gaming Laptops', nameAr: 'لابتوبات جيمنج', slug: 'gaming-laptops', productCount: 45 },
      { id: 'business-laptops', name: 'Business Laptops', nameAr: 'لابتوبات مكتبية', slug: 'business-laptops', productCount: 32 },
      { id: 'ultrabooks', name: 'Ultrabooks', nameAr: 'ألترابوك', slug: 'ultrabooks', productCount: 18 },
      { id: 'student-laptops', name: 'Student Laptops', nameAr: 'لابتوبات طلاب', slug: 'student-laptops', productCount: 15 },
      { id: 'workstations', name: 'Workstations', nameAr: 'محطات عمل', slug: 'workstations', productCount: 12 },
    ],
  },
  {
    id: 'desktops',
    name: 'Desktop PCs',
    nameAr: 'كمبيوتر مكتبي',
    slug: 'desktops',
    icon: '🖥️',
    subcategories: [
      { id: 'gaming-pcs', name: 'Gaming PCs', nameAr: 'كمبيوتر جيمنج', slug: 'gaming-pcs', productCount: 28 },
      { id: 'office-pcs', name: 'Office PCs', nameAr: 'كمبيوتر مكتبي', slug: 'office-pcs', productCount: 22 },
      { id: 'all-in-one', name: 'All-in-One', nameAr: 'كل في واحد', slug: 'all-in-one', productCount: 15 },
      { id: 'mini-pcs', name: 'Mini PCs', nameAr: 'ميني كمبيوتر', slug: 'mini-pcs', productCount: 10 },
    ],
  },
  {
    id: 'monitors',
    name: 'Monitors',
    nameAr: 'شاشات عرض',
    slug: 'monitors',
    icon: '🖥️',
    subcategories: [
      { id: 'gaming-monitors', name: 'Gaming Monitors', nameAr: 'شاشات جيمنج', slug: 'gaming-monitors', productCount: 38 },
      { id: 'office-monitors', name: 'Office Monitors', nameAr: 'شاشات مكتبية', slug: 'office-monitors', productCount: 25 },
      { id: 'professional-monitors', name: 'Professional Monitors', nameAr: 'شاشات احترافية', slug: 'professional-monitors', productCount: 18 },
      { id: 'ultrawide-monitors', name: 'Ultrawide Monitors', nameAr: 'شاشات ألترا ويد', slug: 'ultrawide-monitors', productCount: 12 },
      { id: 'curved-monitors', name: 'Curved Monitors', nameAr: 'شاشات منحنية', slug: 'curved-monitors', productCount: 15 },
    ],
  },
  {
    id: 'graphics-cards',
    name: 'Graphics Cards',
    nameAr: 'كارت شاشة',
    slug: 'graphics-cards',
    icon: '🎮',
    subcategories: [
      { id: 'nvidia-rtx', name: 'NVIDIA RTX', nameAr: 'انفيديا RTX', slug: 'nvidia-rtx', productCount: 42 },
      { id: 'nvidia-geforce', name: 'NVIDIA GeForce', nameAr: 'انفيديا جي فورس', slug: 'nvidia-geforce', productCount: 28 },
      { id: 'amd-radeon', name: 'AMD Radeon', nameAr: 'AMD راديون', slug: 'amd-radeon', productCount: 25 },
      { id: 'workstation-gpu', name: 'Workstation GPU', nameAr: 'كرت شاشة محطة عمل', slug: 'workstation-gpu', productCount: 10 },
    ],
  },
  {
    id: 'processors',
    name: 'Processors',
    nameAr: 'معالجات',
    slug: 'processors',
    icon: '⚡',
    subcategories: [
      { id: 'intel-processors', name: 'Intel Processors', nameAr: 'معالجات انتل', slug: 'intel-processors', productCount: 35 },
      { id: 'amd-processors', name: 'AMD Processors', nameAr: 'معالجات ايه ام دي', slug: 'amd-processors', productCount: 30 },
      { id: 'server-processors', name: 'Server Processors', nameAr: 'معالجات سيرفر', slug: 'server-processors', productCount: 8 },
    ],
  },
  {
    id: 'motherboards',
    name: 'Motherboards',
    nameAr: 'لوحة أم',
    slug: 'motherboards',
    icon: '🔧',
    subcategories: [
      { id: 'intel-motherboards', name: 'Intel Motherboards', nameAr: 'لوحة أم انتل', slug: 'intel-motherboards', productCount: 30 },
      { id: 'amd-motherboards', name: 'AMD Motherboards', nameAr: 'لوحة أم ايه ام دي', slug: 'amd-motherboards', productCount: 28 },
      { id: 'atx-motherboards', name: 'ATX Motherboards', nameAr: 'لوحة أم ATX', slug: 'atx-motherboards', productCount: 25 },
      { id: 'micro-atx', name: 'Micro-ATX', nameAr: 'مايكرو ATX', slug: 'micro-atx', productCount: 18 },
      { id: 'mini-itx', name: 'Mini-ITX', nameAr: 'ميني ITX', slug: 'mini-itx', productCount: 12 },
    ],
  },
  {
    id: 'ram',
    name: 'RAM Memory',
    nameAr: 'ذاكرة رام',
    slug: 'ram',
    icon: '💾',
    subcategories: [
      { id: 'ddr4-ram', name: 'DDR4 RAM', nameAr: 'رام DDR4', slug: 'ddr4-ram', productCount: 40 },
      { id: 'ddr5-ram', name: 'DDR5 RAM', nameAr: 'رام DDR5', slug: 'ddr5-ram', productCount: 35 },
      { id: 'laptop-ram', name: 'Laptop RAM', nameAr: 'رام لابتوب', slug: 'laptop-ram', productCount: 20 },
      { id: 'server-ram', name: 'Server RAM', nameAr: 'رام سيرفر', slug: 'server-ram', productCount: 12 },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    nameAr: 'التخزين',
    slug: 'storage',
    icon: '💿',
    subcategories: [
      { id: 'ssd', name: 'SSD', nameAr: 'SSD', slug: 'ssd', productCount: 52 },
      { id: 'nvme-ssd', name: 'NVMe SSD', nameAr: 'NVMe SSD', slug: 'nvme-ssd', productCount: 35 },
      { id: 'hdd', name: 'HDD', nameAr: 'هارد ديسك', slug: 'hdd', productCount: 25 },
      { id: 'external-storage', name: 'External Storage', nameAr: 'تخزين خارجي', slug: 'external-storage', productCount: 18 },
      { id: 'nas-drives', name: 'NAS Drives', nameAr: 'أجهزة NAS', slug: 'nas-drives', productCount: 10 },
    ],
  },
  {
    id: 'power-supplies',
    name: 'Power Supplies',
    nameAr: 'باور سبلاي',
    slug: 'power-supplies',
    icon: '🔌',
    subcategories: [
      { id: '650w-750w', name: '650W - 750W', nameAr: '650 واط - 750 واط', slug: '650w-750w', productCount: 18 },
      { id: '750w-850w', name: '750W - 850W', nameAr: '750 واط - 850 واط', slug: '750w-850w', productCount: 15 },
      { id: '850w-1000w', name: '850W - 1000W', nameAr: '850 واط - 1000 واط', slug: '850w-1000w', productCount: 12 },
      { id: '1000w-plus', name: '1000W+', nameAr: '1000 واط+', slug: '1000w-plus', productCount: 8 },
    ],
  },
  {
    id: 'cases',
    name: 'PC Cases',
    nameAr: 'كيس كمبيوتر',
    slug: 'cases',
    icon: '📦',
    subcategories: [
      { id: 'atx-cases', name: 'ATX Cases', nameAr: 'كيس ATX', slug: 'atx-cases', productCount: 25 },
      { id: 'micro-atx-cases', name: 'Micro-ATX Cases', nameAr: 'كيس مايكرو ATX', slug: 'micro-atx-cases', productCount: 18 },
      { id: 'mini-itx-cases', name: 'Mini-ITX Cases', nameAr: 'كيس ميني ITX', slug: 'mini-itx-cases', productCount: 12 },
      { id: 'full-tower', name: 'Full Tower', nameAr: 'كيس تاور كامل', slug: 'full-tower', productCount: 10 },
    ],
  },
  {
    id: 'cooling',
    name: 'Cooling',
    nameAr: 'تبريد',
    slug: 'cooling',
    icon: '❄️',
    subcategories: [
      { id: 'air-coolers', name: 'Air Coolers', nameAr: 'مراوح تبريد', slug: 'air-coolers', productCount: 28 },
      { id: 'aio-liquid', name: 'AIO Liquid Coolers', nameAr: 'تبريد مائي', slug: 'aio-liquid', productCount: 22 },
      { id: 'case-fans', name: 'Case Fans', nameAr: 'مراوح كيس', slug: 'case-fans', productCount: 25 },
      { id: 'thermal-paste', name: 'Thermal Paste', nameAr: 'معجون تبريد', slug: 'thermal-paste', productCount: 10 },
    ],
  },
  {
    id: 'keyboards',
    name: 'Keyboards',
    nameAr: 'لوحة مفاتيح',
    slug: 'keyboards',
    icon: '⌨️',
    subcategories: [
      { id: 'mechanical-keyboards', name: 'Mechanical Keyboards', nameAr: 'لوحة مفاتيح ميكانيكية', slug: 'mechanical-keyboards', productCount: 35 },
      { id: 'gaming-keyboards', name: 'Gaming Keyboards', nameAr: 'لوحة مفاتيح جيمنج', slug: 'gaming-keyboards', productCount: 30 },
      { id: 'office-keyboards', name: 'Office Keyboards', nameAr: 'لوحة مفاتيح مكتبية', slug: 'office-keyboards', productCount: 22 },
      { id: 'wireless-keyboards', name: 'Wireless Keyboards', nameAr: 'لوحة مفاتيح لاسلكية', slug: 'wireless-keyboards', productCount: 18 },
    ],
  },
  {
    id: 'mice',
    name: 'Mice',
    nameAr: 'ماوس',
    slug: 'mice',
    icon: '🖱️',
    subcategories: [
      { id: 'gaming-mice', name: 'Gaming Mice', nameAr: 'ماوس جيمنج', slug: 'gaming-mice', productCount: 38 },
      { id: 'wireless-mice', name: 'Wireless Mice', nameAr: 'ماوس لاسلكي', slug: 'wireless-mice', productCount: 25 },
      { id: 'ergonomic-mice', name: 'Ergonomic Mice', nameAr: 'ماوس مريح', slug: 'ergonomic-mice', productCount: 15 },
      { id: 'office-mice', name: 'Office Mice', nameAr: 'ماوس مكتبي', slug: 'office-mice', productCount: 20 },
    ],
  },
  {
    id: 'headsets',
    name: 'Headsets',
    nameAr: 'سماعات',
    slug: 'headsets',
    icon: '🎧',
    subcategories: [
      { id: 'gaming-headsets', name: 'Gaming Headsets', nameAr: 'سماعات جيمنج', slug: 'gaming-headsets', productCount: 30 },
      { id: 'wireless-headsets', name: 'Wireless Headsets', nameAr: 'سماعات لاسلكية', slug: 'wireless-headsets', productCount: 22 },
      { id: 'studio-headphones', name: 'Studio Headphones', nameAr: 'سماعات استوديو', slug: 'studio-headphones', productCount: 12 },
    ],
  },
  {
    id: 'routers-networking',
    name: 'Routers & Networking',
    nameAr: 'روتر وشبكات',
    slug: 'routers-networking',
    icon: '📡',
    subcategories: [
      { id: 'wifi-routers', name: 'WiFi Routers', nameAr: 'روتر واي فاي', slug: 'wifi-routers', productCount: 22 },
      { id: 'gaming-routers', name: 'Gaming Routers', nameAr: 'روتر جيمنج', slug: 'gaming-routers', productCount: 12 },
      { id: 'mesh-systems', name: 'Mesh Systems', nameAr: 'أنظمة ميش', slug: 'mesh-systems', productCount: 10 },
      { id: 'network-switches', name: 'Network Switches', nameAr: 'سويتش شبكة', slug: 'network-switches', productCount: 15 },
      { id: 'lan-cables', name: 'LAN Cables', nameAr: 'كابلات شبكة', slug: 'lan-cables', productCount: 20 },
      { id: 'network-adapters', name: 'Network Adapters', nameAr: 'محولات شبكة', slug: 'network-adapters', productCount: 12 },
    ],
  },
  {
    id: 'printers',
    name: 'Printers',
    nameAr: 'طابعات',
    slug: 'printers',
    icon: '🖨️',
    subcategories: [
      { id: 'laser-printers', name: 'Laser Printers', nameAr: 'طابعات ليزر', slug: 'laser-printers', productCount: 18 },
      { id: 'inkjet-printers', name: 'Inkjet Printers', nameAr: 'طابعات حبر', slug: 'inkjet-printers', productCount: 15 },
      { id: 'all-in-one-printers', name: 'All-in-One Printers', nameAr: 'طابعات كل في واحد', slug: 'all-in-one-printers', productCount: 12 },
      { id: 'printer-supplies', name: 'Printer Supplies', nameAr: 'مستلزمات طابعات', slug: 'printer-supplies', productCount: 20 },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    nameAr: 'اكسسوارات',
    slug: 'accessories',
    icon: '🎁',
    subcategories: [
      { id: 'mouse-pads', name: 'Mouse Pads', nameAr: 'باد ماوس', slug: 'mouse-pads', productCount: 25 },
      { id: 'cables-adapters', name: 'Cables & Adapters', nameAr: 'كابلات ومحولات', slug: 'cables-adapters', productCount: 30 },
      { id: 'usb-hubs', name: 'USB Hubs', nameAr: 'USB هاب', slug: 'usb-hubs', productCount: 12 },
      { id: 'laptop-bags', name: 'Laptop Bags', nameAr: 'شنتلابتوب', slug: 'laptop-bags', productCount: 18 },
      { id: 'webcams', name: 'Webcams', nameAr: 'كاميرات ويب', slug: 'webcams', productCount: 15 },
      { id: 'microphones', name: 'Microphones', nameAr: 'ميكروفونات', slug: 'microphones', productCount: 12 },
      { id: 'ups', name: 'UPS', nameAr: 'UPS', slug: 'ups', productCount: 10 },
      { id: 'laptop-coolers', name: 'Laptop Coolers', nameAr: 'مراوح لابتوب', slug: 'laptop-coolers', productCount: 15 },
    ],
  },
  {
    id: 'software',
    name: 'Software',
    nameAr: 'برمجيات',
    slug: 'software',
    icon: '💿',
    subcategories: [
      { id: 'windows', name: 'Windows', nameAr: 'ويندوز', slug: 'windows', productCount: 12 },
      { id: 'office-software', name: 'Office', nameAr: 'أوفيس', slug: 'office-software', productCount: 8 },
      { id: 'antivirus', name: 'Antivirus', nameAr: 'برامج حماية', slug: 'antivirus', productCount: 10 },
      { id: 'creative-software', name: 'Creative Software', nameAr: 'برمجيات إبداعية', slug: 'creative-software', productCount: 8 },
    ],
  },
  {
    id: 'gaming-peripherals',
    name: 'Gaming Peripherals',
    nameAr: 'اكسسوارات جيمنج',
    slug: 'gaming-peripherals',
    icon: '🎮',
    subcategories: [
      { id: 'gamepads', name: 'Gamepads', nameAr: 'جيمباد', slug: 'gamepads', productCount: 18 },
      { id: 'gaming-chairs', name: 'Gaming Chairs', nameAr: 'كراسي جيمنج', slug: 'gaming-chairs', productCount: 15 },
      { id: 'gaming-desks', name: 'Gaming Desks', nameAr: 'مكاتب جيمنج', slug: 'gaming-desks', productCount: 10 },
      { id: 'streaming-gear', name: 'Streaming Gear', nameAr: 'معدات البث', slug: 'streaming-gear', productCount: 12 },
    ],
  },
]

// Get all subcategories flattened
export const getAllSubcategories = (): (StoreSubcategory & { parentCategory: string })[] => {
  return storeNavigation.flatMap(cat => 
    cat.subcategories.map(sub => ({
      ...sub,
      parentCategory: cat.slug,
    }))
  )
}

// Find category by slug
export const getCategoryBySlug = (slug: string): StoreCategory | undefined => {
  return storeNavigation.find(cat => cat.slug === slug)
}

// Find subcategory by slug
export const getSubcategoryBySlug = (slug: string): (StoreSubcategory & { parentCategory: string }) | undefined => {
  for (const cat of storeNavigation) {
    const sub = cat.subcategories.find(s => s.slug === slug)
    if (sub) {
      return { ...sub, parentCategory: cat.slug }
    }
  }
  return undefined
}

// Footer navigation for store
export const storeFooter = {
  customerService: [
    { name: 'Track Order', nameAr: 'تتبع الطلب', href: '/store/track-order' },
    { name: 'Return Policy', nameAr: 'سياسة الإرجاع', href: '/store/returns' },
    { name: 'Warranty', nameAr: 'الضمان', href: '/store/warranty' },
    { name: 'FAQ', nameAr: 'الأسئلة الشائعة', href: '/faq' },
    { name: 'Contact Us', nameAr: 'تواصل معنا', href: '/contact' },
  ],
  about: [
    { name: 'About Us', nameAr: 'عن الحمد ستور', href: '/about' },
    { name: 'Privacy Policy', nameAr: 'سياسة الخصوصية', href: '/privacy-policy' },
    { name: 'Terms of Service', nameAr: 'شروط الخدمة', href: '/terms' },
  ],
  payment: [
    { name: 'Cash on Delivery', nameAr: 'الدفع عند الاستلام', href: '#' },
    { name: 'Credit Card', nameAr: 'بطاقة ائتمان', href: '#' },
    { name: 'Installments', nameAr: 'تقسيط', href: '#' },
    { name: 'Vodafone Cash', nameAr: 'فودافون كاش', href: '#' },
  ],
}
