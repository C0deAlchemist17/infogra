// Fix missing images for Elhamd products
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/storage/products.json');
const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Find products without images that are from Elhamd Store
const productsToFix = productsData.products.filter(p =>
  !p.images || p.images.length === 0
).filter(p =>
  p.sourceMetadata?.source === 'Elhamd Store'
);

console.log(`Found ${productsToFix.length} Elhamd products without images`);

async function fetchProductDetails(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract images
    const images = [];
    $('.woocommerce-product-gallery__image img').each((_, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src');
      if (src) {
        images.push(src);
      }
    });

    // Also try other image selectors
    if (images.length === 0) {
      $('img').each((_, element) => {
        const src = $(element).attr('src');
        if (src && (src.includes('product') || src.includes('upload'))) {
          if (!images.includes(src)) {
            images.push(src);
          }
        }
      });
    }

    // Extract description
    const description = $('.woocommerce-product-details__short-description').text().trim() ||
                       $('.product-description').text().trim() ||
                       $('.entry-summary').text().trim();

    // Extract price
    let price = 0;
    const priceEl = $('.price .amount').first();
    if (priceEl.length) {
      const priceText = priceEl.text().replace(/[^\d.]/g, '');
      price = parseFloat(priceText) || 0;
    }

    return { images, description, price };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function fixProducts() {
  let fixed = 0;
  let failed = 0;

  for (let i = 0; i < productsToFix.length; i++) {
    const product = productsToFix[i];
    const url = product.sourceMetadata?.sourceUrl;

    if (!url) {
      console.log(`No source URL for ${product.id}`);
      failed++;
      continue;
    }

    console.log(`Fixing ${i + 1}/${productsToFix.length}: ${product.name}`);

    const details = await fetchProductDetails(url);

    if (details) {
      product.images = details.images;
      if (details.description) {
        product.description = details.description;
      }
      if (details.price > 0) {
        product.price = details.price;
        product.originalPrice = details.price;
      }
      fixed++;
      console.log(`  ✓ Fixed: ${details.images.length} images`);
    } else {
      failed++;
    }

    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save progress every 50 products
    if ((i + 1) % 50 === 0) {
      fs.writeFileSync(dataPath, JSON.stringify(productsData, null, 2));
      console.log(`  Progress saved (${i + 1}/${productsToFix.length})`);
    }
  }

  // Final save
  fs.writeFileSync(dataPath, JSON.stringify(productsData, null, 2));

  console.log(`\n=== COMPLETE ===`);
  console.log(`Fixed: ${fixed}`);
  console.log(`Failed: ${failed}`);
}

fixProducts().catch(console.error);
