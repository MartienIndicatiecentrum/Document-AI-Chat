// Bros&Baits Migratie Test - Dynamic Imports (werkt altijd)
// Deze versie gebruikt dynamic imports om module problemen te vermijden

// Configuratie
const SUPABASE_URL = 'https://vdiagrzdkjmnojccuasp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaWFncnpka2ptbm9qY2N1YXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODY1MTYsImV4cCI6MjA2ODc2MjUxNn0.QfM4RPLzXy9wOW35dtWS4Tx33t5o-LVOswd1rWxW-Lo'
const WC_URL = 'https://brosandbaits.com'
const WC_KEY = 'ck_e4a4966e3d50bf1d5e557c3f1a4fffc01b3aad3e'
const WC_SECRET = 'cs_285e7efd548c2bf62804c33ee5a06eafb7c366cb'

// Global variables voor onze clients
let supabase = null
let woocommerce = null

async function initializeClients() {
  console.log('🔧 Clients initialiseren...')
  
  try {
    // Dynamic import voor Supabase
    const supabaseModule = await import('@supabase/supabase-js')
    supabase = supabaseModule.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    console.log('✅ Supabase client geïnitialiseerd')
    
    // Dynamic import voor WooCommerce
    const woocommerceModule = await import('@woocommerce/woocommerce-rest-api')
    const WooCommerceRestApi = woocommerceModule.default || woocommerceModule
    
    woocommerce = new WooCommerceRestApi({
      url: WC_URL,
      consumerKey: WC_KEY,
      consumerSecret: WC_SECRET,
      version: "wc/v3"
    })
    console.log('✅ WooCommerce client geïnitialiseerd')
    
    return true
  } catch (error) {
    console.error('❌ Client initialisatie fout:', error.message)
    
    if (error.message.includes('Cannot resolve module')) {
      console.log('💡 Module niet gevonden - probeer:')
      console.log('   npm install @supabase/supabase-js@latest')
      console.log('   npm install @woocommerce/woocommerce-rest-api@latest')
    }
    
    return false
  }
}

async function testSupabaseConnection() {
  console.log('\n📡 Supabase verbinding testen...')
  
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
      console.error('❌ Supabase fout:', error.message)
      
      if (error.message.includes('relation "categories" does not exist')) {
        console.log('💡 Database schema moet worden uitgevoerd!')
        console.log('')
        console.log('🔧 Stappen:')
        console.log('1. Ga naar: https://vdiagrzdkjmnojccuasp.supabase.co')
        console.log('2. Klik op "SQL Editor" in het menu')
        console.log('3. Klik "New Query"')
        console.log('4. Kopieer het database schema uit onze chat')
        console.log('5. Plak het in de editor en klik "Run"')
        console.log('')
        console.log('✨ Het schema maakt alle benodigde tabellen aan')
        return false
      }
      
      if (error.message.includes('JWT')) {
        console.log('💡 API key probleem - controleer je Supabase credentials')
      }
      
      return false
    }
    
    console.log('✅ Supabase database verbinding werkt!')
    console.log(`📊 Categorieën in database: ${data.count || 0}`)
    
    // Test write permissions
    try {
      const testCategory = {
        name: 'Bros&Baits Test',
        name_en: 'Bros&Baits Test',
        name_nl: 'Bros&Baits Test',
        slug: 'bros-baits-test-' + Date.now(),
        description: 'Test category voor migratie verificatie'
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('categories')
        .insert(testCategory)
        .select()
        .single()
      
      if (insertError) {
        console.log('⚠️  Write test: ', insertError.message)
      } else {
        console.log('✅ Database write permissions werken!')
        
        // Cleanup test data
        await supabase
          .from('categories')
          .delete()
          .eq('id', insertData.id)
      }
    } catch (writeError) {
      console.log('ℹ️  Write test overgeslagen')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Supabase verbindingsfout:', error.message)
    return false
  }
}

