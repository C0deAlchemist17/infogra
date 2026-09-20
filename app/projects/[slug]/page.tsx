import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StudioProjectClient from './StudioProjectClient'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

// Project data
const projects = {
  'alkhunaizan': {
    title: 'Alkhunaizan Law Firm',
    category: 'Web Development',
    description: 'Professional legal website with modern design and seamless user experience.',
    image: '/assets/img/alkunaizan/portfolio-details-1.jpg',
    gallery: [
      '/assets/img/alkunaizan/portfolio-details-1.jpg',
      '/assets/img/alkunaizan/portfolio-details-2.jpg',
      '/assets/img/alkunaizan/portfolio-details-3.jpg',
      '/assets/img/alkunaizan/portfolio-details-4.jpg',
      '/assets/img/alkunaizan/portfolio-details-5.jpg'
    ],
    tags: ['React', 'Tailwind', 'Legal'],
    overview: 'A sophisticated legal website designed to showcase the firm\'s expertise and services.',
    challenge: 'Creating a professional yet approachable online presence for a law firm.',
    solution: 'Developed a clean, modern interface with intuitive navigation and comprehensive service information.',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    timeline: '8 weeks',
    team: 4
  },
  'kareem-hafez': {
    title: 'Kareem Hafez Toolshop',
    category: 'E-commerce',
    description: 'E-commerce platform for industrial tools with advanced filtering.',
    image: '/assets/img/kareem hafez/photo_2023-10-30_01-16-39.jpg',
    gallery: [
      '/assets/img/kareem hafez/photo_2023-10-30_01-16-39.jpg',
      '/assets/img/kareem hafez/photo_2023-10-30_01-16-42.jpg',
      '/assets/img/kareem hafez/photo_2023-10-30_01-16-45.jpg',
      '/assets/img/kareem hafez/photo_2023-10-30_01-17-36.jpg',
      '/assets/img/kareem hafez/photo_2023-10-30_01-17-37.jpg'
    ],
    tags: ['Next.js', 'TypeScript', 'E-commerce'],
    overview: 'A comprehensive e-commerce solution for industrial tools and equipment.',
    challenge: 'Building a scalable platform with complex product catalog and filtering.',
    solution: 'Implemented advanced search, filtering, and a streamlined checkout process.',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    timeline: '12 weeks',
    team: 5
  },
  're-ramen': {
    title: 'Re Ramen Restaurant',
    category: 'Food & Beverage',
    description: 'Modern restaurant website with online ordering system.',
    image: '/assets/img/re ramen en/Screenshot 2025-10-05 003904.png',
    gallery: [
      '/assets/img/re ramen en/Screenshot 2025-10-05 003904.png',
      '/assets/img/re ramen en/Screenshot 2025-10-05 003915.png',
      '/assets/img/re ramen en/Screenshot 2025-10-05 003926.png',
      '/assets/img/re ramen en/Screenshot 2025-10-05 003941.png',
      '/assets/img/re ramen en/Screenshot 2025-10-05 003958.png'
    ],
    tags: ['React', 'Node.js', 'Restaurant'],
    overview: 'A vibrant restaurant website with integrated online ordering capabilities.',
    challenge: 'Creating an engaging user experience that drives online orders.',
    solution: 'Designed an intuitive ordering system with real-time menu updates.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    timeline: '6 weeks',
    team: 3
  },
  'maazen-elharam': {
    title: 'Maazen Elharam Real Estate',
    category: 'Real Estate',
    description: 'Real estate platform with property listings and search.',
    image: '/assets/img/maazen en/Screenshot 2025-10-05 015252.png',
    gallery: [
      '/assets/img/maazen en/Screenshot 2025-10-05 015252.png',
      '/assets/img/maazen en/Screenshot 2025-10-05 015303.png',
      '/assets/img/maazen en/Screenshot 2025-10-05 015331.png',
      '/assets/img/maazen en/Screenshot 2025-10-05 015341.png',
      '/assets/img/maazen en/Screenshot 2025-10-05 015354.png'
    ],
    tags: ['Vue.js', 'Laravel', 'Real Estate'],
    overview: 'A comprehensive real estate platform featuring property listings and search.',
    challenge: 'Building a robust property search and filtering system.',
    solution: 'Implemented advanced search with map integration and detailed property views.',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Mapbox'],
    timeline: '10 weeks',
    team: 4
  },
  'hab-constructions': {
    title: 'Hab Constructions',
    category: 'Construction',
    description: 'Construction company showcase with project gallery.',
    image: '/assets/img/hab en/Screenshot 2025-09-18 190357.png',
    gallery: [
      '/assets/img/hab en/Screenshot 2025-09-18 190357.png',
      '/assets/img/hab en/Screenshot 2025-09-18 190455.png',
      '/assets/img/hab en/Screenshot 2025-09-18 190519.png',
      '/assets/img/hab en/Screenshot 2025-09-18 190839.png',
      '/assets/img/hab en/Screenshot 2025-09-18 190855.png'
    ],
    tags: ['WordPress', 'PHP', 'Construction'],
    overview: 'A professional construction company website with project showcase.',
    challenge: 'Creating a visually appealing portfolio for construction projects.',
    solution: 'Designed a clean layout with high-quality image galleries.',
    technologies: ['WordPress', 'PHP', 'MySQL', 'Custom Theme'],
    timeline: '4 weeks',
    team: 2
  },
  'brand-identity': {
    title: 'Brand Identity Design System',
    category: 'Branding',
    description: 'Comprehensive brand identity system with guidelines and design assets.',
    image: '/assets/img/design/UI&UX plan 01 (ps).jpg',
    gallery: [
      '/assets/img/design/UI&UX plan 01 (ps).jpg',
      '/assets/img/design/UI&UX plan 01 (ps) (3).jpg',
      '/assets/img/design/UI&UX plan 01 (ps) (4).jpg',
      '/assets/img/design/cover maazen.jpg',
      '/assets/img/design/photo_2023-10-30_23-04-30.jpg'
    ],
    tags: ['Branding', 'Guidelines', 'Design System'],
    overview: 'A complete brand identity system including logo, colors, typography, and guidelines.',
    challenge: 'Creating a cohesive brand identity that resonates with the target audience.',
    solution: 'Developed a comprehensive design system with detailed guidelines and assets.',
    technologies: ['Adobe Illustrator', 'Figma', 'Adobe Photoshop'],
    timeline: '6 weeks',
    team: 3
  },
  'bakery-brand': {
    title: 'Bakery Brand Identity',
    category: 'Branding',
    description: 'Modern bakery brand with logo and visual identity.',
    image: '/assets/img/design/random logo/BAKER V1.jpg',
    gallery: [
      '/assets/img/design/random logo/BAKER V1.jpg',
      '/assets/img/design/random logo/baker v2.jpg',
      '/assets/img/design/work-4.jpg',
      '/assets/img/design/work-5.jpg',
      '/assets/img/design/work-6.jpg'
    ],
    tags: ['Logo Design', 'Branding', 'Visual Identity'],
    overview: 'A modern bakery brand identity with warm, inviting visual elements.',
    challenge: 'Creating a brand that stands out in a competitive bakery market.',
    solution: 'Designed a unique logo with complementary color palette and typography.',
    technologies: ['Adobe Illustrator', 'Figma'],
    timeline: '3 weeks',
    team: 2
  },
  'pamela-fashion': {
    title: 'Pamela Fashion Brand',
    category: 'Branding',
    description: 'Fashion brand identity with elegant logo design.',
    image: '/assets/img/design/random logo/PAMELA V1.jpg',
    gallery: [
      '/assets/img/design/random logo/PAMELA V1.jpg',
      '/assets/img/design/random logo/PAMELA V2.jpg',
      '/assets/img/design/275204087_5706158896067343_1428840266121100182_n.jpg',
      '/assets/img/design/IMG-20221116-WA0003 copy.jpg',
      '/assets/img/design/IMG_20221021_153909_203.jpg'
    ],
    tags: ['Fashion', 'Logo Design', 'Branding'],
    overview: 'An elegant fashion brand identity designed for luxury positioning.',
    challenge: 'Creating a sophisticated brand that appeals to fashion-conscious consumers.',
    solution: 'Developed a refined logo with timeless design elements.',
    technologies: ['Adobe Illustrator', 'Adobe Photoshop'],
    timeline: '4 weeks',
    team: 2
  },
  'jony-beats': {
    title: 'Jony Beats Music Brand',
    category: 'Branding',
    description: 'Music producer brand with dynamic logo design.',
    image: '/assets/img/design/random logo/jony_beats.jpg',
    gallery: [
      '/assets/img/design/random logo/jony_beats.jpg',
      '/assets/img/design/work-1.jpg',
      '/assets/img/design/work-2.jpg',
      '/assets/img/design/work-3.jpg',
      '/assets/img/design/275204087_5706158896067343_1428840266121100182_n.jpg'
    ],
    tags: ['Music', 'Logo Design', 'Branding'],
    overview: 'A dynamic music producer brand with energetic visual identity.',
    challenge: 'Creating a brand that captures the energy of music production.',
    solution: 'Designed a bold logo with vibrant colors and modern typography.',
    technologies: ['Adobe Illustrator', 'Figma'],
    timeline: '3 weeks',
    team: 2
  },
  'firm-corporate': {
    title: 'Firm Corporate Identity',
    category: 'Branding',
    description: 'Corporate identity for professional services firm.',
    image: '/assets/img/design/random logo/firm v1.jpg',
    gallery: [
      '/assets/img/design/random logo/firm v1.jpg',
      '/assets/img/design/random logo/firm-v2.jpg',
      '/assets/img/design/cover maazen.jpg',
      '/assets/img/design/photo_2023-10-30_23-04-30.jpg',
      '/assets/img/design/IMG_20221021_153909_203.jpg'
    ],
    tags: ['Corporate', 'Logo Design', 'Branding'],
    overview: 'A professional corporate identity for a services firm.',
    challenge: 'Creating a trustworthy and professional brand image.',
    solution: 'Developed a clean, sophisticated logo with strong typography.',
    technologies: ['Adobe Illustrator', 'Figma'],
    timeline: '4 weeks',
    team: 2
  },
  'exit-nightlife': {
    title: 'Exit Nightlife Brand',
    category: 'Branding',
    description: 'Nightlife venue brand with vibrant identity.',
    image: '/assets/img/design/random logo/nexit v1.jpg',
    gallery: [
      '/assets/img/design/random logo/nexit v1.jpg',
      '/assets/img/design/random logo/nexit v2.jpg',
      '/assets/img/design/work-4.jpg',
      '/assets/img/design/work-5.jpg',
      '/assets/img/design/275204087_5706158896067343_1428840266121100182_n.jpg'
    ],
    tags: ['Nightlife', 'Logo Design', 'Branding'],
    overview: 'A vibrant nightlife venue brand with energetic visual identity.',
    challenge: 'Creating a brand that captures the excitement of nightlife.',
    solution: 'Designed a bold logo with neon-inspired colors and modern typography.',
    technologies: ['Adobe Illustrator', 'Adobe Photoshop'],
    timeline: '3 weeks',
    team: 2
  },
  'ys-creative': {
    title: 'YS Creative Studio',
    category: 'Branding',
    description: 'Creative studio brand with modern identity.',
    image: '/assets/img/design/random logo/ys v1.jpg',
    gallery: [
      '/assets/img/design/random logo/ys v1.jpg',
      '/assets/img/design/random logo/ys v2.jpg',
      '/assets/img/design/UI&UX plan 01 (ps).jpg',
      '/assets/img/design/UI&UX plan 01 (ps) (3).jpg',
      '/assets/img/design/cover maazen.jpg'
    ],
    tags: ['Creative', 'Logo Design', 'Branding'],
    overview: 'A modern creative studio brand with innovative visual identity.',
    challenge: 'Creating a brand that reflects creativity and innovation.',
    solution: 'Developed a unique logo with dynamic design elements.',
    technologies: ['Adobe Illustrator', 'Figma'],
    timeline: '4 weeks',
    team: 2
  },
  'zina-beauty': {
    title: 'Zina Beauty Brand',
    category: 'Branding',
    description: 'Beauty brand identity with elegant design.',
    image: '/assets/img/design/random logo/zina v1.jpg',
    gallery: [
      '/assets/img/design/random logo/zina v1.jpg',
      '/assets/img/design/random logo/zina v2.jpg',
      '/assets/img/design/IMG-20221116-WA0003 copy.jpg',
      '/assets/img/design/IMG_20221021_153909_203.jpg',
      '/assets/img/design/photo_2023-10-30_23-04-30.jpg'
    ],
    tags: ['Beauty', 'Logo Design', 'Branding'],
    overview: 'An elegant beauty brand with sophisticated visual identity.',
    challenge: 'Creating a brand that appeals to beauty-conscious consumers.',
    solution: 'Designed a refined logo with feminine design elements.',
    technologies: ['Adobe Illustrator', 'Adobe Photoshop'],
    timeline: '4 weeks',
    team: 2
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects[slug as keyof typeof projects]
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    }
  }

  return {
    title: `${project.title} | Infogra`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.image]
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = projects[slug as keyof typeof projects]
  
  if (!project) {
    notFound()
  }

  return <StudioProjectClient project={project} slug={slug} />
}
