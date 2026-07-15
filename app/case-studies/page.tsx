import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Explore INFOGRA case studies showcasing successful digital transformation projects.',
}

const caseStudies = [
  {
    title: 'Alkhunaizan Law Firm',
    category: 'Web Development',
    description: 'Complete digital presence for a leading law firm with bilingual support and modern design.',
    href: '/projects/alkhunaizan',
    metrics: ['300% traffic increase', 'Bilingual platform', 'Mobile-first design'],
  },
  {
    title: 'HAB Constructions',
    category: 'Branding & Web',
    description: 'Brand identity and corporate website for a major construction company.',
    href: '/projects/hab-constructions',
    metrics: ['Full rebrand', 'Lead generation', 'Portfolio showcase'],
  },
  {
    title: 'Maazen El Haram',
    category: 'E-commerce',
    description: 'E-commerce platform with custom product catalog and WhatsApp integration.',
    href: '/projects/maazen-el-haram',
    metrics: ['500+ products', 'WhatsApp orders', 'Arabic RTL support'],
  },
  {
    title: 'Kareem Hafez Portfolio',
    category: 'Portfolio',
    description: 'Creative portfolio website showcasing professional work and achievements.',
    href: '/projects/kareem-hafez',
    metrics: ['Interactive gallery', 'Fast performance', 'SEO optimized'],
  },
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-16 px-6 md:px-8">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-accent-primary text-sm tracking-widest uppercase font-semibold mb-4">Our Work</p>
          <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-6">Case Studies</h1>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Real results from real projects. See how we help businesses transform their digital presence.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-8">
        <div className="container mx-auto max-w-6xl space-y-8">
          {caseStudies.map((study) => (
            <article key={study.title} className="card-premium rounded-2xl p-8 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="text-small text-accent-primary font-semibold">{study.category}</span>
                  <h2 className="text-h3 font-bold text-text-primary mt-2 mb-3">{study.title}</h2>
                  <p className="text-body text-text-secondary mb-4">{study.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {study.metrics.map((metric) => (
                      <span key={metric} className="text-caption px-3 py-1 rounded-full glass text-text-secondary">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href={study.href}>
                    View Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
