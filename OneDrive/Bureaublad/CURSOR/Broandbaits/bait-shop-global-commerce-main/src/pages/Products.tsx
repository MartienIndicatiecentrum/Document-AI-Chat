import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWaterType, setSelectedWaterType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data voor producten
  const products = [
    {
      id: '1',
      name: 'Jighead hooks 5 gram',
      price: 12.99,
      originalPrice: 15.99,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
      category: 'Jighead hooks',
      rating: 4.8,
      reviewCount: 127,
      inStock: true,
      isNew: true,
      isBestseller: true,
      waterType: 'fresh' as const
    },
    {
      id: '2',
      name: 'Hook remover Professional',
      price: 8.99,
      originalPrice: 12.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Tools',
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      waterType: 'both' as const
    },
    {
      id: '3',
      name: 'Bass Jigger Premium',
      price: 6.49,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
      category: 'Jigs',
      rating: 4.7,
      reviewCount: 156,
      inStock: true,
      isBestseller: true,
      waterType: 'fresh' as const
    },
    {
      id: '4',
      name: 'Steel String Leaders',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      category: 'Leaders',
      rating: 4.9,
      reviewCount: 203,
      inStock: true,
      isNew: true,
      waterType: 'both' as const
    },
    {
      id: '5',
      name: 'Jighead hooks 10 gram',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
      category: 'Jighead hooks',
      rating: 4.5,
      reviewCount: 94,
      inStock: true,
      waterType: 'fresh' as const
    },
    {
      id: '6',
      name: 'Jighead hooks 14 gram',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
      category: 'Jighead hooks',
      rating: 4.6,
      reviewCount: 78,
      inStock: false,
      waterType: 'fresh' as const
    },
    {
      id: '7',
      name: 'Saltwater Jig Set',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      category: 'Jigs',
      rating: 4.8,
      reviewCount: 145,
      inStock: true,
      isBestseller: true,
      waterType: 'salt' as const
    },
    {
      id: '8',
      name: 'Universal Tackle Box',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Storage',
      rating: 4.4,
      reviewCount: 67,
      inStock: true,
      isNew: true,
      waterType: 'both' as const
    }
  ];

  const categories = [
    { id: 'all', name: 'Alle Categorieën', count: products.length },
    { id: 'jighead-hooks', name: 'Jighead Hooks', count: 3 },
    { id: 'jigs', name: 'Jigs', count: 2 },
    { id: 'tools', name: 'Tools', count: 1 },
    { id: 'leaders', name: 'Leaders', count: 1 },
    { id: 'storage', name: 'Opslag', count: 1 }
  ];

  const waterTypes = [
    { id: 'all', name: 'Alle Watertypes' },
    { id: 'fresh', name: 'Zoetwater' },
    { id: 'salt', name: 'Zoutwater' },
    { id: 'both', name: 'Universeel' }
  ];

  const sortOptions = [
    { id: 'featured', name: 'Aanbevolen' },
    { id: 'price-low', name: 'Prijs: Laag naar Hoog' },
    { id: 'price-high', name: 'Prijs: Hoog naar Laag' },
    { id: 'rating', name: 'Hoogst Beoordeeld' },
    { id: 'newest', name: 'Nieuwste' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-primary">Home</a>
          <span>/</span>
          <span className="text-foreground">Producten</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Alle Producten</h1>
          <p className="text-muted-foreground">
            Ontdek ons volledige assortiment aan hoogwaardige visbenodigdheden voor zoet- en zoutwater.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Zoeken</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Zoek producten..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Categorieën</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Water Type */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Watertype</h3>
                <div className="space-y-2">
                  {waterTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedWaterType(type.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedWaterType === type.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Prijsbereik</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setPriceRange([0, 25])}
                    >
                      €0 - €25
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setPriceRange([25, 50])}
                    >
                      €25 - €50
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setPriceRange([50, 100])}
                    >
                      €50+
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-muted-foreground">
                {products.length} producten gevonden
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sorteer op:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border rounded px-3 py-1"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center border rounded">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            )}>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button variant="outline" disabled>
                Vorige
              </Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">
                Volgende
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
