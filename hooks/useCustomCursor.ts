'use client'

import { useEffect, useRef, useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

export const useCustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const cursorPositionRef = useRef<MousePosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Smooth cursor following with lerp
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => {
      setIsHovering(false)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Smooth cursor animation using refs to avoid re-renders
  useEffect(() => {
    let animationId: number
    const animateCursor = () => {
      if (cursorRef.current) {
        const newX = lerp(cursorPositionRef.current.x, mousePosition.x, 0.15)
        const newY = lerp(cursorPositionRef.current.y, mousePosition.y, 0.15)
        
        cursorPositionRef.current = { x: newX, y: newY }
        cursorRef.current.style.transform = `translate(${newX}px, ${newY}px) translate(-50%, -50%)`
      }
      animationId = requestAnimationFrame(animateCursor)
    }

    animationId = requestAnimationFrame(animateCursor)
    return () => cancelAnimationFrame(animationId)
  }, [mousePosition])

  const addHoverEffect = () => {
    setIsHovering(true)
    if (cursorRef.current) {
      cursorRef.current.classList.add('hover')
    }
  }

  const removeHoverEffect = () => {
    setIsHovering(false)
    if (cursorRef.current) {
      cursorRef.current.classList.remove('hover')
    }
  }

  const addClickEffect = () => {
    if (cursorRef.current) {
      cursorRef.current.classList.add('click')
      setTimeout(() => {
        if (cursorRef.current) {
          cursorRef.current.classList.remove('click')
        }
      }, 200)
    }
  }

  return {
    cursorRef,
    addHoverEffect,
    removeHoverEffect,
    addClickEffect,
    isHovering
  }
}
