'use client'

import { createContext, useContext, useRef, useEffect, useState } from 'react'

interface ScrollContextType {
  scrollProgress: number // 0 to 1
  currentSection: number
  sectionProgress: number // 0 to 1 within current section
  registerSection: (id: string, element: HTMLElement) => void
  unregisterSection: (id: string) => void
}

const ScrollContext = createContext<ScrollContextType>({
  scrollProgress: 0,
  currentSection: 0,
  sectionProgress: 0,
  registerSection: () => {},
  unregisterSection: () => {},
})

export function useScrollController() {
  return useContext(ScrollContext)
}

interface ScrollControllerProps {
  children: React.ReactNode
}

export function ScrollController({ children }: ScrollControllerProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionProgress, setSectionProgress] = useState(0)
  
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map())
  const scrollYRef = useRef(0)
  const maxScrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      maxScrollRef.current = maxScroll

      // Calculate normalized scroll progress (0 to 1)
      const progress = maxScroll > 0 ? Math.min(scrollYRef.current / maxScroll, 1) : 0
      setScrollProgress(progress)

      // Calculate current section based on registered sections
      const sectionEntries = Array.from(sectionsRef.current.entries())
      let newSection = 0
      let newSectionProgress = 0

      for (let i = 0; i < sectionEntries.length; i++) {
        const [id, element] = sectionEntries[i]
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementHeight = rect.height

        if (elementHeight > 0 && scrollYRef.current >= elementTop && scrollYRef.current < elementTop + elementHeight) {
          newSection = i
          newSectionProgress = (scrollYRef.current - elementTop) / elementHeight
          break
        }
      }

      setCurrentSection(newSection)
      setSectionProgress(newSectionProgress)
    }

    // Initial calculation
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const registerSection = (id: string, element: HTMLElement) => {
    sectionsRef.current.set(id, element)
  }

  const unregisterSection = (id: string) => {
    sectionsRef.current.delete(id)
  }

  return (
    <ScrollContext.Provider
      value={{
        scrollProgress,
        currentSection,
        sectionProgress,
        registerSection,
        unregisterSection,
      }}
    >
      {children}
    </ScrollContext.Provider>
  )
}
