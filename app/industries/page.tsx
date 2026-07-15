import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Industries',
  description: 'INFOGRA serves diverse industries with tailored digital solutions.',
}

const industries = [
  { name: 'Legal & Professional Services', description: 'Bilingual websites, client portals, and brand identity for law firms and consultancies.', icon: '⚖️' },
  { name: 'Construction & Real Estate', description: 'Project showcases, lead generation platforms, and corporate branding.', icon: '🏗️' },
  { name: 'E-commerce & Retail', description: 'Online stores, product catalogs, WhatsApp integration, and payment solutions.', icon: '🛒' },
  { name: 'Technology & IT', description: 'SaaS platforms, tech marketplaces, and developer-focused products.', icon: '💻' },
  { name: 'Healthcare', description: 'Patient portals, appointment systems, and HIPAA-conscious design.', icon: '🏥' },
  { name: 'Education', description: 'Learning management systems, course platforms, and educational content.', icon: '📚' },
  { name: 'Creative & Media', description: 'Portfolio websites, content platforms, and visual storytelling.', icon: '🎨' },
  { name: 'Finance & Fintech', description: 'Secure dashboards, financial tools, and compliance-ready interfaces.', icon: '💰' },
]

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-16 px-6 md:px-8">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-accent-primary text-sm tracking-widest uppercase font-semibold mb-4">Sectors We Serve</p>
          <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-6">Industries</h1>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Tailored digital solutions for every industry, built with deep sector expertise.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-8">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-8">
          {industries.map((industry) => (
            <article key={industry.name} className="card-premium rounded-2xl p-8">
              <span className="text-3xl mb-4 block">{industry.icon}</span>
              <h2 className="text-h4 font-bold text-text-primary mb-3">{industry.name}</h2>
              <p className="text-body text-text-secondary">{industry.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
