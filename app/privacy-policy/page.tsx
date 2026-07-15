import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'INFOGRA privacy policy - how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-16 px-6 md:px-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-6">Privacy Policy</h1>
          <p className="text-small text-text-tertiary mb-12">Last updated: July 2026</p>

          <div className="prose prose-invert max-w-none space-y-8 text-body text-text-secondary">
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Information We Collect</h2>
              <p>We collect information you provide directly, such as name, email, and message content when you contact us or subscribe to our newsletter. We also collect usage data through analytics to improve our services.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">How We Use Your Information</h2>
              <p>Your information is used to respond to inquiries, provide services, send updates you&apos;ve opted into, and improve our website experience. We do not sell your personal data to third parties.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Cookies</h2>
              <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Contact Us</h2>
              <p>For privacy-related questions, contact us at <a href="mailto:infogra174@gmail.com" className="text-accent-primary hover:underline">infogra174@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
