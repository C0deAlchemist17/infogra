'use client'

import MetaballHero from '@/components/sections/MetaballHero'
import StudioServices from '@/components/sections/StudioServices'
import StudioWork from '@/components/sections/StudioWork'
import Technologies from '@/components/sections/Technologies'
import Statistics from '@/components/sections/Statistics'
import StorePreview from '@/components/sections/StorePreview'
// Testimonials removed per user request
import Process from '@/components/sections/Process'
import WhyInfogra from '@/components/sections/WhyInfogra'
import TrustedBy from '@/components/sections/TrustedBy'
import FAQ from '@/components/sections/FAQ'
import StudioContact from '@/components/sections/StudioContact'
import ContactCTA from '@/components/sections/ContactCTA'

export default function Home() {
  return (
    <>
      <MetaballHero />
      <StudioServices />
      <StudioWork />
      <Technologies />
      <Statistics />
      <StorePreview />
      {/* Testimonials removed per user request */}
      <Process />
      <WhyInfogra />
      <TrustedBy />
      <FAQ />
      <StudioContact />
      <ContactCTA />
    </>
  )
}