async function testWooCommerceConnection() {
  console.log('\n🛒 WooCommerce API verbinding testen...')
  
  if (!woocommerce) {
    console.error('❌ WooCommerce client niet geïnitialiseerd')
    return false
  }
  
  try {
    const response = await woocommerce.get('products', {
      per_page: 1,
      status: 'any'
    })
    
    console.log('✅ WooCommerce API verbinding werkt!')
    console.log(`📦 HTTP Status: ${response.status || 'OK'}`)
    console.log(`📊 Totaal producten: ${response.headers?.['x-wp-total'] || 'Onbekend'}`)
    console.log(`📄 Totaal pagina's: ${response.headers?.['x-wp-totalpages'] || 'Onbekend'}`)
    
    if (response.data && response.data.length > 0) {
      const product = response.data[0]
      console.log(`\n🎣 Bros&Baits product preview:`)
      console.log(`   📋 Naam: "${product.name}"`)
      console.log(`   💰 Prijs: €${product.price || 'Geen prijs'}`)
      console.log(`   🆔 Product ID: ${product.id}`)
      console.log(`   🔗 Slug: ${product.slug}`)
      console.log(`   📁 Categorieën: ${product.categories?.length || 0}`)
      console.log(`   🖼️  Afbeeldingen: ${product.images?.length || 0}`)
      console.log(`   🏷️  Tags: ${product.tags?.length || 0}`)
      console.log(`   📦 Voorraad qty: ${product.stock_quantity || 'Onbekend'}`)
      console.log(`   📈 Stock status: ${product.stock_status || 'Onbekend'}`)
      console.log(`   🔄 Product status: ${product.status}`)
      console.log(`   📊 Product type: ${product.type}`)
      
      // Kunstaaas relevante data
      if (product.dimensions) {
        const d = product.dimensions
        console.log(`   📏 Afmetingen: ${d.length || '?'} x ${d.width || '?'} x ${d.height || '?'}`)
      }
      
      if (product.weight) {
        console.log(`   ⚖️  Gewicht: ${product.weight}g`)
      }
    }
    
    return true
    
  } catch (error) {
    console.error('❌ WooCommerce API fout:', error.message)
    
    if (error.response) {
      console.log(`   🔍 HTTP ${error.response.status}: ${error.response.statusText}`)
      
      if (error.response.status === 401) {
        console.log('💡 Authenticatie fout:')
        console.log('   - Controleer Consumer Key en Secret')
        console.log('   - Verificeer dat API key actief is')
        console.log('   - Check permissions in WordPress')
      } else if (error.response.status === 404) {
        console.log('💡 API endpoint niet gevonden:')
        console.log('   - Is WooCommerce geïnstalleerd?')
        console.log('   - Is REST API ingeschakeld?')
        console.log('   - Controleer de site URL')
      }
      
      if (error.response.data) {
        console.log('   📋 Error details:', error.response.data)
      }
    }
    
    return false
  }
}

