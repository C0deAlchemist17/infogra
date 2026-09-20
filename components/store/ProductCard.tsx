'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Heart, Share2, MessageCircle, Star, ShoppingCart, TrendingUp, Shield } from 'lucide-react'
import { Product } from '@/types/store'
import Image from 'next/image'

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background-tertiary to-background-secondary">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 bg-accent-primary/20 rounded-3xl flex items-center justify-center">
          <ShoppingCart className="w-16 h-16 text-accent-primary" />
        </motion.div>
      </div>
    )
  }

  // Always use regular img tag for external images to avoid optimization errors
  if (src && typeof src === 'string' && src.startsWith('http')) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    )
  }

  // Use Next.js Image for local images only
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setHasError(true)}
      unoptimized
      loading="lazy"
    />
  )
}

interface ProductCardProps {
  product: Product
  index: number
  onProductClick?: (product: Product) => void
}

const ProductCard = ({ product, index, onProductClick }: ProductCardProps) => {
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product)
    } else {
      // Default behavior - navigate to product detail
      window.location.href = `/store/product/${product.slug}`
    }
  }

  const generateWhatsAppLink = () => {
    const message = `Hello INFOGRA, I'm interested in:
Product: ${product.name}
SKU: ${product.sku || product.id}
Price: EGP ${product.price.toLocaleString()}
${product.originalPrice ? `Original Price: EGP ${product.originalPrice.toLocaleString()}` : ''}
${product.discount ? `Discount: ${product.discount}%` : ''}

Could you please provide:
- Availability
- Complete specifications
- Warranty details (${product.warranty})
- Delivery options

Thank you!`
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/201061866211?text=${encodedMessage}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
      onMouseEnter={addHoverEffect}
      onMouseLeave={removeHoverEffect}
      onClick={handleCardClick}
    >
      <Card className="group overflow-hidden border-border-subtle hover:border-accent-primary/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-lg bg-gradient-to-b from-background-primary to-background-secondary/30 cursor-pointer relative">
        <div className="relative aspect-square bg-gradient-to-br from-background-tertiary to-background-secondary overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 bg-accent-primary/20 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.4 }}
              >
                <ShoppingCart className="w-8 h-8 text-accent-primary" />
              </motion.div>
            </div>
          )}

          {/* Badges */}
          <motion.div
            className="absolute top-2 left-2 flex flex-col gap-1 z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {product.isNew && (
              <Badge className="bg-accent-highlight text-white border-none shadow-lg text-body-lg">New</Badge>
            )}
            {product.discount && (
              <Badge className="bg-accent-success text-white border-none shadow-lg text-body-lg">-{product.discount}%</Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-accent-primary text-white border-none shadow-lg flex items-center gap-1 text-body-lg">
                <TrendingUp className="w-5 h-5" />
                Best Seller
              </Badge>
            )}
          </motion.div>

          {/* Quick Actions - Enhanced with tooltips */}
          <motion.div
            className="absolute top-2 right-2 flex flex-col gap-1 z-10"
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-accent-primary/30 hover:border-accent-primary/50 transition-all duration-300 border border-white/20 group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Add to wishlist"
            >
              <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-caption-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Wishlist</span>
            </motion.button>
            <motion.button
              className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-accent-primary/30 hover:border-accent-primary/50 transition-all duration-300 border border-white/20 group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Share product"
            >
              <Share2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-caption-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Share</span>
            </motion.button>
            <motion.button
              className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-accent-primary/30 hover:border-accent-primary/50 transition-all duration-300 border border-white/20 group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Quick view"
            >
              <Eye className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-caption-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Quick View</span>
            </motion.button>
          </motion.div>

          {/* Stock Badge */}
          <div className="absolute bottom-2 left-2 z-10">
            <Badge variant={product.stock > 0 ? 'secondary' : 'accent'} className="glass border border-white/20 shadow-lg text-body-lg">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Brand */}
          <div className="text-body-lg text-text-tertiary mb-1 font-medium">{product.brand}</div>

          {/* Title */}
          <h3 className="text-h3 font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(product.rating)
                      ? 'text-accent-primary fill-accent-primary'
                      : 'text-text-tertiary'
                  }`}
                />
              ))}
            </div>
            <span className="text-body-lg text-text-tertiary">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <div className="text-display font-bold gradient-text">EGP {product.price.toLocaleString()}</div>
            {product.originalPrice && (
              <div className="text-h3 text-text-tertiary line-through">
                EGP {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          {/* Warranty Badge */}
          {product.warranty && (
            <div className="flex items-center gap-1 mb-2 text-body-lg text-text-secondary">
              <Shield className="w-6 h-6 text-accent-primary" />
              <span>{product.warranty}</span>
            </div>
          )}

          {/* WhatsApp CTA - Enhanced */}
          <Button
            variant="outline"
            size="lg"
            className="w-full group hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-300 hover:shadow-glow text-body-lg"
            onClick={() => window.open(generateWhatsAppLink(), '_blank')}
          >
            <MessageCircle className="w-6 h-6 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            Request
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProductCard
