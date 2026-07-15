'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollTriggerOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

interface UseScrollTriggerReturn {
  elementRef: React.RefObject<HTMLDivElement>
  isVisible: boolean
  hasBeenVisible: boolean
}

export const useScrollTrigger = (options: UseScrollTriggerOptions = {}): UseScrollTriggerReturn => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const hasBeenVisibleRef = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting
        
        if (isElementVisible) {
          setIsVisible(true)
          if (!hasBeenVisibleRef.current) {
            hasBeenVisibleRef.current = true
            setHasBeenVisible(true)
          }
          
          // If triggerOnce is true, disconnect after first visibility
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return {
    elementRef,
    isVisible: triggerOnce ? hasBeenVisible : isVisible,
    hasBeenVisible
  }
}