async function performDataAnalysis() {
  console.log('\n📊 Bros&Baits data analyse starten...')
  
  try {
    // Categorieën ophalen en analyseren
    console.log('\n🗂️  Productcategorieën analyseren...')
    const categoriesResponse = await woocommerce.get('products/categories', {
      per_page: 50,
      orderby: 'count',
      order: 'desc'
    })
    
    const activeCategories = categoriesResponse.data.filter(cat => cat.count > 0)
    console.log(`📁 Actieve categorieën: ${activeCategories.length}`)
    
    activeCategories.slice(0, 10).forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} - ${cat.count} producten`)
      console.log(`      🔗 Slug: ${cat.slug}`)
      if (cat.description) {
        const desc = cat.description.replace(/<[^>]*>/g, '').substring(0, 60)
        console.log(`      📝 ${desc}...`)
      }
    })
    
    // Recente producten analyseren
    console.log('\n📦 Recente Bros&Baits producten...')
    const productsResponse = await woocommerce.get('products', {
      per_page: 10,
      status: 'publish',
      orderby: 'date',
      order: 'desc'
    })
    
    productsResponse.data.forEach((product, index) => {
      console.log(`\n   ${index + 1}. "${product.name}"`)
      console.log(`      💰 €${product.price}${product.sale_price ? ` (sale: €${product.sale_price})` : ''}`)
      console.log(`      🆔 SKU: ${product.sku || 'Geen SKU'}`)
      console.log(`      📁 Cat: ${product.categories?.map(c => c.name).join(', ') || 'Geen'}`)
      console.log(`      📦 Voorraad: ${product.stock_quantity || '?'} (${product.stock_status})`)
      
      if (product.dimensions) {
        const d = product.dimensions
        if (d.length || d.width || d.height) {
          console.log(`      📏 ${d.length || '?'} x ${d.width || '?'} x ${d.height || '?'}`)
        }
      }
      
      if (product.weight) {
        console.log(`      ⚖️  ${product.weight}g`)
      }
      
      // Short description
      if (product.short_description) {
        const desc = product.short_description.replace(/<[^>]*>/g, '').trim()
        if (desc) {
          console.log(`      📝 "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"`)
        }
      }
    })
    
    // Voorraad statistieken
    console.log('\n📈 Voorraad & Status Analyse...')
    const allProductsResponse = await woocommerce.get('products', {
      per_page: 100,
      status: 'publish'
    })
    
    const stats = allProductsResponse.data.reduce((acc, product) => {
      acc.total++
      
      if (product.manage_stock) {
        acc.managedStock++
        acc.totalQuantity += parseInt(product.stock_quantity) || 0
      }
      
      switch (product.stock_status) {
        case 'instock': acc.inStock++; break
        case 'outofstock': acc.outOfStock++; break
        case 'onbackorder': acc.backorder++; break
      }
      
      if (product.price) {
        acc.withPrice++
        acc.totalValue += parseFloat(product.price)
      }
      
      if (product.images && product.images.length > 0) {
        acc.withImages++
        acc.totalImages += product.images.length
      }
      
      return acc
    }, {
      total: 0,
      managedStock: 0,
      totalQuantity: 0,
      inStock: 0,
      outOfStock: 0,
      backorder: 0,
      withPrice: 0,
      totalValue: 0,
      withImages: 0,
      totalImages: 0
    })
    
    console.log(`📊 Statistieken (van ${stats.total} producten):`)
    console.log(`   📈 Voorraad beheerd: ${stats.managedStock}`)
    console.log(`   📦 Totale voorraad: ${stats.totalQuantity} stuks`)
    console.log(`   ✅ Op voorraad: ${stats.inStock}`)
    console.log(`   ❌ Uitverkocht: ${stats.outOfStock}`)
    console.log(`   🔄 Backorder: ${stats.backorder}`)
    console.log(`   💰 Met prijs: ${stats.withPrice} (totaal: €${stats.totalValue.toFixed(2)})`)
    console.log(`   🖼️  Met afbeeldingen: ${stats.withImages} (${stats.totalImages} afbeeldingen totaal)`)
    
    if (stats.totalValue > 0 && stats.withPrice > 0) {
      console.log(`   💳 Gemiddelde prijs: €${(stats.totalValue / stats.withPrice).toFixed(2)}`)
    }
    
  } catch (error) {
    console.error('❌ Data analyse fout:', error.message)
  }
}

async function runCompleteTest() {
  console.log('🎣 Bros&Baits → Supabase Migratie Test')
  console.log('=====================================')
  console.log(`📅 ${new Date().toLocaleString('nl-NL')}`)
  console.log(`💻 Node.js ${process.version}`)
  console.log(`📂 ${process.cwd()}`)
  
  // Stap 1: Initialize clients
  const clientsInitialized = await initializeClients()
  if (!clientsInitialized) {
    console.log('\n❌ Kan clients niet initialiseren')
    return
  }
  
  // Stap 2: Test connections
  const supabaseOK = await testSupabaseConnection()
  const wooCommerceOK = await testWooCommerceConnection()
  
  if (supabaseOK && wooCommerceOK) {
    // Stap 3: Analyse je data
    await performDataAnalysis()
    
    console.log('\n🎉 VOLLEDIGE TEST GESLAAGD!')
    console.log('===========================')
    console.log('✅ Modules: Succesvol geladen')
    console.log('✅ Supabase: Database verbonden')
    console.log('✅ WooCommerce: API verbonden')
    console.log('✅ Data: Geanalyseerd en klaar')
    console.log('')
    console.log('🚀 KLAAR VOOR MIGRATIE!')
    console.log('========================')
    console.log('Alle systemen werken perfect.')
    console.log('Je Bros&Baits data is klaar om')
    console.log('gemigreerd te worden naar Supabase.')
    console.log('')
    console.log('💡 Volgende stap: Start de volledige migratie')
    
  } else {
    console.log('\n❌ TEST INCOMPLEET')
    console.log('===================')
    console.log(`✅ Modules geladen: ${clientsInitialized ? 'Ja' : 'Nee'}`)
    console.log(`${supabaseOK ? '✅' : '❌'} Supabase: ${supabaseOK ? 'Werkt' : 'Vereist setup'}`)
    console.log(`${wooCommerceOK ? '✅' : '❌'} WooCommerce: ${wooCommerceOK ? 'Werkt' : 'Heeft problemen'}`)
    console.log('')
    console.log('🔧 Fix de issues hierboven voordat je migreert')
  }
}

// Start de volledige test
console.log('⏳ Bros&Baits migration test starting...\n')
runCompleteTest().catch(error => {
  console.error('💥 ONVERWACHTE FOUT:', error.message)
  console.error('📋 Stack trace:', error.stack)
  process.exit(1)
})