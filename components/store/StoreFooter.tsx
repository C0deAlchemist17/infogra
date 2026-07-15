'use client'

import Link from 'next/link'
import { storeFooter } from '@/data/store-navigation'
import { siteConfig } from '@/lib/navigation'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export default function StoreFooter() {
  return (
    <footer className="bg-background-secondary border-t border-border-subtle">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-3xl font-bold gradient-text mb-4 block">INFOGRA</Link>
            <p className="text-body text-text-secondary mb-6 max-w-md">
              Your trusted destination for premium technology products in Egypt. 
              We offer genuine products with warranty and fast delivery.
            </p>
            <div className="space-y-3">
              <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors">
                <Phone className="w-5 h-5" />
                <span>{siteConfig.phone}</span>
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors">
                <Mail className="w-5 h-5" />
                <span>{siteConfig.email}</span>
              </a>
              <div className="flex items-center gap-3 text-text-secondary">
                <MapPin className="w-5 h-5" />
                <span>{siteConfig.address}</span>
              </div>
              <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-accent-success hover:text-accent-success/80 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-h4 font-bold text-text-primary mb-6">Customer Service</h3>
            <ul className="space-y-3">
              {storeFooter.customerService.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-body text-text-secondary hover:text-accent-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-h4 font-bold text-text-primary mb-6">About</h3>
            <ul className="space-y-3">
              {storeFooter.about.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-body text-text-secondary hover:text-accent-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-h4 font-bold text-text-primary mb-6">Payment Methods</h3>
            <ul className="space-y-3">
              {storeFooter.payment.map((item) => (
                <li key={item.name} className="text-body text-text-secondary">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-small text-text-tertiary">
            © {new Date().getFullYear()} INFOGRA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-small text-text-tertiary hover:text-text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-small text-text-tertiary hover:text-text-secondary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
