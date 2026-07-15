'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar, Clock, User, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'

const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'), {
  ssr: false,
  loading: () => null
})

const blogPosts = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    excerpt: 'Explore how artificial intelligence is revolutionizing the way we build and interact with websites.',
    author: 'INFOGRA Team',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    featured: true
  },
  {
    id: '2',
    title: 'Building Scalable E-commerce Solutions',
    excerpt: 'Learn the best practices for creating robust and scalable online stores that grow with your business.',
    author: 'INFOGRA Team',
    date: '2024-01-10',
    readTime: '8 min read',
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    featured: true
  },
  {
    id: '3',
    title: 'UI/UX Trends to Watch in 2024',
    excerpt: 'Discover the latest design trends shaping user experiences across digital platforms.',
    author: 'INFOGRA Team',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    featured: false
  },
  {
    id: '4',
    title: 'Optimizing Performance for Mobile',
    excerpt: 'Essential techniques for delivering lightning-fast experiences on mobile devices.',
    author: 'INFOGRA Team',
    date: '2024-01-01',
    readTime: '7 min read',
    category: 'Performance',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    featured: false
  },
  {
    id: '5',
    title: 'The Power of Three.js in Web Design',
    excerpt: 'How 3D graphics are transforming web experiences and creating immersive interfaces.',
    author: 'INFOGRA Team',
    date: '2023-12-28',
    readTime: '10 min read',
    category: '3D Graphics',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    featured: false
  },
  {
    id: '6',
    title: 'Security Best Practices for Modern Apps',
    excerpt: 'Protect your applications with the latest security measures and best practices.',
    author: 'INFOGRA Team',
    date: '2023-12-20',
    readTime: '9 min read',
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    featured: false
  }
]

export default function BlogPage() {
  const { elementRef, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })
  
  const { addHoverEffect, removeHoverEffect } = useCustomCursor()

  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section with Three.js */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ThreeScene />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary/70 via-background-primary/90 to-background-primary" />

        <div className="container mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-24"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-border-subtle mb-12"
            >
              <Sparkles className="w-5 h-5 text-accent-highlight" />
              <span className="text-small text-text-secondary">Our Blog</span>
            </motion.div>
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-display-xs md:text-display lg:text-display-xl font-bold text-text-primary mb-12"
            >
              <span className="gradient-text">Insights & Updates</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-body-lg md:text-h4 lg:text-h3 text-text-secondary max-w-3xl mx-auto leading-relaxed"
            >
              Stay updated with the latest technology trends, development insights, and industry news from our team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 bg-background-secondary/50">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h2 className="text-h2 font-bold text-text-primary mb-6">Featured Articles</h2>
            <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
              Handpicked content from our latest publications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                onMouseEnter={addHoverEffect}
                onMouseLeave={removeHoverEffect}
              >
                <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow group h-full overflow-hidden">
                  <div className="relative aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary overflow-hidden">
                    <div className="absolute inset-0 bg-accent-primary/20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">📝</span>
                    </div>
                    <Badge className="absolute top-4 left-4 bg-accent-primary text-white border-none">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4 text-small text-text-tertiary">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-h3 font-semibold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-body text-text-secondary mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="glass border-border-subtle">
                        {post.category}
                      </Badge>
                      <Button variant="outline" size="sm" className="group glass border-border-subtle">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            ref={elementRef}
            initial={{ opacity: 0 }}
            animate={hasBeenVisible ? { opacity: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-h2 font-bold text-text-primary mb-12 text-center">Recent Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 60 }}
                  animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.05, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow group h-full">
                    <div className="relative aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary overflow-hidden">
                      <div className="absolute inset-0 bg-accent-primary/10 group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl">📝</span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-caption text-text-tertiary">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <h3 className="text-h4 font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-small text-text-tertiary mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-caption glass border-border-subtle">
                          {post.category}
                        </Badge>
                        <span className="text-caption text-text-tertiary">{post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-background-secondary/50">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          >
            <Card className="bg-gradient-primary border-none text-white overflow-hidden shadow-glow">
              <CardContent className="p-16 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <h2 className="text-h2-sm md:text-h2 lg:text-h1 font-bold mb-8">Subscribe to Our Newsletter</h2>
                  <p className="text-body-lg md:text-h4 lg:text-h3 mb-12 opacity-90 leading-relaxed">
                    Get the latest articles, insights, and updates delivered directly to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                    />
                    <Button size="xl" className="bg-white text-accent-primary hover:bg-background-tertiary">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
