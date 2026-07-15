'use client'

import StudioHero from '@/components/sections/StudioHero'
import StudioServices from '@/components/sections/StudioServices'
import StudioWork from '@/components/sections/StudioWork'
import Technologies from '@/components/sections/Technologies'
import Statistics from '@/components/sections/Statistics'
import CaseStudies from '@/components/sections/CaseStudies'
import StorePreview from '@/components/sections/StorePreview'
import Testimonials from '@/components/sections/Testimonials'
import Process from '@/components/sections/Process'
import WhyInfogra from '@/components/sections/WhyInfogra'
import TrustedBy from '@/components/sections/TrustedBy'
import FAQ from '@/components/sections/FAQ'
import StudioContact from '@/components/sections/StudioContact'
import ContactCTA from '@/components/sections/ContactCTA'

export default function Home() {
  return (
    <>
      <StudioHero />
      <StudioServices />
      <StudioWork />
      <Technologies />
      <Statistics />
      <CaseStudies />
      <StorePreview />
      <Testimonials />
      <Process />
      <WhyInfogra />
      <TrustedBy />
      <FAQ />
      <StudioContact />
      <ContactCTA />
    </>
  )
}
