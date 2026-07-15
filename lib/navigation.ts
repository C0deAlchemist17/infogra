export interface NavItem {
  name: string
  href: string
  hasDropdown?: boolean
  children?: { name: string; description: string; href: string }[]
}

export const mainNavigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Store', href: '/store' },
  {
    name: 'Services',
    href: '/services',
    hasDropdown: true,
    children: [
      { name: 'Web Development', description: 'Custom web solutions', href: '/services#web-development' },
      { name: 'Mobile Apps', description: 'iOS & Android applications', href: '/services#mobile-apps' },
      { name: 'UI/UX Design', description: 'User-centered design', href: '/services#ui-ux' },
      { name: 'Branding', description: 'Identity & strategy', href: '/services#branding' },
      { name: 'AI Solutions', description: 'Intelligent automation', href: '/services#ai' },
      { name: 'Cloud Services', description: 'Scalable infrastructure', href: '/services#cloud' },
    ],
  },
  { name: 'Work', href: '/projects' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export const footerNavigation = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Portfolio', href: '/portfolio' },
  ],
  services: [
    { name: 'Web Development', href: '/services#web-development' },
    { name: 'UI/UX Design', href: '/services#ui-ux' },
    { name: 'Digital Marketing', href: '/services#marketing' },
    { name: 'Consulting', href: '/services#consulting' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Industries', href: '/industries' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export const siteConfig = {
  name: 'INFOGRA',
  tagline: 'Digital Experience Architects',
  url: typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : 'https://infogra.tech',
  email: 'infogra174@gmail.com',
  phone: '+20 106 186 6211',
  whatsapp: '201061866211',
  address: 'Alexandria, Egypt',
}
