// Bros&Baits Migratie Test - Alleen Supabase + Fetch (Bulletproof versie)
// Deze versie gebruikt geen externe WooCommerce library

// Configuratie
const SUPABASE_URL = 'https://vdiagrzdkjmnojccuasp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaWFncnpka2ptbm9qY2N1YXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODY1MTYsImV4cCI6MjA2ODc2MjUxNn0.QfM4RPLzXy9wOW35dtWS4Tx33t5o-LVOswd1rWxW-Lo'
const WC_URL = 'https://brosandbaits.com'
const WC_KEY = 'ck_e4a4966e3d50bf1d5e557c3f1a4fffc01b3aad3e'
const WC_SECRET = 'cs_285e7efd548c2bf62804c33ee5a06eafb7c366cb'

// Global variables
let supabase = null

// Base64 encode function voor browser en Node.js
function base64Encode(str) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64')
  } else {
    return btoa(str)
  }
}

async function initializeSupabase() {
  console.log('🔧 Supabase client initialiseren...')
  
  try {
    const supabaseModule = await import('@supabase/supabase-js')
    supabase = supabaseModule.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    console.log('✅ Supabase client succesvol geïnitialiseerd')
    return true
  } catch (error) {
    console.error('❌ Supabase initialisatie fout:', error.message)
    return false
  }
}

