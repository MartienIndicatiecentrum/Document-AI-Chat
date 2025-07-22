// Test script voor Bros&Baits migratie - FIXED VERSION
// Gebruik CommonJS syntax om import problemen te voorkomen

const { createClient } = require('@supabase/supabase-js')
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default

// Configuratie
const SUPABASE_URL = 'https://vdiagrzdkjmnojccuasp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaWFncnpka2ptbm9qY2N1YXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODY1MTYsImV4cCI6MjA2ODc2MjUxNn0.QfM4RPLzXy9wOW35dtWS4Tx33t5o-LVOswd1rWxW-Lo'
const WC_URL = 'https://brosandbaits.com'
const WC_KEY = 'ck_e4a4966e3d50bf1d5e557c3f1a4fffc01b3aad3e'
const WC_SECRET = 'cs_285e7efd548c2bf62804c33ee5a06eafb7c366cb'

// Clients initialiseren
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const woocommerce = new WooCommerceRestApi({
  url: WC_URL,
  consumerKey: WC_KEY,
  consumerSecret: WC_SECRET,
  version: "wc/v3"
})

async function testConnections() {
  console.log('🔍 Bros&Baits - Verbindingen testen...')
  console.log('=====================================')
  
  // 1. Supabase verbinding testen
  try {
    console.log('📡 Supabase verbinding testen...')
    
    const { data, error } = await supabase
      .from('categories')
      .select('count(*)')
      .single()
    
    if (error) {
      console.error('❌ Supabase fout:', error.message)
      console.log('💡 Controleer of je het database schema hebt uitgevoerd!')
      return false
    } else {
      console.log('✅ Supabase verbinding werkt!')
      console.log(`📊 Categorieën in database: ${data.count || 0}`)
    }
  } catch (error) {
    console.error('❌ Supabase verbindingsfout:', error.message)
    return false
  }
  
  // 2. WooCommerce verbinding testen
  try {
    console.log('\n🛒 WooCommerce verbinding testen...')
    
    const response = await woocommerce.get('products', {
      per_page: 1,
      status: 'any'
    })
    
    console.log('✅ WooCommerce verbinding werkt!')
    console.log(`📦 Totaal producten gevonden: ${response.headers['x-wp-total'] || 'Onbekend'}`)
    
    if (response.data && response.data.length > 0) {
      const product = response.data[0]
      console.log(`📋 Eerste product: "${product.name}"`)
      console.log(`💰 Prijs: ${product.price || 'Geen prijs'}`)
      console.log(`📁 Categorieën: ${product.categories?.length || 0}`)
      console.log(`🖼️  Afbeeldingen: ${product.images?.length || 0}`)
      
      // Debug: toon product structuur
      console.log('\n🔍 Product data structuur:')
      console.log('- SKU:', product.sku)
      console.log('- Status:', product.status)
      console.log('- Type:', product.type)
      console.log('- Afmetingen:', product.dimensions)
      console.log('- Gewicht:', product.weight)
      console.log('- Meta data:', product.meta_data?.length || 0, 'velden')
    }
    
  } catch (error) {
    console.error('❌ WooCommerce fout:', error.response?.data || error.message)
    console.log('💡 Controleer je WooCommerce API credentials!')
    return false
  }
  
  // 3. Sample data ophalen voor analyse
  try {
    console.log('\n📊 WooCommerce data analyseren...')
    
    const categoriesResponse = await woocommerce.get('products/categories', {
      per_page: 10
    })
    
    console.log(`🗂️  Categorieën: ${categoriesResponse.data.length}`)
    categoriesResponse.data.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.count} producten) - slug: ${cat.slug}`)
    })
    
    const productsResponse = await woocommerce.get('products', {
      per_page: 3,
      status: 'publish'
    })
    
    console.log(`\n📦 Sample producten:`)
    productsResponse.data.forEach(product => {
      console.log(`   - ${product.name}`)
      console.log(`     💰 €${product.price || 'Geen prijs'}`)
      console.log(`     📏 L:${product.dimensions?.length || '?'} B:${product.dimensions?.width || '?'} H:${product.dimensions?.height || '?'}`)
      console.log(`     ⚖️  ${product.weight || 'Geen gewicht'}g`)
      console.log(`     🏷️  Tags: ${product.tags?.map(t => t.name).join(', ') || 'Geen tags'}`)
      console.log(`     🔗 ${product.slug}`)
      
      // Toon custom fields die relevant zijn voor kunstaas
      if (product.meta_data && product.meta_data.length > 0) {
        console.log('     📋 Custom fields:')
        product.meta_data.slice(0, 5).forEach(meta => {
          if (meta.key && !meta.key.startsWith('_') && meta.value) {
            console.log(`       - ${meta.key}: ${meta.value}`)
          }
        })
      }
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Data analyse fout:', error.message)
  }
  
  console.log('\n🎉 Verbindingstests voltooid!')
  console.log('\n💡 Als beide verbindingen werken, kun je de volledige migratie starten.')
  
  return true
}

async function startMigration() {
  const connectionsOK = await testConnections()
  
  if (connectionsOK) {
    console.log('\n✅ Alle verbindingen werken!')
    console.log('🚀 Je kunt nu de volledige migratie script draaien.')
  } else {
    console.log('\n❌ Er zijn verbindingsproblemen. Los deze eerst op.')
  }
}

// Test uitvoeren
startMigration().catch(error => {
  console.error('💥 Test fout:', error)
})