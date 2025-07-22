// Bros&Baits Migratie Test - Eenvoudige versie zonder externe WooCommerce library
// Gebruikt alleen ingebouwde fetch en Supabase

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

// Configuratie
const SUPABASE_URL = 'https://vdiagrzdkjmnojccuasp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaWFncnpka2ptbm9qY2N1YXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODY1MTYsImV4cCI6MjA2ODc2MjUxNn0.QfM4RPLzXy9wOW35dtWS4Tx33t5o-LVOswd1rWxW-Lo';
const WC_URL = 'https://brosandbaits.com';
const WC_KEY = 'ck_e4a4966e3d50bf1d5e557c3f1a4fffc01b3aad3e';
const WC_SECRET = 'cs_285e7efd548c2bf62804c33ee5a06eafb7c366cb';

// Clients initialiseren
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// WooCommerce API functie met Node.js https module
function wooCommerceRequest(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const queryParams = new URLSearchParams(params).toString();
    const path = `/wp-json/wc/v3/${endpoint}?${queryParams}`;
    
    const options = {
      hostname: 'brosandbaits.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Bros&Baits Migration Script'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            data: jsonData,
            status: res.statusCode,
            headers: res.headers
          });
        } catch (error) {
          reject(new Error(`JSON Parse Error: ${error.message}. Response: ${data.substring(0, 200)}...`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request Error: ${error.message}`));
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testSupabaseConnection() {
  console.log('📡 Supabase verbinding testen...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('categories')
      .select('count(*)')
      .single();
    
    if (error) {
      console.error('❌ Supabase fout:', error.message);
      
      if (error.message.includes('relation "categories" does not exist')) {
        console.log('💡 Database schema is nog niet uitgevoerd!');
        console.log('   1. Ga naar: https://vdiagrzdkjmnojccuasp.supabase.co');
        console.log('   2. Klik op "SQL Editor"');
        console.log('   3. Voer het database schema script uit');
        return false;
      }
      
      console.log('💡 Andere mogelijke oorzaken:');
      console.log('   - RLS (Row Level Security) ingeschakeld');
      console.log('   - Verkeerde API key');
      console.log('   - Netwerk connectie probleem');
      return false;
    } else {
      console.log('✅ Supabase verbinding werkt!');
      console.log(`📊 Categorieën in database: ${data.count || 0}`);
      
      // Test ook een insert om te zien of write permissions werken
      try {
        const testCategory = {
          name: 'Test Category',
          name_en: 'Test Category',
          name_nl: 'Test Categorie',
          slug: 'test-category-' + Date.now(),
          description: 'Test category voor migratie test'
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('categories')
          .insert(testCategory)
          .select()
          .single();
        
        if (insertError) {
          console.log('⚠️  Write test fout:', insertError.message);
        } else {
          console.log('✅ Write permissions werken ook!');
          
          // Clean up test data
          await supabase
            .from('categories')
            .delete()
            .eq('id', insertData.id);
        }
      } catch (writeError) {
        console.log('ℹ️  Write test overgeslagen:', writeError.message);
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Supabase verbindingsfout:', error.message);
    return false;
  }
}

async function testWooCommerceConnection() {
  console.log('🛒 WooCommerce verbinding testen...');
  
  try {
    // Test basic API access
    const response = await wooCommerceRequest('products', {
      per_page: 1,
      status: 'any'
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
    }
    
    console.log('✅ WooCommerce API verbinding werkt!');
    console.log(`📦 HTTP Status: ${response.status}`);
    console.log(`📊 Totaal producten: ${response.headers['x-wp-total'] || 'Onbekend'}`);
    console.log(`📄 Pagina's: ${response.headers['x-wp-totalpages'] || 'Onbekend'}`);
    
    if (response.data && response.data.length > 0) {
      const product = response.data[0];
      console.log(`\n🔍 Eerste product analyse:`);
      console.log(`   📋 Naam: "${product.name}"`);
      console.log(`   💰 Prijs: €${product.price || 'Geen prijs'}`);
      console.log(`   🆔 ID: ${product.id}`);
      console.log(`   🔗 Slug: ${product.slug}`);
      console.log(`   📁 Categorieën: ${product.categories?.length || 0}`);
      console.log(`   🖼️  Afbeeldingen: ${product.images?.length || 0}`);
      console.log(`   🏷️  Tags: ${product.tags?.length || 0}`);
      console.log(`   📦 Voorraad: ${product.stock_quantity || 'Niet bijgehouden'}`);
      console.log(`   🔄 Status: ${product.status}`);
      console.log(`   📊 Type: ${product.type}`);
      
      if (product.dimensions) {
        console.log(`   📏 Afmetingen: ${product.dimensions.length || '?'} x ${product.dimensions.width || '?'} x ${product.dimensions.height || '?'}`);
      }
      
      if (product.weight) {
        console.log(`   ⚖️  Gewicht: ${product.weight}g`);
      }
      
      // Toon wat custom fields
      if (product.meta_data && product.meta_data.length > 0) {
        console.log(`   📋 Custom fields: ${product.meta_data.length} totaal`);
        const interestingFields = product.meta_data.filter(meta => 
          meta.key && meta.value && 
          !meta.key.startsWith('_') && 
          typeof meta.value === 'string' && 
          meta.value.length < 50
        ).slice(0, 3);
        
        interestingFields.forEach(meta => {
          console.log(`      - ${meta.key}: ${meta.value}`);
        });
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ WooCommerce API fout:', error.message);
    
    if (error.message.includes('Request Error')) {
      console.log('💡 Mogelijke oorzaken:');
      console.log('   - Website is offline of bereikbaar');
      console.log('   - SSL certificaat probleem');
      console.log('   - Firewall blokkeert de verbinding');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.log('💡 Authenticatie probleem:');
      console.log('   - Consumer Key of Secret incorrect');
      console.log('   - API key is uitgeschakeld');
      console.log('   - Onvoldoende rechten');
    } else if (error.message.includes('404')) {
      console.log('💡 WooCommerce API niet gevonden:');
      console.log('   - WooCommerce niet geïnstalleerd');
      console.log('   - REST API uitgeschakeld');
      console.log('   - Permalink structuur probleem');
    }
    
    return false;
  }
}

async function analyzeSampleData() {
  console.log('\n📊 WooCommerce data structuur analyseren...');
  
  try {
    // Categorieën ophalen
    const categoriesResponse = await wooCommerceRequest('products/categories', {
      per_page: 10,
      orderby: 'count',
      order: 'desc'
    });
    
    console.log(`\n🗂️  Categorieën (${categoriesResponse.data.length}):`);
    categoriesResponse.data.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (${cat.count} producten) - ${cat.slug}`);
    });
    
    // Sample producten ophalen
    const productsResponse = await wooCommerceRequest('products', {
      per_page: 5,
      status: 'publish',
      orderby: 'date',
      order: 'desc'
    });
    
    console.log(`\n📦 Recente producten (${productsResponse.data.length}):`);
    productsResponse.data.forEach((product, index) => {
      console.log(`\n   ${index + 1}. ${product.name}`);
      console.log(`      💰 €${product.price || 'Geen prijs'} (was: €${product.regular_price || 'N/A'})`);
      console.log(`      🆔 SKU: ${product.sku || 'Geen SKU'}`);
      console.log(`      📁 Categorieën: ${product.categories?.map(c => c.name).join(', ') || 'Geen'}`);
      console.log(`      🏷️  Tags: ${product.tags?.map(t => t.name).join(', ') || 'Geen'}`);
      console.log(`      📦 Voorraad: ${product.stock_quantity || 'N/A'} (${product.stock_status})`);
      
      if (product.short_description) {
        const shortDesc = product.short_description.replace(/<[^>]*>/g, '').substring(0, 100);
        console.log(`      📝 Beschrijving: ${shortDesc}...`);
      }
    });
    
    // Tags ophalen
    try {
      const tagsResponse = await wooCommerceRequest('products/tags', {
        per_page: 10,
        orderby: 'count',
        order: 'desc'
      });
      
      console.log(`\n🏷️  Populaire tags (${tagsResponse.data.length}):`);
      tagsResponse.data.forEach((tag, index) => {
        console.log(`   ${index + 1}. ${tag.name} (${tag.count} producten) - ${tag.slug}`);
      });
    } catch (tagError) {
      console.log('ℹ️  Tags ophalen overgeslagen');
    }
    
  } catch (error) {
    console.error('❌ Data analyse fout:', error.message);
  }
}

async function runFullTest() {
  console.log('🚀 Bros&Baits Migratie Test');
  console.log('============================');
  console.log(`📅 Tijd: ${new Date().toLocaleString('nl-NL')}`);
  console.log(`💻 Node.js: ${process.version}`);
  console.log(`📂 Directory: ${process.cwd()}`);
  console.log('');
  
  let supabaseOK = false;
  let wooCommerceOK = false;
  
  // Test Supabase
  supabaseOK = await testSupabaseConnection();
  
  console.log(''); // Lege regel
  
  // Test WooCommerce
  wooCommerceOK = await testWooCommerceConnection();
  
  if (supabaseOK && wooCommerceOK) {
    // Als beide werken, analyseer de data
    await analyzeSampleData();
    
    console.log('\n🎉 ALLE TESTS GESLAAGD!');
    console.log('========================');
    console.log('✅ Supabase database verbinding werkt');
    console.log('✅ WooCommerce API verbinding werkt');
    console.log('✅ Data kan worden opgehaald en geanalyseerd');
    console.log('');
    console.log('📋 Volgende stappen:');
    console.log('1. Controleer de data structuur hierboven');
    console.log('2. Run de volledige migratie als je tevreden bent');
    console.log('3. Monitor het migratie proces');
    console.log('4. Verificeer de gemigreerde data in Supabase');
    
  } else {
    console.log('\n❌ TESTS GEFAALD');
    console.log('==================');
    console.log(`Supabase: ${supabaseOK ? '✅ Werkt' : '❌ Probleem'}`);
    console.log(`WooCommerce: ${wooCommerceOK ? '✅ Werkt' : '❌ Probleem'}`);
    console.log('');
    console.log('💡 Los de bovenstaande problemen op voordat je de migratie start.');
  }
}

// Script uitvoeren
console.log('⏳ Starting Bros&Baits migration test...\n');
runFullTest().catch(error => {
  console.error('💥 KRITIEKE FOUT:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});