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
