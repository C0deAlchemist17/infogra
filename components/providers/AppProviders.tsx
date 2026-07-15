'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { WishlistProvider } from '@/providers/WishlistProvider'
import { RecentlyViewedProvider } from '@/providers/RecentlyViewedProvider'
import { ComparisonProvider } from '@/providers/ComparisonProvider'
import { AIAssistantProvider } from '@/providers/AIAssistantProvider'

export default function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    document.documentElement.classList.add('lenis', 'lenis-smooth')

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
    }
  }, [])

  return (
    <AIAssistantProvider>
      <ComparisonProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            {children}
          </RecentlyViewedProvider>
        </WishlistProvider>
      </ComparisonProvider>
    </AIAssistantProvider>
  )
}
