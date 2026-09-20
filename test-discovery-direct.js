// Direct test of Kimo discovery without server
const fetch = require('node-fetch')

async function testKimoDiscovery() {
  console.log('Testing Kimo Store HTML parsing...')

  const response = await fetch('https://kimostore.net/collections/processor', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  })

  if (!response.ok) {
    console.error('Failed to fetch:', response.status)
    return
  }

  const html = await response.text()
  console.log(`HTML length: ${html.length}`)

  // Test regex pattern
  const productLinkRegex = /href="\/products\/([^"]+)"/g
  const matches = Array.from(html.matchAll(productLinkRegex))
  console.log(`Found ${matches.length} product links`)

  const uniqueProducts = new Set()
  for (const match of matches) {
    uniqueProducts.add(match[1])
  }

  console.log(`Unique products: ${uniqueProducts.size}`)
  console.log('Sample products:', Array.from(uniqueProducts).slice(0, 5))
}

testKimoDiscovery().catch(console.error)
