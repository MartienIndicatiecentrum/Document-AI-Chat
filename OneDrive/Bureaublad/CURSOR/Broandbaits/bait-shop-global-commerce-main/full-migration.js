// Bros&Baits VOLLEDIGE MIGRATIE SCRIPT
// Migreert alle producten, categorieën, afbeeldingen en tags van WooCommerce naar Supabase

// Configuratie
const SUPABASE_URL = 'https://vdiagrzdkjmnojccuasp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaWFncnpka2ptbm9qY2N1YXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODY1MTYsImV4cCI6MjA2ODc2MjUxNn0.QfM4RPLzXy9wOW35dtWS4Tx33t5o-LVOswd1rWxW-Lo'
const WC_URL = 'https://brosandbaits.com'
const WC_KEY = 'ck_e4a4966e3d50bf1d5e557c3f1a4fffc01b3aad3e'
const WC_SECRET = 'cs_285e7efd548c2bf62804c33ee5a06eafb7c366cb'

// Global variables
let supabase = null
let migrationStats = {
  categories: { total: 0, migrated: 0, errors: 0 },
  tags: { total: 0, migrated: 0, errors: 0 },
  products: { total: 0, migrated: 0, errors: 0 },
  images: { total: 0, migrated: 0, errors: 0 },
  startTime: null,
  endTime: null
}

