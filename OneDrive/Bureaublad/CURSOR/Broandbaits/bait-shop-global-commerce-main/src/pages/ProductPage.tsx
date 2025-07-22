import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  Share2, 
  Truck,
  Shield,
  RotateCcw,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState('5g');

  // Sample product data - in a real app this would come from props or API
  const product = {
    id: '1',
    name: 'Jighead hooks 5 gram - Premium Freshwater Bait',
    price: 12.99,
    originalPrice: 15.99,
    category: 'Jighead hooks',
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    isNew: true,
    isBestseller: true,
    waterType: 'fresh' as const,
    description: 'Hoogwaardige jighead hooks speciaal ontworpen voor zoetwater vissen. Deze premium haakjes bieden uitstekende haakvastheid en zijn perfect voor het vangen van baars, snoek en andere roofvissen.',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop'
    ],
    weights: ['3g', '5g', '7g', '10g', '14g'],
    features: [
      'Scherpe en duurzame haken',
      'Optimaal gewicht voor perfecte presentatie',
      'Geschikt voor verschillende vissoorten',
      'Hoogwaardige coating tegen corrosie',
      'Professionele kwaliteit'
    ],
    specifications: {
      'Gewicht': '5 gram',
      'Haakgrootte': '#2',
      'Materiaal': 'Hoogwaardig staal',
      'Coating': 'Anti-corrosie',
      'Watertype': 'Zoetwater',
      'Verpakking': '10 stuks'
    }
  };

  const relatedProducts = [
    {
      id: '2',
      name: 'Hook remover - Professional Tool',
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
    }
  ];

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-primary">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-primary">Producten</a>
          <span>/</span>
          <a href="/products/freshwater" className="hover:text-primary">Zoetwater</a>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index 
                      ? "border-primary" 
                      : "border-transparent hover:border-muted-foreground"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <Badge className="bg-secondary text-secondary-foreground">
                  Nieuw
                </Badge>
              )}
              {product.isBestseller && (
                <Badge className="bg-accent text-accent-foreground">
                  Bestseller
                </Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive">
                  -{discount}% KORTING
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className="border-blue-200 text-blue-700"
              >
                Zoetwater
              </Badge>
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(product.rating) 
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} beoordelingen)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Weight Selection */}
            <div>
              <h3 className="font-semibold mb-3">Gewicht selecteren:</h3>
              <div className="flex flex-wrap gap-2">
                {product.weights.map((weight) => (
                  <Button
                    key={weight}
                    variant={selectedWeight === weight ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWeight(weight)}
                  >
                    {weight}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.inStock ? (
                    <span className="text-secondary font-medium flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Op voorraad
                    </span>
                  ) : (
                    <span className="text-destructive">Uitverkocht</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  In winkelwagen - €{(product.price * quantity).toFixed(2)}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={cn(isWishlisted && "text-red-500")}
                >
                  <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product kenmerken:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-secondary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Gratis verzending</div>
                  <div className="text-muted-foreground">Vanaf €25</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">2 jaar garantie</div>
                  <div className="text-muted-foreground">Op alle producten</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">30 dagen retour</div>
                  <div className="text-muted-foreground">Geen vragen</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Beschrijving</TabsTrigger>
            <TabsTrigger value="specifications">Specificaties</TabsTrigger>
            <TabsTrigger value="reviews">Beoordelingen ({product.reviewCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-8">
            <Card>
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Product beschrijving</h3>
                  <p className="mb-4">
                    Deze premium jighead hooks zijn speciaal ontworpen voor de serieuze zoetwater visser. 
                    Met hun perfecte gewichtsverdeling en scherpe haken bieden ze uitstekende prestaties 
                    bij het vissen op baars, snoek, snoekbaars en andere roofvissen.
                  </p>
                  <p className="mb-4">
                    De haken zijn gemaakt van hoogwaardig staal en voorzien van een speciale coating 
                    die beschermt tegen corrosie. Dit zorgt voor een lange levensduur, zelfs bij 
                    intensief gebruik in verschillende weersomstandigheden.
                  </p>
                  <h4 className="text-lg font-semibold mb-2">Gebruikstips:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Perfect voor gebruik met softbaits en gummivissen</li>
                    <li>Ideaal voor verticaal jiggen en casting</li>
                    <li>Geschikt voor dieptes van 2-15 meter</li>
                    <li>Combineer met verschillende kleuren softbaits voor optimaal resultaat</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-8">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">Technische specificaties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Klantbeoordelingen</h3>
                  <Button variant="outline">Beoordeling schrijven</Button>
                </div>
                
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-8 p-6 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{product.rating}</div>
                      <div className="flex items-center justify-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(product.rating) 
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {product.reviewCount} beoordelingen
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm w-8">{stars}★</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ 
                                  width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">
                              {stars === 5 ? 89 : stars === 4 ? 25 : stars === 3 ? 9 : stars === 2 ? 3 : 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">Jan V.</span>
                        <span className="text-sm text-muted-foreground">2 dagen geleden</span>
                      </div>
                      <p className="text-sm">
                        Uitstekende kwaliteit! Deze jigheads werken perfect voor het vissen op baars. 
                        Scherpe haken en goede gewichtsverdeling. Zeker een aanrader!
                      </p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="font-medium">Peter K.</span>
                        <span className="text-sm text-muted-foreground">1 week geleden</span>
                      </div>
                      <p className="text-sm">
                        Goede prijs-kwaliteit verhouding. Heb er al verschillende snoekbaarzen mee gevangen. 
                        Enige minpunt is dat de coating soms wat snel afslijt.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Gerelateerde producten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
