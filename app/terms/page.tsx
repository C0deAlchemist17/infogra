import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'INFOGRA terms of service and conditions of use.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <section className="relative pt-32 pb-16 px-6 md:px-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-h2-sm md:text-h1-sm font-bold text-text-primary mb-6">Terms of Service</h1>
          <p className="text-small text-text-tertiary mb-12">Last updated: July 2026</p>

          <div className="space-y-8 text-body text-text-secondary">
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Acceptance of Terms</h2>
              <p>By accessing and using the INFOGRA website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Services</h2>
              <p>INFOGRA provides web design, development, digital marketing, and technology products. Service details, timelines, and pricing are agreed upon in individual project contracts.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Store & Products</h2>
              <p>Product prices are displayed in Egyptian Pounds (EGP). Availability and pricing are subject to change. Purchases are processed via WhatsApp inquiry and confirmed individually.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Intellectual Property</h2>
              <p>All content on this website, including designs, code, text, and graphics, is the property of INFOGRA unless otherwise stated. Unauthorized reproduction is prohibited.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Limitation of Liability</h2>
              <p>INFOGRA shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services.</p>
            </section>
            <section>
              <h2 className="text-h4 font-semibold text-text-primary mb-3">Contact</h2>
              <p>Questions about these terms? Contact <a href="mailto:infogra174@gmail.com" className="text-accent-primary hover:underline">infogra174@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