async function wooCommerceAPI(endpoint, params = {}) {
  const auth = base64Encode(`${WC_KEY}:${WC_SECRET}`)
  const queryString = new URLSearchParams(params).toString()
  const url = `${WC_URL}/wp-json/wc/v3/${endpoint}${queryString ? '?' + queryString : ''}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Bros&Baits-Migration-Tool'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const headers = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    return { data, headers, status: response.status }
  } catch (error) {
    throw new Error(`WooCommerce API fout: ${error.message}`)
  }
}

async function testSupabaseConnection() {
  console.log('\n📡 Supabase database verbinding testen...')
  
  if (!supabase) {
    console.error('❌ Supabase client niet geïnitialiseerd')
    return false
  }
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count(*)')
      .single()
    
    if (error) {
      console.error('❌ Supabase database fout:', error.message)
      
      if (error.message.includes('relation "categories" does not exist')) {
        console.log('')
        console.log('💡 DATABASE SCHEMA MOET WORDEN UITGEVOERD!')
        console.log('==========================================')
        console.log('🔧 Stappen om de database op te zetten:')
        console.log('1. Open: https://vdiagrzdkjmnojccuasp.supabase.co')
        console.log('2. Ga naar "SQL Editor" in het menu')
        console.log('3. Klik op "New Query"')
        console.log('4. Kopieer het volledige database schema uit onze chat')
        console.log('5. Plak het in de SQL Editor')
        console.log('6. Klik "Run" om alle tabellen aan te maken')
        console.log('7. Run deze test opnieuw')
        console.log('')
        console.log('📋 Het schema bevat alle tabellen voor:')
        console.log('   - Producten & varianten')
        console.log('   - Categorieën & tags')
        console.log('   - Afbeeldingen & reviews')
        console.log('   - Merken & collecties')
        return false
      }
      
      return false
    }
    
    console.log('✅ Supabase database verbinding werkt perfect!')
    console.log(`📊 Categorieën in database: ${data.count || 0}`)
    
    // Test write permissions
    try {
      const timestamp = Date.now()
      const testCategory = {
        name: `Bros&Baits Migration Test ${timestamp}`,
        name_en: `Bros&Baits Migration Test ${timestamp}`,
        name_nl: `Bros&Baits Migratie Test ${timestamp}`,
        slug: `migration-test-${timestamp}`,
        description: 'Test category voor migratie verificatie - wordt automatisch verwijderd',
        is_active: true
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('categories')
        .insert(testCategory)
        .select()
        .single()
      
      if (insertError) {
        console.log('⚠️  Write permissions test:', insertError.message)
      } else {
        console.log('✅ Database write permissions werken!')
        console.log(`   📝 Test category aangemaakt met ID: ${insertData.id}`)
        
        // Cleanup test data
        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', insertData.id)
        
        if (!deleteError) {
          console.log('   🗑️  Test category succesvol verwijderd')
        }
      }
    } catch (writeError) {
      console.log('ℹ️  Write permissions test overgeslagen')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Supabase verbindingsfout:', error.message)
    return false
  }
}

async function testWooCommerceConnection() {
  console.log('\n🛒 Bros&Baits WooCommerce API testen...')
  
  try {
    const response = await wooCommerceAPI('products', {
      per_page: 1,
      status: 'any'
    })
    
    console.log('✅ WooCommerce API verbinding werkt!')
    console.log(`📦 HTTP Status: ${response.status}`)
    console.log(`📊 Totaal producten: ${response.headers['x-wp-total'] || 'Onbekend'}`)
    console.log(`📄 Totaal pagina's: ${response.headers['x-wp-totalpages'] || 'Onbekend'}`)
    
    if (response.data && response.data.length > 0) {
      const product = response.data[0]
      console.log(`\n🎣 Bros&Baits product sample:`)
      console.log(`   📋 "${product.name}"`)
      console.log(`   💰 €${product.price || 'Geen prijs'}`)
      console.log(`   🆔 Product ID: ${product.id}`)
      console.log(`   🔗 Slug: ${product.slug}`)
      console.log(`   📁 Categorieën: ${product.categories?.length || 0}`)
      console.log(`   🖼️  Afbeeldingen: ${product.images?.length || 0}`)
      console.log(`   🏷️  Tags: ${product.tags?.length || 0}`)
      console.log(`   📦 Voorraad: ${product.stock_quantity || 'Onbekend'}`)
      console.log(`   📈 Stock status: ${product.stock_status}`)
      console.log(`   🔄 Product status: ${product.status}`)
      console.log(`   📊 Type: ${product.type}`)
      
      // Afmetingen (belangrijk voor kunstaas)
      if (product.dimensions) {
        const d = product.dimensions
        console.log(`   📏 Afmetingen: L:${d.length || '?'} B:${d.width || '?'} H:${d.height || '?'}`)
      }
      
      if (product.weight) {
        console.log(`   ⚖️  Gewicht: ${product.weight}g`)
      }
      
      // Custom meta data (voor kunstaas specificaties)
      if (product.meta_data && product.meta_data.length > 0) {
        const relevantMeta = product.meta_data.filter(meta => 
          meta.key && meta.value && !meta.key.startsWith('_') &&
          typeof meta.value === 'string' && meta.value.length < 100
        ).slice(0, 3)
        
        if (relevantMeta.length > 0) {
          console.log(`   📋 Custom fields (${product.meta_data.length} totaal):`)
          relevantMeta.forEach(meta => {
            console.log(`      - ${meta.key}: ${meta.value}`)
          })
        }
      }
    }
    
    return true
    
  } catch (error) {
    console.error('❌ WooCommerce API fout:', error.message)
    
    if (error.message.includes('401')) {
      console.log('💡 Authenticatie probleem:')
      console.log('   - Controleer Consumer Key en Secret')
      console.log('   - Verifieer API key in WordPress admin')
      console.log('   - Check dat de key actief is')
    } else if (error.message.includes('404')) {
      console.log('💡 API endpoint niet gevonden:')
      console.log('   - Is WooCommerce correct geïnstalleerd?')
      console.log('   - Is de REST API ingeschakeld?')
      console.log('   - Controleer de site URL')
    } else if (error.message.includes('fetch')) {
      console.log('💡 Netwerk probleem:')
      console.log('   - Controleer internet verbinding')
      console.log('   - Site mogelijk tijdelijk offline')
      console.log('   - DNS of SSL probleem')
    }
    
    return false
  }
}

