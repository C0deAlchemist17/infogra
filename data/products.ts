import { Product, Category, Brand } from '@/types/store'

// Old products removed - only imported products from Kimo/Elhamd should be shown
export const products: Product[] = []

export const categories: Category[] = [
  { id: 'laptops', name: 'Laptops', slug: 'laptops', icon: '💻', subcategories: ["Gaming","Business"], productCount: 18 },
  { id: 'monitors', name: 'Monitors', slug: 'monitors', icon: '🖥️', subcategories: ["Gaming","Professional"], productCount: 11 },
  { id: 'graphics-cards', name: 'Graphics-cards', slug: 'graphics-cards', icon: '🎮', subcategories: ["AMD","NVIDIA"], productCount: 6 },
  { id: 'ram', name: 'Ram', slug: 'ram', icon: '💾', subcategories: ["DDR5","DDR4"], productCount: 5 },
  { id: 'storage', name: 'Storage', slug: 'storage', icon: '💿', subcategories: ["SSD","NVMe","HDD"], productCount: 9 },
  { id: 'cooling', name: 'Cooling', slug: 'cooling', icon: '❄️', subcategories: ["Air Coolers","AIO Liquid"], productCount: 7 },
  { id: 'accessories', name: 'Accessories', slug: 'accessories', icon: '🎁', subcategories: ["Cables & Adapters","Mobile","Cables"], productCount: 7 },
  { id: 'power-supplies', name: 'Power-supplies', slug: 'power-supplies', icon: '🔌', subcategories: ["850W","750W","650W","1000W+"], productCount: 5 },
  { id: 'cases', name: 'Cases', slug: 'cases', icon: '📦', subcategories: ["ATX"], productCount: 5 },
  { id: 'keyboards', name: 'Keyboards', slug: 'keyboards', icon: '⌨️', subcategories: ["Gaming"], productCount: 4 },
  { id: 'mice', name: 'Mice', slug: 'mice', icon: '🖱️', subcategories: ["Gaming","Wireless"], productCount: 6 },
  { id: 'headsets', name: 'Headsets', slug: 'headsets', icon: '🎧', subcategories: ["Gaming"], productCount: 3 },
  { id: 'routers-networking', name: 'Routers-networking', slug: 'routers-networking', icon: '📡', subcategories: ["Gaming","WiFi 6"], productCount: 5 },
  { id: 'printers', name: 'Printers', slug: 'printers', icon: '🖨️', subcategories: ["Laser"], productCount: 1 },
  { id: 'motherboards', name: 'Motherboards', slug: 'motherboards', icon: '🔧', subcategories: ["AMD","Intel"], productCount: 3 },
  { id: 'processors', name: 'Processors', slug: 'processors', icon: '⚡', subcategories: ["AMD","Intel"], productCount: 8 },
  { id: 'desktops', name: 'Desktops', slug: 'desktops', icon: '🖥️', subcategories: ["Gaming"], productCount: 2 }
]

export const brands: Brand[] = [
  { id: 'lenovo', name: 'Lenovo', slug: 'lenovo', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Lenovo_logo_2015.svg', featured: true },
  { id: 'hp', name: 'HP', slug: 'hp', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/HP_logo_2012.svg', featured: true },
  { id: 'asus', name: 'ASUS', slug: 'asus', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg', featured: true },
  { id: 'gigabyte', name: 'GIGABYTE', slug: 'gigabyte', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Gigabyte_Technology_logo.svg', featured: true },
  { id: 'samsung', name: 'Samsung', slug: 'samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', featured: false },
  { id: 'id-cooling', name: 'ID-COOLING', slug: 'id-cooling', logo: '', featured: false },
  { id: 'dell', name: 'Dell', slug: 'dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Dell_logo.svg', featured: true },
  { id: 'lg', name: 'LG', slug: 'lg', logo: '', featured: false },
  { id: 'nvidia', name: 'NVIDIA', slug: 'nvidia', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', featured: true },
  { id: 'corsair', name: 'Corsair', slug: 'corsair', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Corsair_Gaming_Logo.svg', featured: true },
  { id: 'kingston', name: 'Kingston', slug: 'kingston', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Kingston_Technology_logo.svg', featured: false },
  { id: 'nzxt', name: 'NZXT', slug: 'nzxt', logo: '', featured: false },
  { id: 'logitech', name: 'Logitech', slug: 'logitech', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Logitech_logo.svg', featured: true },
  { id: 'razer', name: 'Razer', slug: 'razer', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Razer_logo.svg', featured: true },
  { id: 'hyperx', name: 'HyperX', slug: 'hyperx', logo: '', featured: false },
  { id: 'crucial', name: 'Crucial', slug: 'crucial', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Crucial_logo.svg', featured: false },
  { id: 'msi', name: 'MSI', slug: 'msi', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/MSI_logo.svg', featured: true },
  { id: 'amd', name: 'AMD', slug: 'amd', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/AMD_logo.svg', featured: true },
  { id: 'intel', name: 'Intel', slug: 'intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo.svg', featured: true },
  { id: 'huawei', name: 'Huawei', slug: 'huawei', logo: '', featured: false },
  { id: 'zero', name: 'Zero', slug: 'zero', logo: '', featured: false },
  { id: 'evga', name: 'EVGA', slug: 'evga', logo: '', featured: false },
  { id: 'cooler-master', name: 'Cooler Master', slug: 'cooler-master', logo: '', featured: false },
  { id: 'deepcool', name: 'DeepCool', slug: 'deepcool', logo: '', featured: false },
  { id: 'tecno', name: 'Tecno', slug: 'tecno', logo: '', featured: false },
  { id: 'g.skill', name: 'G.Skill', slug: 'g.skill', logo: '', featured: false },
  { id: 'tp-link', name: 'TP-Link', slug: 'tp-link', logo: '', featured: false },
  { id: 'steelseries', name: 'SteelSeries', slug: 'steelseries', logo: '', featured: false },
  { id: 'aoc', name: 'AOC', slug: 'aoc', logo: '', featured: false },
  { id: 'thermaltake', name: 'Thermaltake', slug: 'thermaltake', logo: '', featured: false },
  { id: 'noctua', name: 'Noctua', slug: 'noctua', logo: '', featured: false },
  { id: 'mix-max', name: 'MIX MAX', slug: 'mix-max', logo: '', featured: false },
  { id: 'blisbond', name: 'BLISBOND', slug: 'blisbond', logo: '', featured: false },
  { id: 'momo', name: 'MOMO', slug: 'momo', logo: '', featured: false }
]

