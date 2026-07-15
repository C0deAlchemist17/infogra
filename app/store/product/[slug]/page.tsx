'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight, Star, Shield, Truck, RefreshCw, 
  MessageCircle, ShoppingCart, Heart, Share2, 
  CheckCircle, Package
} from 'lucide-react'
import { products } from '@/data/products'
import ProductCard from '@/components/store/ProductCard'
import { siteConfig } from '@/lib/navigation'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const product = products.find(p => p.slug === slug)

  if (!product) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h2 font-bold text-text-primary mb-4">Product Not Found</h1>
          <p className="text-body text-text-secondary mb-8">The product you are looking for does not exist.</p>
          <Button onClick={() => router.push('/store')}>Back to Store</Button>
        </div>
      </div>
    )
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const generateWhatsAppLink = () => {
    const message = `Hello INFOGRA, I'm interested in:\nProduct: ${product.name}\nPrice: EGP ${product.price.toLocaleString()}\n\nCould you please provide availability and delivery details?`
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${siteConfig.whatsapp}?text=${encodedMessage}`
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Breadcrumb */}
      <div className="bg-background-secondary/50 border-b border-border-subtle">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-small text-text-tertiary flex-wrap">
            <Link href="/store" className="hover:text-accent-primary transition-colors">Store</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/store/category/${product.category}`} className="hover:text-accent-primary transition-colors capitalize">
              {product.category.replace(/-/g, ' ')}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-primary">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square bg-background-secondary rounded-2xl overflow-hidden mb-4">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-24 h-24 text-text-tertiary" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-accent-highlight text-white">New</Badge>}
                {product.discount && <Badge className="bg-accent-success text-white">-{product.discount}%</Badge>}
                {product.isBestSeller && <Badge className="bg-accent-primary text-white">Best Seller</Badge>}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <div key={index} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-border-subtle hover:border-accent-primary transition-colors cursor-pointer">
                    <Image src={img} alt={`${product.name} ${index + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Brand */}
            <div className="text-small text-accent-primary font-semibold mb-2">{product.brand}</div>
            
            {/* Title */}
            <h1 className="text-h2 md:text-h1 font-bold text-text-primary mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-accent-primary fill-accent-primary' : 'text-text-tertiary'}`}
                  />
                ))}
              </div>
              <span className="text-body text-text-secondary">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-h2 font-bold gradient-text">EGP {product.price.toLocaleString()}</div>
              {product.originalPrice && (
                <>
                  <div className="text-h4 text-text-tertiary line-through">EGP {product.originalPrice.toLocaleString()}</div>
                  <Badge className="bg-accent-success text-white">Save {product.discount}%</Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-body text-text-secondary mb-8 leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="w-5 h-5 text-accent-success" />
                  <span className="text-body text-accent-success">In Stock ({product.stock} available)</span>
                </>
              ) : (
                <span className="text-body text-accent-error">Out of Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(generateWhatsAppLink(), '_blank')
                  }
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Request on WhatsApp
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-background-tertiary/50">
                <Shield className="w-6 h-6 text-accent-primary mx-auto mb-2" />
                <span className="text-small text-text-secondary">{product.warranty}</span>
              </div>
              <div className="text-center p-4 rounded-xl bg-background-tertiary/50">
                <Truck className="w-6 h-6 text-accent-primary mx-auto mb-2" />
                <span className="text-small text-text-secondary">Fast Delivery</span>
              </div>
              <div className="text-center p-4 rounded-xl bg-background-tertiary/50">
                <RefreshCw className="w-6 h-6 text-accent-primary mx-auto mb-2" />
                <span className="text-small text-text-secondary">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <Card className="glass border-border-subtle">
              <CardContent className="p-6">
                <h2 className="text-h3 font-bold text-text-primary mb-6">Specifications</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-border-subtle">
                      <span className="text-body text-text-secondary">{key}</span>
                      <span className="text-body font-medium text-text-primary">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="glass border-border-subtle">
              <CardContent className="p-6">
                <h2 className="text-h3 font-bold text-text-primary mb-6">Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-success shrink-0" />
                      <span className="text-body text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-h3 font-bold text-text-primary mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
