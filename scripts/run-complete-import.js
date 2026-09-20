// Script to run complete Kimo and Elhamd imports
// Using native fetch (Node.js 18+)

const ADMIN_API_KEY = 'infogra-admin-key-2025';
const BASE_URL = 'http://localhost:3000';

async function runImport() {
  console.log('=== STARTING COMPLETE IMPORT PROCESS ===\n');

  // Step 1: Run Kimo import
  console.log('Step 1: Starting Kimo Store complete import...');
  console.log('This will scan ALL pages from ALL categories with complete product details');
  console.log('This may take several minutes depending on the catalog size...\n');

  try {
    const kimoResponse = await fetch(`${BASE_URL}/api/full-kimo-import`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`
      }
    });

    const kimoResult = await kimoResponse.json();

    if (kimoResult.success) {
      console.log('\n✅ KIMO IMPORT SUCCESSFUL');
      console.log(`Duration: ${(kimoResult.duration / 1000).toFixed(2)}s`);
      console.log(`Categories scanned: ${kimoResult.scrapeResults.categoriesFound}`);
      console.log(`Pages scanned: ${kimoResult.scrapeResults.pagesScanned}`);
      console.log(`Products discovered: ${kimoResult.scrapeResults.productsDiscovered}`);
      console.log(`Products imported: ${kimoResult.importResults.productsImported}`);
      console.log(`Products updated: ${kimoResult.importResults.productsUpdated}`);
      console.log(`Products skipped: ${kimoResult.importResults.productsSkipped}`);
      console.log(`Products failed: ${kimoResult.importResults.productsFailed}`);
      console.log('\nCategory breakdown:');
      Object.entries(kimoResult.categoryBreakdown).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
      });
    } else {
      console.error('\n❌ KIMO IMPORT FAILED');
      console.error('Error:', kimoResult.error);
      if (kimoResult.stack) {
        console.error('Stack:', kimoResult.stack);
      }
    }
  } catch (error) {
    console.error('\n❌ KIMO IMPORT ERROR:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Step 2: Run Elhamd import
  console.log('Step 2: Starting Elhamd Store complete import...');
  console.log('This will scan ALL pages from ALL categories with complete product details');
  console.log('This may take several minutes depending on the catalog size...\n');

  try {
    const elhamdResponse = await fetch(`${BASE_URL}/api/full-elhamd-catalog`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_API_KEY}`
      }
    });

    const elhamdResult = await elhamdResponse.json();

    if (elhamdResult.success) {
      console.log('\n✅ ELHAMD IMPORT SUCCESSFUL');
      console.log(`Duration: ${(elhamdResult.duration / 1000).toFixed(2)}s`);
      console.log(`Categories scanned: ${elhamdResult.catalogStats.totalCategories}`);
      console.log(`Products discovered: ${elhamdResult.catalogStats.productsDiscovered}`);
      console.log(`Unique products: ${elhamdResult.catalogStats.uniqueProducts}`);
      console.log(`Products imported: ${elhamdResult.importResults.productsImported}`);
      console.log(`Products updated: ${elhamdResult.importResults.productsUpdated}`);
      console.log(`Products skipped: ${elhamdResult.importResults.productsSkipped}`);
      console.log(`Products failed: ${elhamdResult.importResults.productsFailed}`);
      console.log('\nCategory breakdown:');
      Object.entries(elhamdResult.categoryBreakdown).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
      });
    } else {
      console.error('\n❌ ELHAMD IMPORT FAILED');
      console.error('Error:', elhamdResult.error);
      if (elhamdResult.stack) {
        console.error('Stack:', elhamdResult.stack);
      }
    }
  } catch (error) {
    console.error('\n❌ ELHAMD IMPORT ERROR:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('=== COMPLETE IMPORT PROCESS FINISHED ===\n');
}

runImport().catch(console.error);
