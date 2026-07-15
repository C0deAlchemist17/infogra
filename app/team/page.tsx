import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the talented team behind INFOGRA digital experiences.',
}

const team = [
  { name: 'Fayez', role: 'Founder & Lead Developer', bio: 'Full-stack architect specializing in Next.js, React, and Three.js experiences.', image: '/assets/img/MY LOGO 002.png' },
  { name: 'Design Lead', role: 'Creative Director', bio: 'Crafting premium UI/UX with a focus on brand identity and user experience.', image: '/assets/img/new logo latest.png' },
  { name: 'Dev Team', role: 'Engineering', bio: 'Building scalable, performant applications with modern web technologies.', image: '/assets/img/5451.png' },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-16 px-6 md:px-8">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-accent-primary text-sm tracking-widest uppercase font-semibold mb-4">The People</p>
          <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-6">Our Team</h1>
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
            Passionate creators, developers, and designers united by a shared vision of digital excellence.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-8">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-3 gap-8">
          {team.map((member) => (
            <article key={member.name} className="card-premium rounded-2xl overflow-hidden text-center">
              <div className="relative aspect-square bg-background-tertiary">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-contain p-8"
                  sizes="300px"
                />
              </div>
              <div className="p-6">
                <h2 className="text-h4 font-bold text-text-primary">{member.name}</h2>
                <p className="text-small text-accent-primary mb-3">{member.role}</p>
                <p className="text-body-sm text-text-secondary">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
