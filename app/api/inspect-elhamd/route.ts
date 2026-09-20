// Inspection API to understand Elhamd Store's HTML structure
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://elhamdstore.com/shop/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const html = await response.text()
    
    // Analyze the HTML structure
    const analysis = {
      length: html.length,
      hasNavigation: html.includes('nav') || html.includes('menu'),
      hasProducts: html.includes('product') || html.includes('item'),
      hasCategories: html.includes('category') || html.includes('collection'),
      sampleClasses: extractClasses(html),
      productLinks: extractProductLinks(html),
      categoryLinks: extractCategoryLinks(html)
    }

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}

function extractClasses(html: string): string[] {
  const classRegex = /class="([^"]+)"/g
  const classes = new Set<string>()
  let match
  
  while ((match = classRegex.exec(html)) !== null) {
    match[1].split(/\s+/).forEach(c => classes.add(c))
  }
  
  return Array.from(classes).filter(c => 
    c.includes('product') || 
    c.includes('item') || 
    c.includes('card') ||
    c.includes('category') ||
    c.includes('menu') ||
    c.includes('nav')
  ).slice(0, 50)
}

function extractProductLinks(html: string): string[] {
  const linkRegex = /<a[^>]*href="([^"]*product[^"]*)"[^>]*>/gi
  const links: string[] = []
  let match
  
  while ((match = linkRegex.exec(html)) !== null && links.length < 10) {
    links.push(match[1])
  }
  
  return links
}

function extractCategoryLinks(html: string): string[] {
  const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi
  const links: Array<{ url: string; text: string }> = []
  let match
  
  while ((match = linkRegex.exec(html)) !== null && links.length < 20) {
    const text = match[2].trim()
    if (text.length > 2 && text.length < 30 && !text.includes('Login') && !text.includes('Cart')) {
      links.push({ url: match[1], text })
    }
  }
  
  return links.slice(0, 10) as any
}