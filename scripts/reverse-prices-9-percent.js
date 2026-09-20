// Script to reverse 9% markup (switch prices back)
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/storage/products.json');

console.log('Loading products...');
const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Found ${data.products.length} products`);

let updatedCount = 0;
data.products.forEach(product => {
  if (product.originalPrice) {
    // Reverse the 9% markup by dividing by 1.09
    product.price = Math.round(product.originalPrice);
    updatedCount++;
  }
});

console.log(`Reversed prices for ${updatedCount} products`);

fs.writeFileSync(productsPath, JSON.stringify(data, null, 2));
console.log('Saved updated products.json');