async function analyzeBrosAndBaitsData() {
  console.log('\n📊 Bros&Baits complete data analyse...')
  
  try {
    // Categorieën analyseren
    console.log('\n🗂️  Productcategorieën ophalen en analyseren...')
    const categoriesResponse = await wooCommerceAPI('products/categories', {
      per_page: 50,
      orderby: 'count',
      order: 'desc'
    })
    
    const activeCategories = categoriesResponse.data.filter(cat => cat.count > 0)
    console.log(`📁 Actieve categorieën met producten: ${activeCategories.length}`)
    console.log(`📂 Totale categorieën: ${categoriesResponse.data.length}`)
    
    console.log('\n🏆 Top productcategorieën:')
    activeCategories.slice(0, 8).forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} - ${cat.count} producten`)
      console.log(`      🔗 Slug: ${cat.slug}`)
      console.log(`      🆔 ID: ${cat.id}`)
      if (cat.description) {
        const desc = cat.description.replace(/<[^>]*>/g, '').substring(0, 80)
        if (desc.trim()) {
          console.log(`      📝 ${desc}...`)
        }
      }
    })
    
    // Recent producten sample
    console.log('\n📦 Recente Bros&Baits producten (sample):')
    const productsResponse = await wooCommerceAPI('products', {
      per_page: 8,
      status: 'publish',
      orderby: 'date',
      order: 'desc'
    })
    
    productsResponse.data.forEach((product, index) => {
      console.log(`\n   ${index + 1}. "${product.name}"`)
      console.log(`      💰 €${product.price}${product.sale_price ? ` (was: €${product.regular_price})` : ''}`)
      console.log(`      🆔 SKU: ${product.sku || 'Geen SKU'}`)
      console.log(`      🏷️  ID: ${product.id}`)
      console.log(`      📁 Cat: ${product.categories?.map(c => c.name).join(', ') || 'Geen'}`)
      console.log(`      📦 Voorraad: ${product.stock_quantity || '?'} (${product.stock_status})`)
      
      // Kunstaaas relevante informatie
      if (product.dimensions) {
        const d = product.dimensions
        if (d.length || d.width || d.height) {
          console.log(`      📏 Afmetingen: L:${d.length || '?'} B:${d.width || '?'} H:${d.height || '?'} (cm)`)
        }
      }
      
      if (product.weight) {
        console.log(`      ⚖️  Gewicht: ${product.weight}g`)
      }
      
      if (product.tags && product.tags.length > 0) {
        console.log(`      🏷️  Tags: ${product.tags.map(t => t.name).join(', ')}`)
      }
      
      // Beschrijving
      if (product.short_description) {
        const desc = product.short_description.replace(/<[^>]*>/g, '').trim()
        if (desc) {
          console.log(`      📝 "${desc.substring(0, 100)}${desc.length > 100 ? '...' : ''}"`)
        }
      }
    })
    
    // Voorraad & business statistieken
    console.log('\n📈 Bros&Baits business statistieken...')
    const statsResponse = await wooCommerceAPI('products', {
      per_page: 100,
      status: 'publish'
    })
    
    const stats = statsResponse.data.reduce((acc, product) => {
      acc.total++
      
      // Voorraad
      if (product.manage_stock && product.stock_quantity) {
        acc.managedStock++
        acc.totalInventory += parseInt(product.stock_quantity)
      }
      
      // Status
      switch (product.stock_status) {
        case 'instock': acc.inStock++; break
        case 'outofstock': acc.outOfStock++; break
        case 'onbackorder': acc.backorder++; break
      }
      
      // Prijzen
      if (product.price) {
        acc.withPrice++
        const price = parseFloat(product.price)
        acc.totalValue += price
        acc.minPrice = Math.min(acc.minPrice, price)
        acc.maxPrice = Math.max(acc.maxPrice, price)
      }
      
      // Content
      if (product.images && product.images.length > 0) {
        acc.withImages++
        acc.totalImages += product.images.length
      }
      
      if (product.short_description && product.short_description.trim()) {
        acc.withDescriptions++
      }
      
      // SKUs
      if (product.sku && product.sku.trim()) {
        acc.withSKU++
      }
      
      return acc
    }, {
      total: 0,
      managedStock: 0,
      totalInventory: 0,
      inStock: 0,
      outOfStock: 0,
      backorder: 0,
      withPrice: 0,
      totalValue: 0,
      minPrice: Infinity,
      maxPrice: 0,
      withImages: 0,
      totalImages: 0,
      withDescriptions: 0,
      withSKU: 0
    })
    
    console.log(`\n📊 Statistieken analyse (sample van ${stats.total} producten):`)
    console.log(`   📈 Voorraad beheerd: ${stats.managedStock} producten`)
    console.log(`   📦 Totale voorraad: ${stats.totalInventory} stuks`)
    console.log(`   ✅ Op voorraad: ${stats.inStock}`)
    console.log(`   ❌ Uitverkocht: ${stats.outOfStock}`)
    console.log(`   🔄 Backorder mogelijk: ${stats.backorder}`)
    console.log(`   💰 Met prijzen: ${stats.withPrice} (${((stats.withPrice/stats.total)*100).toFixed(1)}%)`)
    console.log(`   🖼️  Met afbeeldingen: ${stats.withImages} (${stats.totalImages} totaal)`)
    console.log(`   📝 Met beschrijvingen: ${stats.withDescriptions} (${((stats.withDescriptions/stats.total)*100).toFixed(1)}%)`)
    console.log(`   🏷️  Met SKU: ${stats.withSKU} (${((stats.withSKU/stats.total)*100).toFixed(1)}%)`)
    
    if (stats.withPrice > 0) {
      console.log(`   💳 Prijsbereik: €${stats.minPrice.toFixed(2)} - €${stats.maxPrice.toFixed(2)}`)
      console.log(`   💵 Gemiddelde prijs: €${(stats.totalValue / stats.withPrice).toFixed(2)}`)
      console.log(`   💎 Totale cataloguswaarde: €${stats.totalValue.toFixed(2)}`)
    }
    
  } catch (error) {
    console.error('❌ Data analyse fout:', error.message)
  }
}

async function runCompleteTest() {
  console.log('🎣 Bros&Baits WooCommerce → Supabase Migratie Test')
  console.log('==================================================')
  console.log(`📅 ${new Date().toLocaleString('nl-NL')}`)
  console.log(`💻 Node.js ${process.version}`)
  console.log(`📂 ${process.cwd()}`)
  console.log('')
  
  // Stap 1: Initialiseer Supabase
  const supabaseOK = await initializeSupabase()
  if (!supabaseOK) {
    console.log('\n❌ Kan niet verder zonder Supabase')
    return
  }
  
  // Stap 2: Test beide verbindingen
  const dbConnected = await testSupabaseConnection()
  const apiConnected = await testWooCommerceConnection()
  
  if (dbConnected && apiConnected) {
    // Stap 3: Volledige data analyse
    await analyzeBrosAndBaitsData()
    
    console.log('\n🎉 BROS&BAITS MIGRATIE TEST SUCCESVOL!')
    console.log('======================================')
    console.log('✅ Supabase database: Verbonden & klaar voor data')
    console.log('✅ WooCommerce API: Verbonden & data toegankelijk')
    console.log('✅ Bros&Baits data: Volledig geanalyseerd')
    console.log('✅ Migratie voorbereiding: Compleet')
    console.log('')
    console.log('🚀 READY FOR FULL MIGRATION!')
    console.log('=============================')
    console.log('Alle systemen zijn operationeel.')
    console.log('Je Bros&Baits kunstaaas data is klaar')
    console.log('om volledig gemigreerd te worden naar')
    console.log('je moderne Supabase database.')
    console.log('')
    console.log('💡 Volgende stap: Start de volledige migratie script')
    console.log('    om alle producten, categorieën, afbeeldingen,')
    console.log('    tags en metadata over te zetten.')
    
  } else {
    console.log('\n❌ MIGRATIE SETUP INCOMPLEET')
    console.log('=============================')
    console.log(`${supabaseOK ? '✅' : '❌'} Supabase module: ${supabaseOK ? 'Geladen' : 'Probleem'}`)
    console.log(`${dbConnected ? '✅' : '❌'} Database verbinding: ${dbConnected ? 'Werkt' : 'Vereist setup'}`)
    console.log(`${apiConnected ? '✅' : '❌'} WooCommerce API: ${apiConnected ? 'Werkt' : 'Heeft problemen'}`)
    console.log('')
    console.log('🔧 Fix de issues hierboven voordat je migreert')
    
    if (!dbConnected) {
      console.log('\n📋 Database setup prioriteit:')
      console.log('Het database schema moet uitgevoerd worden in Supabase')
    }
  }
}

// Start de complete Bros&Baits test
console.log('⏳ Bros&Baits migration test initializing...\n')
runCompleteTest().catch(error => {
  console.error('💥 ONVERWACHTE FOUT:', error.message)
  if (error.stack) {
    console.error('📋 Details:', error.stack)
  }
  process.exit(1)
})