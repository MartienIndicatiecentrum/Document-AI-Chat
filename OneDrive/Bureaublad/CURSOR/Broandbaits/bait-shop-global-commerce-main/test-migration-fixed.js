// Test script voor Bros&Baits migratie
// Eerst controleren of beide verbindingen werken

import { createClient } from '@supabase/supabase-js'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"

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
      console.log(`   - ${cat.name} (${cat.count} producten)`)
    })
    
    const productsResponse = await woocommerce.get('products', {
      per_page: 3,
      status: 'publish'
    })
    
    console.log(`\n📦 Sample producten:`)
    productsResponse.data.forEach(product => {
      console.log(`   - ${product.name}`)
      console.log(`     💰 ${product.price || 'Geen prijs'}`)
      console.log(`     📏 ${product.dimensions?.length || 'Geen lengte'} x ${product.dimensions?.width || 'Geen breedte'}`)
      console.log(`     ⚖️  ${product.weight || 'Geen gewicht'}`)
      console.log(`     🏷️  Tags: ${product.tags?.map(t => t.name).join(', ') || 'Geen tags'}`)
      console.log(`     🔗 ${product.permalink}`)
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
    console.log('\n🚀 Wil je de volledige migratie starten? (Y/N)')
    console.log('⚠️  Dit zal alle WooCommerce producten naar Supabase kopiëren.')
    
    // In een echte implementatie zou je hier user input vragen
    // Voor nu alleen de test draaien
  }
}

// Test uitvoeren
startMigration().catch(error => {
  console.error('💥 Test fout:', error)
})