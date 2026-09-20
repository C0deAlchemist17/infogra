import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import dynamic from 'next/dynamic'
import StudioHeader from '@/components/layout/StudioHeader'
import StudioFooter from '@/components/layout/StudioFooter'
import AppProviders from '@/components/providers/AppProviders'
import GlobalErrorBoundary from '@/components/providers/GlobalErrorBoundary'
import { LanguageProvider } from '@/providers/LanguageProvider'
import LoadingScreen from '@/components/loading/LoadingScreen'
import { siteConfig } from '@/lib/navigation'

const AssistantWidget = dynamic(() => import('@/components/ai/AssistantWidget'))

const GlobalThreeScene = dynamic(() => import('@/components/three/BackgroundWrapper'), {
  ssr: false,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Infogra - Digital Experience Architects | Premium Web Design & Development',
    template: '%s | Infogra',
  },
  description: 'Infogra architects premium digital experiences where innovative design meets powerful development. We craft strategic web solutions, e-commerce platforms, and brand identities that drive business growth.',
  keywords: ['web design', 'web development', 'graphic design', 'digital marketing', 'UI/UX design', 'brand identity', 'e-commerce', 'Next.js development', 'React development', 'Three.js 3D', 'Egypt'],
  authors: [{ name: 'Infogra', url: siteConfig.url }],
  creator: 'Infogra',
  publisher: 'Infogra',
  robots: { index: true, follow: true },
  icons: {
    icon: '/assets/img/favicon.png',
    shortcut: '/assets/img/favicon.png',
    apple: '/assets/img/favicon.png',
  },
  openGraph: {
    title: 'Infogra - Digital Experience Architects',
    description: 'We architect digital experiences where innovative design meets powerful development.',
    url: siteConfig.url,
    siteName: 'Infogra',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Infogra' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infogra - Digital Experience Architects',
    description: 'We architect digital experiences where innovative design meets powerful development.',
    images: ['/og-image.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'INFOGRA',
  url: siteConfig.url,
  logo: `${siteConfig.url}/assets/img/MY LOGO 002.png`,
  description: 'Digital Experience Architects - Premium Web Design & Development',
  address: { '@type': 'PostalAddress', addressLocality: 'Alexandria', addressCountry: 'EG' },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteConfig.phone,
    email: siteConfig.email,
    contactType: 'customer service',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans antialiased bg-[#0a0a1a] text-white relative`} style={{ minHeight: '100vh', fontFamily: 'var(--font-arabic), var(--font-inter), system-ui, sans-serif' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Loading Screen disabled - causing grey flashing issue */}
        {/* <LoadingScreen /> */}

        {/* Global 3D Background - Optimized for performance */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <Suspense fallback={null}>
            <GlobalThreeScene />
          </Suspense>
        </div>
        
        <div className="min-h-screen flex flex-col relative z-10">
          <LanguageProvider>
            <StudioHeader />
            <main className="flex-grow">
              <GlobalErrorBoundary>
                <AppProviders>
                  {children}
                  <AssistantWidget />
                </AppProviders>
              </GlobalErrorBoundary>
            </main>
            <StudioFooter />
          </LanguageProvider>
        </div>
      </body>
    </html>
  )
}