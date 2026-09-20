'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Category {
  name: string
  slug: string
  subcategories: Category[]
}

export default function StoreNavigation() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories: Category[] = [
    {
      name: 'COMPUTER',
      slug: 'computer',
      subcategories: [
        { name: 'PC Components', slug: 'pc-components', subcategories: [] },
        { name: 'Personal Computers', slug: 'personal-computer', subcategories: [] },
        { name: 'PC Cables', slug: 'pc-cables', subcategories: [] },
        { name: 'Sound Systems', slug: 'audio-systems', subcategories: [] },
        { name: 'Printer & Scanner', slug: 'printers-scanner', subcategories: [] },
        { name: 'Conferencing System', slug: 'conferencing-system', subcategories: [] },
        { name: 'Data Show', slug: 'data-show', subcategories: [] },
        { name: 'Data Storage', slug: 'data-storage', subcategories: [] },
        { name: 'Graphic Tablet', slug: 'graphic-tablet', subcategories: [] },
        { name: 'Interactive Whiteboard', slug: 'interactive-whiteboard', subcategories: [] },
        { name: 'UPS', slug: 'uninterruptible-power-supply', subcategories: [] },
        { name: 'Software', slug: 'software', subcategories: [] },
        { name: 'Computer Accessories', slug: 'computer-accessories', subcategories: [] },
        { name: 'Computer Solutions', slug: 'computer-solutions', subcategories: [] }
      ]
    },
    {
      name: 'LAPTOP',
      slug: 'laptop',
      subcategories: [
        { name: 'Laptops', slug: 'laptops', subcategories: [] },
        { name: 'Laptop Accessories', slug: 'laptop-accessories', subcategories: [] },
        { name: 'Laptop Spare Parts', slug: 'laptop-replacement-parts', subcategories: [] },
        { name: 'Bags', slug: 'bags', subcategories: [] }
      ]
    },
    {
      name: 'MOBILE & TABLET',
      slug: 'phones-tablets',
      subcategories: [
        { name: 'Mobile Phones', slug: 'mobile-phone', subcategories: [] },
        { name: 'Tablets', slug: 'tablets', subcategories: [] },
        { name: 'Earphone & Headphone', slug: 'earphone-headphone', subcategories: [] },
        { name: 'Smart Watches & Bands', slug: 'smart-watches-bands', subcategories: [] },
        { name: 'Watch Accessories', slug: 'watch-accessories', subcategories: [] },
        { name: 'Cameras', slug: 'camera', subcategories: [] },
        { name: 'Camera Accessories', slug: 'camera-accessories', subcategories: [] },
        { name: 'VR', slug: 'virtual-reality-vr', subcategories: [] },
        { name: 'Digital Watch', slug: 'digital-watch', subcategories: [] },
        { name: 'Screen Protectors', slug: 'phone-screen-protector', subcategories: [] },
        { name: 'Mobile Accessories', slug: 'accessories', subcategories: [] }
      ]
    },
    {
      name: 'HOME APPLIANCES',
      slug: 'home-appliances',
      subcategories: [
        { name: 'Electric Appliances', slug: 'electric-appliances', subcategories: [] },
        { name: 'Kitchen Appliances', slug: 'kitchen-appliances', subcategories: [] },
        { name: 'TV & Accessories', slug: 'tv-accessories', subcategories: [] },
        { name: 'Video Games', slug: 'video-games', subcategories: [] },
        { name: 'Telephones', slug: 'telephones', subcategories: [] },
        { name: 'Water Filters', slug: 'water-filters', subcategories: [] },
        { name: 'Household Supplies', slug: 'household-supplies', subcategories: [] },
        { name: 'Tools & Home Improvement', slug: 'tools-home-improvement', subcategories: [] },
        { name: 'Smart Home', slug: 'smart-home', subcategories: [] },
        { name: 'Scooters', slug: 'scooters', subcategories: [] }
      ]
    },
    {
      name: 'CASHIER SYSTEMS',
      slug: 'cashier-system',
      subcategories: [
        { name: 'Cash Drawer', slug: 'cash-drawer', subcategories: [] },
        { name: 'Receipt Printer', slug: 'receipt-printer', subcategories: [] },
        { name: 'Barcode Reader', slug: 'barcode-reader', subcategories: [] },
        { name: 'Barcode Printer', slug: 'barcode-printer', subcategories: [] },
        { name: 'Cashier Monitor', slug: 'monitor-cashier', subcategories: [] },
        { name: 'Money Counter', slug: 'money-counter', subcategories: [] },
        { name: 'Paper Rolls & Stickers', slug: 'roll-sticker', subcategories: [] },
        { name: 'Printer Adapter', slug: 'printer-adapter', subcategories: [] }
      ]
    },
    {
      name: 'NETWORK',
      slug: 'network',
      subcategories: [
        { name: 'Router', slug: 'router', subcategories: [] },
        { name: 'Access Point', slug: 'access-point', subcategories: [] },
        { name: 'Power Line', slug: 'power-line', subcategories: [] },
        { name: 'Range Extender', slug: 'range-extender', subcategories: [] },
        { name: 'Switch', slug: 'switch', subcategories: [] },
        { name: 'Patch Panel', slug: 'patch-panel', subcategories: [] },
        { name: 'LAN Card', slug: 'lan-card', subcategories: [] },
        { name: 'Smart Plug', slug: 'smart-plug', subcategories: [] },
        { name: 'Door Bell', slug: 'door-bell', subcategories: [] },
        { name: 'Intercom', slug: 'intercom', subcategories: [] },
        { name: 'Emergency Control', slug: 'wireless-control-panel', subcategories: [] },
        { name: 'Time Attendance', slug: 'attendance-and-leave-device', subcategories: [] },
        { name: 'Label Printer', slug: 'label-printer', subcategories: [] },
        { name: 'Cables', slug: 'cables', subcategories: [] },
        { name: 'Network Rack', slug: 'network-rack-rack-accessories', subcategories: [] },
        { name: 'Network Accessories', slug: 'network-accessories', subcategories: [] }
      ]
    },
    {
      name: 'SECURITY SYSTEMS',
      slug: 'security-surveillance',
      subcategories: [
        { name: 'Surveillance Cameras', slug: 'surveillance-cameras', subcategories: [] },
        { name: 'DVR', slug: 'dvr', subcategories: [] },
        { name: 'NVR', slug: 'nvr', subcategories: [] },
        { name: 'Security Accessories', slug: 'security-surveillance-accessories', subcategories: [] }
      ]
    },
    {
      name: 'PERSONAL CARE',
      slug: 'personal-care',
      subcategories: [
        { name: "Women's", slug: 'womens', subcategories: [] },
        { name: "Men's", slug: 'mens', subcategories: [] },
        { name: 'Body Fat Monitors', slug: 'body-weight-scales', subcategories: [] },
        { name: 'Massage Gun', slug: 'massage-gun', subcategories: [] },
        { name: 'Toothbrushes', slug: 'toothbrushes', subcategories: [] }
      ]
    },
    {
      name: 'USED',
      slug: 'used',
      subcategories: [
        { name: 'Used Computers', slug: 'computer-used', subcategories: [] },
        { name: 'Used PC Bundle', slug: 'used-ready-pc-bundle', subcategories: [] },
        { name: 'Used Laptops', slug: 'laptop-used', subcategories: [] },
        { name: 'Used Monitors', slug: 'monitor-used', subcategories: [] },
        { name: 'Used Processors', slug: 'processor-used', subcategories: [] },
        { name: 'Used Hard Disk', slug: 'hard-disk-used', subcategories: [] },
        { name: 'Used RAM', slug: 'ram-used', subcategories: [] },
        { name: 'Used Printer', slug: 'printer-used', subcategories: [] },
        { name: 'Used Projector', slug: 'projector-used', subcategories: [] },
        { name: 'Used Motherboard', slug: 'motherboard-used', subcategories: [] },
        { name: 'Used Graphics Card', slug: 'graphics-card-used', subcategories: [] },
        { name: 'Used Cashier System', slug: 'used-cashier-system', subcategories: [] },
        { name: 'Used Docking Station', slug: 'used-docking-station', subcategories: [] },
        { name: 'Used Accessories', slug: 'used-accessories', subcategories: [] }
      ]
    },
    {
      name: 'Hot Deals',
      slug: 'hot-deals',
      subcategories: []
    }
  ]

  const footerLinks = [
    { name: 'Track Order', href: '/contact' },
    { name: 'Returns', href: '/contact' },
    { name: 'Warranty', href: '/contact' }
  ]

  const toggleCategory = (name: string) => {
    setOpenCategory(openCategory === name ? null : name)
  }

  const handleCategoryClick = (slug: string) => {
    // Emit event for parent to handle filtering
    const event = new CustomEvent('category-filter', { detail: { category: slug } })
    window.dispatchEvent(event)
  }

  return (
    <nav className="bg-background-secondary border border-gray-700 rounded-lg p-4">
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.name}>
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-white hover:bg-background-primary rounded-lg transition-colors"
            >
              <span className="font-semibold">{category.name}</span>
              {category.subcategories.length > 0 && (
                <ChevronDown className={`w-4 h-4 transition-transform ${openCategory === category.name ? 'rotate-180' : ''}`} />
              )}
            </button>
            
            {openCategory === category.name && category.subcategories.length > 0 && (
              <div className="ml-4 mt-2 space-y-1">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.slug}
                    onClick={() => handleCategoryClick(subcategory.slug)}
                    className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-background-primary rounded-lg transition-colors"
                  >
                    <ChevronRight className="inline w-3 h-3 mr-2" />
                    {subcategory.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}