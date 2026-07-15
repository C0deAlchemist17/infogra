import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Browse INFOGRA portfolio of web design, development, and branding projects.',
}

const portfolioItems = [
  { title: 'Alkhunaizan Law Firm', category: 'Web Design', image: '/assets/img/alkunaizan/portfolio-details-1.jpg', href: '/projects/alkhunaizan' },
  { title: 'HAB Constructions', category: 'Corporate', image: '/assets/img/hab en/Screenshot 2025-09-18 190357.png', href: '/projects/hab-constructions' },
  { title: 'Maazen El Haram', category: 'E-commerce', image: '/assets/img/maazen en/Screenshot 2025-10-05 015252.png', href: '/projects/maazen-el-haram' },
  { title: 'Kareem Hafez', category: 'Portfolio', image: '/assets/img/kareem hafez/photo_2023-10-30_01-16-39.jpg', href: '/projects/kareem-hafez' },
  { title: 'Brand Identity - Baker', category: 'Branding', image: '/assets/img/design/random logo/BAKER V1.jpg', href: '/projects' },
  { title: 'UI/UX Planning', category: 'Design', image: '/assets/img/design/UI&UX plan 01 (ps).jpg', href: '/projects' },
]

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-16 px-6 md:px-8">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-accent-primary text-sm tracking-widest uppercase font-semibold mb-4">Creative Work</p>
          <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-6">Portfolio</h1>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            A curated collection of our finest design and development work.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-8">
        <div className="container mx-auto max-w-7xl grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <Link key={item.title} href={item.href} className="group card-premium rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <span className="text-caption text-accent-primary">{item.category}</span>
                <h2 className="text-h4 font-semibold text-text-primary mt-1 group-hover:text-accent-primary transition-colors">
                  {item.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 text-center">
        <Button asChild variant="premium" size="lg">
          <Link href="/projects">
            View All Projects
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
