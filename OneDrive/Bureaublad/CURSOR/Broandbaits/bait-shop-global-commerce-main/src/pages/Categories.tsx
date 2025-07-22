import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Fish, Anchor, Wrench, Package, Target, Waves } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Categories = () => {
  const categories = [
    {
      id: 'jighead-hooks',
      name: 'Jighead Hooks',
      description: 'Professionele jighead hooks voor alle vissoorten',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      icon: Target,
      productCount: 24,
      waterTypes: ['fresh', 'salt'],
      featured: true
    },
    {
      id: 'jigs',
      name: 'Jigs & Lures',
      description: 'Hoogwaardige jigs en kunstaas voor roofvissen',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      icon: Fish,
      productCount: 18,
      waterTypes: ['fresh', 'salt'],
      featured: true
    },
    {
      id: 'tools',
      name: 'Vis Tools',
      description: 'Professionele tools voor elke visser',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      icon: Wrench,
      productCount: 15,
      waterTypes: ['both'],
      featured: false
    },
    {
      id: 'leaders',
      name: 'Leaders & Lines',
      description: 'Sterke leaders en lijnen voor zware vissen',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      icon: Anchor,
      productCount: 32,
      waterTypes: ['fresh', 'salt', 'both'],
      featured: true
    },
    {
      id: 'storage',
      name: 'Opslag & Transport',
      description: 'Tackle boxes en opslag oplossingen',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      icon: Package,
      productCount: 12,
      waterTypes: ['both'],
      featured: false
    },
    {
      id: 'saltwater',
      name: 'Zoutwater Specials',
      description: 'Speciaal voor zeevis en zoutwater',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      icon: Waves,
      productCount: 28,
      waterTypes: ['salt'],
      featured: true
    }
  ];

  const waterTypeLabels = {
    fresh: 'Zoetwater',
    salt: 'Zoutwater',
    both: 'Universeel'
  };

  const waterTypeColors = {
    fresh: 'border-blue-200 text-blue-700',
    salt: 'border-green-200 text-green-700',
    both: 'border-purple-200 text-purple-700'
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-primary">Home</a>
          <span>/</span>
          <span className="text-foreground">Categorieën</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Product Categorieën</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ontdek ons uitgebreide assortiment aan visbenodigdheden, 
            georganiseerd per categorie voor jouw gemak.
          </p>
        </div>

        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Uitgelichte Categorieën</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(cat => cat.featured).map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-900">
                        {category.productCount} producten
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.waterTypes.map((type) => (
                        <Badge
                          key={type}
                          variant="outline"
                          className={waterTypeColors[type as keyof typeof waterTypeColors]}
                        >
                          {waterTypeLabels[type as keyof typeof waterTypeLabels]}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Bekijk Producten
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* All Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Alle Categorieën</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <Badge variant="secondary">
                            {category.productCount}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3">
                          {category.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {category.waterTypes.map((type) => (
                            <Badge
                              key={type}
                              variant="outline"
                              className={`text-xs ${waterTypeColors[type as keyof typeof waterTypeColors]}`}
                            >
                              {waterTypeLabels[type as keyof typeof waterTypeLabels]}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Bekijk Categorie
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Niet gevonden wat je zoekt?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Ons team staat klaar om je te helpen het perfecte product te vinden. 
                Neem contact met ons op voor persoonlijk advies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Neem Contact Op
                </Button>
                <Button variant="outline" size="lg">
                  Bekijk Alle Producten
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
