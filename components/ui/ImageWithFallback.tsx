'use client'

import { useState, ImgHTMLAttributes } from 'react'

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      if (fallbackSrc) {
        setImgSrc(fallbackSrc)
      }
    }
  }

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 ${className}`}
        {...props as any}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-accent-primary/20 flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-xs text-text-tertiary">{alt}</p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  )
}
