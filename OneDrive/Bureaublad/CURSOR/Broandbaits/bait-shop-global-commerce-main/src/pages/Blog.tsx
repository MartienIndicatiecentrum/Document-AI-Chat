import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  ArrowRight, 
  Fish, 
  Target, 
  Waves,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = [
    {
      id: '1',
      title: 'De Perfecte Jighead Techniek voor Baars',
      excerpt: 'Leer hoe je jigheads optimaal inzet voor het vangen van baars in verschillende seizoenen en omstandigheden.',
      content: 'Een uitgebreide gids over jighead technieken...',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      author: 'Marco van der Berg',
      publishDate: '2024-01-15',
      readTime: 8,
      category: 'Technieken',
      tags: ['jighead', 'baars', 'zoetwater'],
      featured: true,
      views: 1250
    },
    {
      id: '2',
      title: 'Zoutwater Vissen: Uitrusting en Tips',
      excerpt: 'Alles wat je moet weten over het vissen in zoutwater, van de juiste uitrusting tot de beste locaties.',
      content: 'Zoutwater vissen vereist specifieke kennis...',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      author: 'Lisa Janssen',
      publishDate: '2024-01-12',
      readTime: 12,
      category: 'Uitrusting',
      tags: ['zoutwater', 'uitrusting', 'tips'],
      featured: true,
      views: 980
    },
    {
      id: '3',
      title: 'Seizoensgebonden Vistechnieken',
      excerpt: 'Hoe pas je je vistechnieken aan per seizoen voor optimale resultaten het hele jaar door.',
      content: 'Elk seizoen brengt unieke uitdagingen...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      author: 'Jan Pieterse',
      publishDate: '2024-01-10',
      readTime: 6,
      category: 'Technieken',
      tags: ['seizoenen', 'technieken', 'planning'],
      featured: false,
      views: 756
    },
    {
      id: '4',
      title: 'De Beste Vislocaties in Nederland',
      excerpt: 'Ontdek de meest productieve viswateren in Nederland en wat je er kunt verwachten.',
      content: 'Nederland heeft prachtige viswateren...',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      author: 'Piet de Visser',
      publishDate: '2024-01-08',
      readTime: 10,
      category: 'Locaties',
      tags: ['nederland', 'locaties', 'hotspots'],
      featured: false,
      views: 1100
    },
    {
      id: '5',
      title: 'Onderhoud van je Visspullen',
      excerpt: 'Praktische tips voor het onderhouden van je visuitrusting zodat het jaren meegaat.',
      content: 'Goed onderhoud verlengt de levensduur...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      author: 'Sandra Bakker',
      publishDate: '2024-01-05',
      readTime: 5,
      category: 'Onderhoud',
      tags: ['onderhoud', 'uitrusting', 'tips'],
      featured: false,
      views: 623
    },
    {
      id: '6',
      title: 'Beginnersgids: Je Eerste Visdag',
      excerpt: 'Alles wat beginnende vissers moeten weten voor hun eerste succesvolle visdag.',
      content: 'Beginnen met vissen kan overweldigend zijn...',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      author: 'Tom Hendriks',
      publishDate: '2024-01-03',
      readTime: 15,
      category: 'Beginners',
      tags: ['beginners', 'gids', 'eerste-keer'],
      featured: true,
      views: 1890
    }
  ];

  const categories = [
    { id: 'all', name: 'Alle Artikelen', icon: BookOpen },
    { id: 'technieken', name: 'Technieken', icon: Target },
    { id: 'uitrusting', name: 'Uitrusting', icon: Fish },
    { id: 'locaties', name: 'Locaties', icon: Waves },
    { id: 'beginners', name: 'Beginners', icon: User },
    { id: 'onderhoud', name: 'Onderhoud', icon: TrendingUp }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.category.toLowerCase() === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-primary">Home</a>
          <span>/</span>
          <span className="text-foreground">Fishing Tips</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Fishing Tips & Gidsen</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ontdek de beste vistechnieken, locaties en tips van onze experts. 
            Van beginner tot professional - hier vind je alles wat je nodig hebt.
          </p>
        </div>

        {/* Search and Categories */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Search */}
          <div className="lg:w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek artikelen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="lg:w-2/3">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {selectedCategory === 'all' && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Uitgelichte Artikelen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        Uitgelicht
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.publishDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Lees Meer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'Alle Artikelen' : `${categories.find(c => c.id === selectedCategory)?.name} Artikelen`}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} artikel{filteredPosts.length !== 1 ? 'en' : ''} gevonden
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="outline" className="bg-white/90 text-gray-900">
                      {post.views} views
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} min
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Lees Meer
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Blijf op de hoogte!</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Ontvang wekelijks de nieuwste fishing tips, productnieuws en exclusieve aanbiedingen 
                rechtstreeks in je inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input placeholder="Je email adres" className="flex-1" />
                <Button>
                  Inschrijven
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

export default Blog;
