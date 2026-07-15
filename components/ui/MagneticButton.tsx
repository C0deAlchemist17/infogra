'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Button } from './button'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'premium' | 'outline' | 'ghost' | 'link' | 'glass'
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon'
  magnetic?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const MagneticButton = ({ 
  children, 
  className = '', 
  onClick,
  href,
  variant = 'default',
  size = 'default',
  magnetic = true,
  disabled = false,
  type = 'button',
  onMouseEnter,
  onMouseLeave
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const button = buttonRef.current
    if (!button || !magnetic) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * 0.4 // Increased magnetic effect
      const deltaY = (e.clientY - centerY) * 0.4

      button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)` // Added scale effect
      mouseRef.current = { x: deltaX, y: deltaY }
    }

    const handleMouseLeave = () => {
      button.style.transform = 'translate(0px, 0px) scale(1)' // Reset scale
      mouseRef.current = { x: 0, y: 0 }
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [magnetic])

  const handleClick = () => {
    if (onClick) {
      // Add a subtle animation on click
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'scale(0.95)'
        setTimeout(() => {
          if (buttonRef.current) {
            buttonRef.current.style.transform = 'translate(0px, 0px)'
          }
        }, 150)
      }
      onClick()
    }
  }

  return (
    <motion.div
      className={`magnetic-element inline-block ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Button
        ref={buttonRef}
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`transition-transform duration-300 ease-out ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled}
        type={type}
      >
        {children}
      </Button>
    </motion.div>
  )
}

export default MagneticButton
