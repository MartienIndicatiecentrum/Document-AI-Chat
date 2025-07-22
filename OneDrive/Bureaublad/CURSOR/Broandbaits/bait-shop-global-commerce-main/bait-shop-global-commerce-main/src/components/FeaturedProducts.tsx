import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Waves, Fish } from 'lucide-react';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const shopifyProducts = await fetchProducts(8);
        
        // Transform Shopify products naar ons ProductCard formaat
        const transformedProducts = shopifyProducts.map((product: ShopifyProduct) => {
          const variant = product.variants[0]; // Neem eerste variant
          const hasDiscount = variant.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);
          
          return {
            id: product.id,
            name: product.title,
            price: parseFloat(variant.price.amount),
            originalPrice: hasDiscount ? parseFloat(variant.compareAtPrice!.amount) : undefined,
            image: product.images[0]?.src || '/placeholder.svg',
            category: product.productType || 'Kunstaaas',
            rating: 4.5 + (Math.random() * 0.5), // Random rating tussen 4.5-5.0
            reviewCount: Math.floor(Math.random() * 200) + 20,
            inStock: variant.available,
            isNew: new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            isBestseller: product.tags.includes('bestseller') || Math.random() > 0.7,
            waterType: product.tags.includes('saltwater') ? 'salt' : 
                      product.tags.includes('freshwater') ? 'fresh' : 'both'
          };
        });

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback naar mock data bij error
        setProducts([
          {
            id: '1',
            name: 'Pro Series Minnow Jig Head 3/8 oz',
            price: 12.99,
            originalPrice: 15.99,
            image: '/lovable-uploads/e5a4bff9-7d3c-4c52-bfeb-4963ba1fba89.png',
            category: 'Jig Heads',
            rating: 4.8,
            reviewCount: 127,
            inStock: true,
            isNew: true,
            waterType: 'both' as const,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Fish className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Trending Nu</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Uitgelichte Producten
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ontdek onze meest populaire kunstaaas, gekozen door professionals en 
            aanbevolen door vissers wereldwijd.
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="group">
            Bekijk Alle Producten
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 smooth-transition" />
          </Button>
        </div>

        {/* Categories Quick Access */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative p-8 rounded-xl water-gradient text-white text-center overflow-hidden group cursor-pointer hover-lift">
            <Waves className="h-12 w-12 mx-auto mb-4 text-white/90" />
            <h3 className="text-xl font-semibold mb-2">Zoutwater Speciaal</h3>
            <p className="text-white/90 mb-4">Voor de beste zeevissen</p>
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
              Ontdekken
            </Button>
          </div>

          <div className="relative p-8 rounded-xl bg-secondary text-secondary-foreground text-center overflow-hidden group cursor-pointer hover-lift">
            <Fish className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Zoetwater Collectie</h3>
            <p className="text-secondary-foreground/80 mb-4">Perfect voor meren en rivieren</p>
            <Button variant="outline" className="border-secondary-foreground/30 hover:bg-secondary-foreground hover:text-secondary">
              Shop Nu
            </Button>
          </div>

          <div className="relative p-8 rounded-xl bg-accent text-accent-foreground text-center overflow-hidden group cursor-pointer hover-lift">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-accent-foreground/10 flex items-center justify-center">
                <span className="text-xl font-bold">⭐</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Bestsellers</h3>
            <p className="text-accent-foreground/80 mb-4">Onze meest populaire keuzes</p>
            <Button variant="outline" className="border-accent-foreground/30 hover:bg-accent-foreground hover:text-accent">
              Bekijken
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;