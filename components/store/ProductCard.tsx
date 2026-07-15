'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Heart, Share2, MessageCircle, Star, ShoppingCart } from 'lucide-react'
import { Product } from '@/types/store'
import Image from 'next/image'

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background-tertiary to-background-secondary">
        <div className="w-32 h-32 bg-accent-primary/20 rounded-3xl flex items-center justify-center">
          <ShoppingCart className="w-16 h-16 text-accent-primary" />
        </div>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setHasError(true)}
    />
  )
}

interface ProductCardProps {
  product: Product
  index: number
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

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
    >
      <Card className="group overflow-hidden border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow">
        <div className="relative aspect-square bg-gradient-to-br from-background-tertiary to-background-secondary overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-32 h-32 bg-accent-primary/20 rounded-3xl flex items-center justify-center"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ duration: 0.4 }}
              >
                <ShoppingCart className="w-16 h-16 text-accent-primary" />
              </motion.div>
            </div>
          )}

          {/* Badges */}
          <motion.div 
            className="absolute top-4 left-4 flex flex-col gap-2 z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {product.isNew && (
              <Badge className="bg-accent-highlight text-white border-none">New</Badge>
            )}
            {product.discount && (
              <Badge className="bg-accent-success text-white border-none">-{product.discount}%</Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-accent-primary text-white border-none">Best Seller</Badge>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="absolute top-4 right-4 flex flex-col gap-2 z-10"
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button 
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button 
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-5 h-5 text-white" />
            </motion.button>
          </motion.div>

          {/* Stock Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <Badge variant={product.stock > 0 ? 'secondary' : 'accent'} className="glass">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Brand */}
          <div className="text-small text-text-tertiary mb-2">{product.brand}</div>
          
          {/* Title */}
          <h3 className="text-h4 font-semibold text-text-primary mb-3 line-clamp-2 group-hover:text-accent-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-accent-primary fill-accent-primary'
                      : 'text-text-tertiary'
                  }`}
                />
              ))}
            </div>
            <span className="text-small text-text-tertiary">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <div className="text-h3 font-bold gradient-text">EGP {product.price.toLocaleString()}</div>
            {product.originalPrice && (
              <div className="text-body text-text-tertiary line-through">
                EGP {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          {/* WhatsApp CTA */}
          <Button
            variant="outline"
            size="sm"
            className="w-full group"
            onClick={() => window.open(generateWhatsAppLink(), '_blank')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Request on WhatsApp
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProductCard
