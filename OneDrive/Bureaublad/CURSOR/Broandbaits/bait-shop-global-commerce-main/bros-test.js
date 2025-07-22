// Bros&Baits Migratie Test - Met bestaande WooCommerce library
// Gebruikt de @woocommerce/woocommerce-rest-api die al geïnstalleerd is

import { createClient } from '@supabase/supabase-js'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

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

async function testSupabaseConnection() {
  console.log('📡 Supabase verbinding testen...')
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count(*)')
      .single()
    
    if (error) {
      console.error('❌ Supabase fout:', error.message)
      
      if (error.message.includes('relation "categories" does not exist')) {
        console.log('💡 Database schema moet nog worden uitgevoerd!')
        console.log('   1. Ga naar: https://vdiagrzdkjmnojccuasp.supabase.co')
        console.log('   2. Klik op "SQL Editor"')
        console.log('   3. Maak een "New Query"')
        console.log('   4. Kopieer en plak het database schema')
        console.log('   5. Klik "Run" om de tabellen aan te maken')
        console.log('')
        console.log('🔧 Schema SQL krijg je van de eerste artifact in onze chat')
        return false
      }
      
      return false
    } else {
      console.log('✅ Supabase verbinding werkt!')
      console.log(`📊 Categorieën in database: ${data.count || 0}`)
      
      // Test write permissions
      try {
        const testCategory = {
          name: 'Migration Test',
          name_en: 'Migration Test',
          name_nl: 'Migratie Test',
          slug: 'migration-test-' + Date.now(),
          description: 'Test category voor migratie'
        }
        
        const { data: insertData, error: insertError } = await supabase
          .from('categories')
          .insert(testCategory)
          .select()
          .single()
        
        if (insertError) {
          console.log('⚠️  Write test gefaald:', insertError.message)
        } else {
          console.log('✅ Database write permissions werken!')
          
          // Cleanup
          await supabase
            .from('categories')
            .delete()
            .eq('id', insertData.id)
        }
      } catch (writeError) {
        console.log('ℹ️  Write test overgeslagen')
      }
      
      return true
    }
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message)
    return false
  }
}

async function testWooCommerceConnection() {
  console.log('🛒 WooCommerce API verbinding testen...')
  
  try {
    const response = await woocommerce.get('products', {
      per_page: 1,
      status: 'any'
    })
    
    console.log('✅ WooCommerce API werkt!')
    console.log(`📦 Status: ${response.status || 'OK'}`)
    console.log(`📊 Totaal producten: ${response.headers?.['x-wp-total'] || 'Onbekend'}`)
    
    if (response.data && response.data.length > 0) {
      const product = response.data[0]
      console.log(`\n🔍 Eerste product preview:`)
      console.log(`   📋 "${product.name}"`)
      console.log(`   💰 €${product.price || 'Geen prijs'}`)
      console.log(`   🆔 ID: ${product.id}`)
      console.log(`   🔗 Slug: ${product.slug}`)
      console.log(`   📁 Categorieën: ${product.categories?.length || 0}`)
      console.log(`   🖼️  Afbeeldingen: ${product.images?.length || 0}`)
      console.log(`   🏷️  Tags: ${product.tags?.length || 0}`)
      console.log(`   📦 Voorraad: ${product.stock_quantity || 'Onbekend'}`)
      console.log(`   🔄 Status: ${product.status}`)
    }
    
    return true
    
  } catch (error) {
    console.error('❌ WooCommerce API fout:', error.message)
    
    if (error.response) {
      console.log(`   HTTP ${error.response.status}: ${error.response.statusText}`)
      
      if (error.response.status === 401) {
        console.log('💡 Authenticatie probleem - controleer je API credentials')
      } else if (error.response.status === 404) {
        console.log('💡 WooCommerce API niet gevonden - controleer je site URL')
      }
    }
    
    return false
  }
}

async function analyzeBrosAndBaitsData() {
  console.log('\n📊 Bros&Baits data analyse...')
  
  try {
    // Categorieën analyseren
    const categoriesResponse = await woocommerce.get('products/categories', {
      per_page: 20,
      orderby: 'count',
      order: 'desc'
    })
    
    console.log(`\n🗂️  Productcategorieën (${categoriesResponse.data.length}):`)
    categoriesResponse.data.forEach((cat, index) => {
      if (cat.count > 0) {
        console.log(`   ${index + 1}. ${cat.name} - ${cat.count} producten (slug: ${cat.slug})`)
      }
    })
    
    // Sample producten analyseren
    const productsResponse = await woocommerce.get('products', {
      per_page: 8,
      status: 'publish',
      orderby: 'date',
      order: 'desc'
    })
    
    console.log(`\n📦 Recente Bros&Baits producten (${productsResponse.data.length}):`)
    productsResponse.data.forEach((product, index) => {
      console.log(`\n   ${index + 1}. ${product.name}`)
      console.log(`      💰 €${product.price || 'Geen prijs'} ${product.sale_price ? `(sale: €${product.sale_price})` : ''}`)
      console.log(`      🆔 SKU: ${product.sku || 'Geen SKU'}`)
      console.log(`      📁 Categorieën: ${product.categories?.map(c => c.name).join(', ') || 'Geen'}`)
      console.log(`      📦 Voorraad: ${product.stock_quantity || '?'} (${product.stock_status})`)
      
      // Afmetingen voor kunstaaas
      if (product.dimensions) {
        const dims = product.dimensions
        console.log(`      📏 Afmetingen: L:${dims.length || '?'} B:${dims.width || '?'} H:${dims.height || '?'}`)
      }
      
      if (product.weight) {
        console.log(`      ⚖️  Gewicht: ${product.weight}g`)
      }
      
      // Custom fields voor kunstaas specificaties
      if (product.meta_data && product.meta_data.length > 0) {
        const relevantMeta = product.meta_data.filter(meta => 
          meta.key && 
          meta.value && 
          !meta.key.startsWith('_') &&
          typeof meta.value === 'string' &&
          meta.value.length > 0 &&
          meta.value.length < 100
        ).slice(0, 3)
        
        if (relevantMeta.length > 0) {
          console.log(`      📋 Custom velden:`)
          relevantMeta.forEach(meta => {
            console.log(`         - ${meta.key}: ${meta.value}`)
          })
        }
      }
      
      if (product.short_description) {
        const desc = product.short_description.replace(/<[^>]*>/g, '').trim()
        if (desc.length > 0) {
          console.log(`      📝 "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"`)
        }
      }
    })
    
    // Tags analyseren
    try {
      const tagsResponse = await woocommerce.get('products/tags', {
        per_page: 15,
        orderby: 'count',
        order: 'desc'
      })
      
      console.log(`\n🏷️  Product tags (${tagsResponse.data.length}):`)
      tagsResponse.data.forEach((tag, index) => {
        if (tag.count > 0) {
          console.log(`   ${index + 1}. ${tag.name} (${tag.count} producten)`)
        }
      })
    } catch (tagsError) {
      console.log('ℹ️  Tags data overgeslagen')
    }
    
    // Voorraad statistieken
    const allProductsResponse = await woocommerce.get('products', {
      per_page: 50,
      status: 'publish'
    })
    
    const stockStats = allProductsResponse.data.reduce((stats, product) => {
      if (product.manage_stock) {
        stats.managed++
        stats.totalStock += parseInt(product.stock_quantity) || 0
      } else {
        stats.notManaged++
      }
      
      if (product.stock_status === 'instock') stats.inStock++
      else if (product.stock_status === 'outofstock') stats.outOfStock++
      else stats.onBackorder++
      
      return stats
    }, {
      managed: 0,
      notManaged: 0,
      totalStock: 0,
      inStock: 0,
      outOfStock: 0,
      onBackorder: 0
    })
    
    console.log(`\n📊 Voorraad statistieken (sample van ${allProductsResponse.data.length}):`)
    console.log(`   📈 Voorraad beheerd: ${stockStats.managed} producten`)
    console.log(`   📉 Niet beheerd: ${stockStats.notManaged} producten`)
    console.log(`   📦 Totale voorraad: ${stockStats.totalStock} stuks`)
    console.log(`   ✅ Op voorraad: ${stockStats.inStock}`)
    console.log(`   ❌ Uitverkocht: ${stockStats.outOfStock}`)
    console.log(`   🔄 Backorder: ${stockStats.onBackorder}`)
    
  } catch (error) {
    console.error('❌ Data analyse fout:', error.message)
  }
}

async function runBrosAndBaitsTest() {
  console.log('🎣 Bros&Baits WooCommerce naar Supabase Migratie Test')
  console.log('====================================================')
  console.log(`📅 ${new Date().toLocaleString('nl-NL')}`)
  console.log(`💻 Node.js ${process.version}`)
  console.log(`📂 ${process.cwd()}`)
  console.log('')
  
  // Test beide verbindingen
  const supabaseOK = await testSupabaseConnection()
  console.log('')
  const wooCommerceOK = await testWooCommerceConnection()
  
  if (supabaseOK && wooCommerceOK) {
    // Beide werken - analyseer je data
    await analyzeBrosAndBaitsData()
    
    console.log('\n🎉 ALLE SYSTEMEN OPERATIONEEL!')
    console.log('==============================')
    console.log('✅ Supabase database: Verbonden & klaar')
    console.log('✅ WooCommerce API: Verbonden & data beschikbaar')
    console.log('✅ Bros&Baits data: Geanalyseerd & klaar voor migratie')
    console.log('')
    console.log('🚀 READY TO MIGRATE!')
    console.log('====================')
    console.log('Je kunt nu de volledige migratie starten.')
    console.log('Alle producten, categorieën, afbeeldingen en tags')
    console.log('worden overgezet naar je nieuwe Supabase database.')
    
  } else {
    console.log('\n❌ SETUP INCOMPLEET')
    console.log('====================')
    console.log(`Supabase: ${supabaseOK ? '✅ Werkt' : '❌ Vereist setup'}`)
    console.log(`WooCommerce: ${wooCommerceOK ? '✅ Werkt' : '❌ Heeft aandacht nodig'}`)
    console.log('')
    console.log('💡 Los de issues hierboven op voordat je migreert.')
    
    if (!supabaseOK) {
      console.log('')
      console.log('🔧 Supabase setup stappen:')
      console.log('1. Ga naar je Supabase dashboard')
      console.log('2. Open SQL Editor')
      console.log('3. Voer het database schema uit')
      console.log('4. Run deze test opnieuw')
    }
  }
}

// Start de test
console.log('⏳ Initializing Bros&Baits migration test...\n')
runBrosAndBaitsTest().catch(error => {
  console.error('💥 CRITICAL ERROR:', error.message)
  if (error.stack) {
    console.error('📋 Stack trace:', error.stack)
  }
  process.exit(1)
})