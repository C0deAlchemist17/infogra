// Script to update all existing products with 9% markup
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/storage/products.json');

console.log('Loading products...');
const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Found ${data.products.length} products`);

let updatedCount = 0;
data.products.forEach(product => {
  const originalPrice = product.price;
  // Add 9% markup
  product.price = Math.round(originalPrice * 1.09);
  product.originalPrice = originalPrice;
  product.discount = 0;
  updatedCount++;
});

console.log(`Updated ${updatedCount} products with 9% markup`);

fs.writeFileSync(productsPath, JSON.stringify(data, null, 2));
console.log('Saved updated products.json');
