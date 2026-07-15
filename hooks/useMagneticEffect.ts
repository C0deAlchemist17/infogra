'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface MagneticElement {
  element: HTMLElement
  x: number
  y: number
  width: number
  height: number
}

export const useMagneticEffect = () => {
  const [magneticElements, setMagneticElements] = useState<MagneticElement[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }

    magneticElements.forEach((magneticEl) => {
      const { element, x, y, width, height } = magneticEl
      const centerX = x + width / 2
      const centerY = y + height / 2

      const deltaX = (mouseRef.current.x - centerX) * 0.15
      const deltaY = (mouseRef.current.y - centerY) * 0.15

      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    })
  }, [magneticElements])

  const handleMouseLeave = useCallback(() => {
    magneticElements.forEach((magneticEl) => {
      magneticEl.element.style.transform = 'translate(0px, 0px)'
    })
  }, [magneticElements])

  const setupMagneticElements = useCallback(() => {
    const elements = document.querySelectorAll('.magnetic-element')
    const newMagneticElements: MagneticElement[] = []

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      newMagneticElements.push({
        element: element as HTMLElement,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      })
    })

    setMagneticElements(newMagneticElements)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    setupMagneticElements()

    const resizeObserver = new ResizeObserver(setupMagneticElements)
    magneticElements.forEach((magneticEl) => {
      resizeObserver.observe(magneticEl.element)
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      resizeObserver.disconnect()
    }
  }, [magneticElements, handleMouseMove, handleMouseLeave, setupMagneticElements])

  return { setupMagneticElements }
}
