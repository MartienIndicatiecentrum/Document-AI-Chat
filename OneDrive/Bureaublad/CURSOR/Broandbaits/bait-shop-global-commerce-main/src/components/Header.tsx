import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('NL');
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Producten', href: '/products' },
    { name: 'Categorieën', href: '/categories' },
    { name: 'Fishing Tips', href: '/blog' },
    { name: 'Over Ons', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleNavigation('/')}
            className="text-2xl font-bold font-poppins hover:opacity-80 transition-opacity"
          >
            <span className="primary-gradient bg-clip-text text-transparent">BROS</span>
            <span className="text-secondary">&</span>
            <span className="primary-gradient bg-clip-text text-transparent">BAITS</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "text-sm font-medium smooth-transition hover:text-primary",
                location.pathname === item.href && "text-primary"
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'NL' ? 'EN' : 'NL')}
            className="hidden sm:flex"
          >
            <Globe className="h-4 w-4" />
            {language}
          </Button>

          {/* Search */}
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative">
            <Heart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Account */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  handleNavigation(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "block text-sm font-medium smooth-transition hover:text-primary py-2 w-full text-left",
                  location.pathname === item.href && "text-primary"
                )}
              >
                {item.name}
              </button>
            ))}
            <div className="pt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'NL' ? 'EN' : 'NL')}
                className="w-full justify-start"
              >
                <Globe className="h-4 w-4 mr-2" />
                Taal: {language}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;