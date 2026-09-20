// Reset all product prices to original/source prices
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/storage/products.json');
const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log(`Total products: ${productsData.products.length}`);

let updated = 0;
let noOriginalPrice = 0;

productsData.products.forEach(product => {
  // If sourcePrice exists, use it
  if (product.sourceMetadata?.sourcePrice && product.sourceMetadata.sourcePrice > 0) {
    product.price = product.sourceMetadata.sourcePrice;
    product.originalPrice = product.sourceMetadata.sourcePrice;
    product.discount = 0;
    updated++;
  }
  // If originalPrice exists and is > 0, use it
  else if (product.originalPrice && product.originalPrice > 0) {
    product.price = product.originalPrice;
    product.discount = 0;
    updated++;
  }
  // If price is 0 but we have no original, set to a default or keep as is
  else if (product.price === 0) {
    noOriginalPrice++;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(productsData, null, 2));

console.log(`Updated ${updated} products to original prices`);
console.log(`Products with no original price: ${noOriginalPrice}`);
console.log('Done!');
