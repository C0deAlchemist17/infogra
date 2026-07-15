'use client'

import { useEffect } from 'react'

export const useSmoothScroll = () => {
  useEffect(() => {
    // Simple smooth scroll implementation
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      const href = target.getAttribute('href')
      
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach(link => {
      link.addEventListener('click', handleSmoothScroll)
    })

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll)
      })
    }
  }, [])
}
