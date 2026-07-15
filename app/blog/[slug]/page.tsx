'use client'

import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/useScrollTrigger'
import { useCustomCursor } from '@/hooks/useCustomCursor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar, Clock, User, Share2, Heart, MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { use } from 'react'

const blogPosts = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    excerpt: 'Explore how artificial intelligence is revolutionizing the way we build and interact with websites.',
    content: `Artificial Intelligence is transforming the landscape of web development in unprecedented ways. From automated code generation to intelligent user interfaces, AI is reshaping how we create digital experiences.

One of the most significant impacts is in the area of code assistance. AI-powered tools can now generate code snippets, suggest optimizations, and even debug complex issues. This doesn't replace developers but rather augments their capabilities, allowing them to focus on higher-level architectural decisions.

Another area where AI shines is in personalization. Machine learning algorithms can analyze user behavior and adapt interfaces in real-time, creating truly personalized experiences that were previously impossible to achieve at scale.

The future of web development will likely see deeper integration of AI technologies. We can expect more sophisticated chatbots, predictive interfaces, and automated testing systems that continuously improve application quality.`,
    author: 'INFOGRA Team',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    featured: true
  }
]

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const post = blogPosts.find(p => p.id === slug)
  
  if (!post) {
    notFound()
  }

  const { addHoverEffect, removeHoverEffect } = useCustomCursor()
  const { elementRef, hasBeenVisible } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true
  })

  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <div className="border-b border-border-subtle py-4">
        <div className="container mx-auto px-8">
          <div className="flex items-center gap-2 text-small text-text-tertiary">
            <a href="/blog" className="hover:text-accent-primary transition-colors">Blog</a>
            <span>/</span>
            <span className="text-text-primary">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="bg-accent-primary text-white border-none mb-6">
              {post.category}
            </Badge>
            <h1 className="text-h2-sm md:text-h2 lg:text-h1 font-bold text-text-primary mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-small text-text-tertiary mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="glass border-border-subtle" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm" className="glass border-border-subtle" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="glass border-border-subtle" onMouseEnter={addHoverEffect} onMouseLeave={removeHoverEffect}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-background-secondary/50">
        <div className="container mx-auto px-8">
          <motion.div
            ref={elementRef}
            initial={{ opacity: 0 }}
            animate={hasBeenVisible ? { opacity: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass border-border-subtle shadow-glow">
              <CardContent className="p-12">
                <div className="prose prose-lg max-w-none">
                  {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-body text-text-secondary leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={hasBeenVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex justify-between items-center mb-12"
            >
              <h2 className="text-h2 font-bold text-text-primary">Related Articles</h2>
              <Button variant="outline" className="group glass border-border-subtle">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  <Card className="glass border-border-subtle hover:border-accent-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-caption text-text-tertiary">
                        <Calendar className="w-3 h-3" />
                        {new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <h3 className="text-h4 font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-small text-text-tertiary mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <Button variant="outline" size="sm" className="w-full glass border-border-subtle">
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