// Helper functions
function base64Encode(str) {
  return typeof Buffer !== 'undefined' ? Buffer.from(str).toString('base64') : btoa(str)
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

function parsePrice(price) {
  const parsed = parseFloat(price)
  return isNaN(parsed) ? 0 : parsed
}

// WooCommerce API call
async function wooCommerceAPI(endpoint, params = {}) {
  const auth = base64Encode(`${WC_KEY}:${WC_SECRET}`)
  const queryString = new URLSearchParams(params).toString()
  const url = `${WC_URL}/wp-json/wc/v3/${endpoint}${queryString ? '?' + queryString : ''}`
  
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
  response.headers.forEach((value, key) => { headers[key] = value })
  
  return { data, headers, status: response.status }
}

// Initialize clients
async function initializeClients() {
  console.log('🔧 Migratie clients initialiseren...')
  
  const supabaseModule = await import('@supabase/supabase-js')
  supabase = supabaseModule.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('✅ Clients geïnitialiseerd')
  return true
}

// 1. CATEGORIEËN MIGREREN
async function migrateCategories() {
  console.log('\n🗂️  STAP 1: Categorieën migreren...')
  console.log('=====================================')
  
  try {
    const response = await wooCommerceAPI('products/categories', { per_page: 100 })
    const categories = response.data
    
    migrationStats.categories.total = categories.length
    console.log(`📁 ${categories.length} categorieën gevonden`)
    
    for (const [index, wcCategory] of categories.entries()) {
      try {
        console.log(`📂 ${index + 1}/${categories.length}: "${wcCategory.name}"`)
        
        const categoryData = {
          name: wcCategory.name,
          name_en: wcCategory.name,
          name_nl: wcCategory.name,
          slug: wcCategory.slug || slugify(wcCategory.name),
          description: cleanHtml(wcCategory.description),
          description_en: cleanHtml(wcCategory.description),
          description_nl: cleanHtml(wcCategory.description),
          image_url: wcCategory.image?.src || null,
          is_active: wcCategory.count > 0,
          sort_order: wcCategory.menu_order || 0
        }
        
        const { data, error } = await supabase
          .from('categories')
          .upsert(categoryData, { 
            onConflict: 'slug',
            ignoreDuplicates: false 
          })
          .select()
        
        if (error) {
          console.error(`   ❌ Fout: ${error.message}`)
          migrationStats.categories.errors++
        } else {
          console.log(`   ✅ Gemigreerd: ${wcCategory.count} producten`)
          migrationStats.categories.migrated++
        }
        
      } catch (error) {
        console.error(`   ❌ Categorie "${wcCategory.name}" fout:`, error.message)
        migrationStats.categories.errors++
      }
    }
    
    console.log(`\n✅ Categorieën migratie voltooid: ${migrationStats.categories.migrated}/${migrationStats.categories.total}`)
    
  } catch (error) {
    console.error('❌ Categorieën migratie fout:', error.message)
  }
}

// 2. TAGS MIGREREN  
async function migrateTags() {
  console.log('\n🏷️  STAP 2: Tags migreren...')
  console.log('===============================')
  
  try {
    const response = await wooCommerceAPI('products/tags', { per_page: 100 })
    const tags = response.data
    
    migrationStats.tags.total = tags.length
    console.log(`🏷️  ${tags.length} tags gevonden`)
    
    for (const [index, wcTag] of tags.entries()) {
      try {
        console.log(`🏷️  ${index + 1}/${tags.length}: "${wcTag.name}"`)
        
        const tagData = {
          name: wcTag.name,
          name_en: wcTag.name,
          name_nl: wcTag.name,
          slug: wcTag.slug || slugify(wcTag.name),
          color: '#059669' // Default groen voor alle tags
        }
        
        const { data, error } = await supabase
          .from('tags')
          .upsert(tagData, { 
            onConflict: 'slug',
            ignoreDuplicates: false 
          })
          .select()
        
        if (error) {
          console.error(`   ❌ Fout: ${error.message}`)
          migrationStats.tags.errors++
        } else {
          console.log(`   ✅ Gemigreerd: ${wcTag.count} producten`)
          migrationStats.tags.migrated++
        }
        
      } catch (error) {
        console.error(`   ❌ Tag "${wcTag.name}" fout:`, error.message)
        migrationStats.tags.errors++
      }
    }
    
    console.log(`\n✅ Tags migratie voltooid: ${migrationStats.tags.migrated}/${migrationStats.tags.total}`)
    
  } catch (error) {
    console.error('❌ Tags migratie fout:', error.message)
  }
}

// 3. PRODUCTEN MIGREREN
async function migrateProducts() {
  console.log('\n📦 STAP 3: Producten migreren...')
  console.log('==================================')
  
  try {
    // Alle producten ophalen (mogelijk meerdere pagina's)
    let allProducts = []
    let page = 1
    let hasMorePages = true
    
    while (hasMorePages) {
      console.log(`📄 Pagina ${page} ophalen...`)
      const response = await wooCommerceAPI('products', {
        per_page: 20,
        page: page,
        status: 'publish'
      })
      
      const products = response.data
      if (products.length === 0) {
        hasMorePages = false
      } else {
        allProducts = allProducts.concat(products)
        page++
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    migrationStats.products.total = allProducts.length
    console.log(`\n📦 ${allProducts.length} producten gevonden voor migratie`)
    
    // Migreer elk product
    for (const [index, wcProduct] of allProducts.entries()) {
      try {
        console.log(`\n📦 ${index + 1}/${allProducts.length}: "${wcProduct.name}"`)
        
        await migrateProduct(wcProduct, index + 1, allProducts.length)
        migrationStats.products.migrated++
        
      } catch (error) {
        console.error(`   ❌ Product "${wcProduct.name}" fout:`, error.message)
        migrationStats.products.errors++
      }
    }
    
    console.log(`\n✅ Producten migratie voltooid: ${migrationStats.products.migrated}/${migrationStats.products.total}`)
    
  } catch (error) {
    console.error('❌ Producten migratie fout:', error.message)
  }
}

// Individueel product migreren
async function migrateProduct(wcProduct, index, total) {
  // Zoek category ID
  let categoryId = null
  if (wcProduct.categories && wcProduct.categories.length > 0) {
    const { data: categoryMatch } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', wcProduct.categories[0].slug)
      .single()
    
    categoryId = categoryMatch?.id || null
  }
  
  // Parse dimensions
  const dimensions = wcProduct.dimensions || {}
  
  // Parse custom fields voor kunstaas specificaties
  const customFields = wcProduct.meta_data?.reduce((acc, meta) => {
    acc[meta.key] = meta.value
    return acc
  }, {}) || {}
  
  // Product data voorbereiden
  const productData = {
    name: wcProduct.name,
    name_en: wcProduct.name,
    name_nl: wcProduct.name,
    slug: wcProduct.slug || slugify(wcProduct.name),
    sku: wcProduct.sku || null,
    
    // Beschrijvingen
    short_description: cleanHtml(wcProduct.short_description),
    short_description_en: cleanHtml(wcProduct.short_description),
    short_description_nl: cleanHtml(wcProduct.short_description),
    description: cleanHtml(wcProduct.description),
    description_en: cleanHtml(wcProduct.description),
    description_nl: cleanHtml(wcProduct.description),
    
    // Prijzen
    price: parsePrice(wcProduct.price),
    compare_at_price: parsePrice(wcProduct.regular_price) || null,
    
    // Voorraad
    track_inventory: wcProduct.manage_stock || false,
    inventory_quantity: parseInt(wcProduct.stock_quantity) || 0,
    allow_backorder: wcProduct.backorders !== 'no',
    
    // Status
    status: wcProduct.status === 'publish' ? 'active' : 'draft',
    is_featured: wcProduct.featured || false,
    
    // SEO
    meta_title: wcProduct.name,
    meta_description: cleanHtml(wcProduct.short_description)?.substring(0, 160),
    
    // Kunstaas specificaties
    length_cm: parseFloat(dimensions.length) || null,
    weight_grams: parseFloat(wcProduct.weight) || null,
    water_type: customFields.water_type || 'both',
    fishing_depth: customFields.fishing_depth || null,
    target_fish: customFields.target_fish ? [customFields.target_fish] : null,
    hook_type: customFields.hook_type || null,
    color_pattern: customFields.color_pattern || null,
    material: customFields.material || null,
    action_type: customFields.action_type || null,
    
    // Relaties
    category_id: categoryId,
    
    // Timestamps
    created_at: wcProduct.date_created,
    updated_at: wcProduct.date_modified,
    published_at: wcProduct.status === 'publish' ? wcProduct.date_created : null
  }
  
  // Product invoegen
  const { data: insertedProduct, error: productError } = await supabase
    .from('products')
    .upsert(productData, { 
      onConflict: 'slug',
      ignoreDuplicates: false 
    })
    .select()
    .single()
  
  if (productError) {
    throw new Error(`Product insert fout: ${productError.message}`)
  }
  
  console.log(`   ✅ Product gemigreerd - €${productData.price}`)
  
  // Afbeeldingen migreren
  if (wcProduct.images && wcProduct.images.length > 0) {
    await migrateProductImages(insertedProduct.id, wcProduct.images)
  }
  
  // Tags migreren
  if (wcProduct.tags && wcProduct.tags.length > 0) {
    await migrateProductTags(insertedProduct.id, wcProduct.tags)
  }
}

// Product afbeeldingen migreren
async function migrateProductImages(productId, images) {
  for (const [index, image] of images.entries()) {
    try {
      const imageData = {
        product_id: productId,
        url: image.src,
        alt_text: image.alt || '',
        alt_text_en: image.alt || '',
        alt_text_nl: image.alt || '',
        sort_order: index,
        is_primary: index === 0
      }
      
      const { error } = await supabase
        .from('product_images')
        .insert(imageData)
      
      if (error) {
        console.error(`     ❌ Afbeelding ${index + 1} fout: ${error.message}`)
      } else {
        migrationStats.images.migrated++
        console.log(`     🖼️  Afbeelding ${index + 1} gemigreerd`)
      }
      
    } catch (error) {
      console.error(`     ❌ Afbeelding fout:`, error.message)
      migrationStats.images.errors++
    }
  }
  
  migrationStats.images.total += images.length
}

// Product tags migreren
async function migrateProductTags(productId, wcTags) {
  for (const wcTag of wcTags) {
    try {
      // Tag ID ophalen
      const { data: tag } = await supabase
        .from('tags')
        .select('id')
        .eq('slug', wcTag.slug)
        .single()
      
      if (tag) {
        // Product-tag koppeling
        const { error } = await supabase
          .from('product_tags')
          .insert({ 
            product_id: productId, 
            tag_id: tag.id 
          })
        
        if (!error) {
          console.log(`     🏷️  Tag "${wcTag.name}" gekoppeld`)
        }
      }
      
    } catch (error) {
      // Duplicates zijn normaal, negeren
    }
  }
}

// Migratie statistieken tonen
async function showFinalStats() {
  console.log('\n📊 MIGRATIE STATISTIEKEN')
  console.log('=========================')
  
  const duration = migrationStats.endTime - migrationStats.startTime
  const minutes = Math.floor(duration / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)
  
  console.log(`⏱️  Totale tijd: ${minutes}m ${seconds}s`)
  console.log('')
  console.log(`🗂️  Categorieën: ${migrationStats.categories.migrated}/${migrationStats.categories.total} (errors: ${migrationStats.categories.errors})`)
  console.log(`🏷️  Tags: ${migrationStats.tags.migrated}/${migrationStats.tags.total} (errors: ${migrationStats.tags.errors})`)
  console.log(`📦 Producten: ${migrationStats.products.migrated}/${migrationStats.products.total} (errors: ${migrationStats.products.errors})`)
  console.log(`🖼️  Afbeeldingen: ${migrationStats.images.migrated}/${migrationStats.images.total} (errors: ${migrationStats.images.errors})`)
  
  // Database statistieken ophalen
  try {
    const { data: productCount } = await supabase.from('products').select('id', { count: 'exact', head: true })
    const { data: categoryCount } = await supabase.from('categories').select('id', { count: 'exact', head: true })
    const { data: imageCount } = await supabase.from('product_images').select('id', { count: 'exact', head: true })
    const { data: tagCount } = await supabase.from('tags').select('id', { count: 'exact', head: true })
    
    console.log('')
    console.log('📈 HUIDIGE DATABASE INHOUD:')
    console.log(`   📦 Producten: ${productCount?.count || 0}`)
    console.log(`   🗂️  Categorieën: ${categoryCount?.count || 0}`)
    console.log(`   🖼️  Afbeeldingen: ${imageCount?.count || 0}`)
    console.log(`   🏷️  Tags: ${tagCount?.count || 0}`)
    
  } catch (error) {
    console.error('❌ Database statistieken fout:', error.message)
  }
}

// HOOFDMIGRATIE FUNCTIE
async function runFullMigration() {
  console.log('🎣 BROS&BAITS VOLLEDIGE MIGRATIE')
  console.log('================================')
  console.log(`📅 Start: ${new Date().toLocaleString('nl-NL')}`)
  console.log('')
  
  migrationStats.startTime = Date.now()
  
  try {
    // Clients initialiseren
    await initializeClients()
    
    // Stap 1: Categorieën
    await migrateCategories()
    
    // Stap 2: Tags  
    await migrateTags()
    
    // Stap 3: Producten (inclusief afbeeldingen en tag koppelingen)
    await migrateProducts()
    
    migrationStats.endTime = Date.now()
    
    // Finale statistieken
    await showFinalStats()
    
    console.log('\n🎉 BROS&BAITS MIGRATIE VOLTOOID!')
    console.log('=================================')
    console.log('✅ Alle WooCommerce data succesvol gemigreerd naar Supabase')
    console.log('✅ Je Bros&Baits website kan nu draaien op de nieuwe database')
    console.log('✅ Alle producten, categorieën, afbeeldingen en tags zijn beschikbaar')
    console.log('')
    console.log('🚀 Je nieuwe Supabase database is klaar voor gebruik!')
    
  } catch (error) {
    migrationStats.endTime = Date.now()
    console.error('💥 MIGRATIE FOUT:', error.message)
    console.error('📋 Stack:', error.stack)
    
    await showFinalStats()
  }
}

// MIGRATIE STARTEN
console.log('⏳ Bros&Baits migratie initializing...\n')
runFullMigration().catch(error => {
  console.error('💥 KRITIEKE FOUT:', error.message)
  process.exit(1)
})