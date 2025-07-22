import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  CreditCard,
  Truck,
  Shield,
  Globe
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold font-poppins">
                <span className="primary-gradient bg-clip-text text-transparent">BROS</span>
                <span className="text-secondary">&</span>
                <span className="primary-gradient bg-clip-text text-transparent">BAITS</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Jouw vertrouwde partner voor premium kunstaaas. Van handgeselecteerde lures 
              tot expert advies - wij helpen je de perfecte vangst te maken.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@brosandbaits.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+31 (0) 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Amsterdam, Nederland</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Snelle Links</h3>
            <ul className="space-y-3">
              {[
                'Alle Producten',
                'Bestsellers',
                'Nieuwe Collectie',
                'Sale Items',
                'Gift Cards',
                'Size Guide'
              ].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary smooth-transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Categorieën</h3>
            <ul className="space-y-3">
              {[
                'Soft Plastics',
                'Hard Baits',
                'Jig Heads',
                'Spinnerbaits',
                'Accessories',
                'Rod Holders'
              ].map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary smooth-transition"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Klantenservice</h3>
            <ul className="space-y-3">
              {[
                'Contact',
                'Verzending',
                'Retourneren',
                'Size Guide',
                'FAQ',
                'Track Order'
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary smooth-transition"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Language Selector */}
            <div className="pt-4">
              <Button variant="outline" size="sm" className="w-full">
                <Globe className="h-4 w-4 mr-2" />
                Nederlands (NL)
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Truck className="h-8 w-8 text-primary" />
              <div className="text-sm font-medium">Gratis Verzending</div>
              <div className="text-xs text-muted-foreground">Vanaf €75</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-sm font-medium">30 Dagen Garantie</div>
              <div className="text-xs text-muted-foreground">Geld terug</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CreditCard className="h-8 w-8 text-primary" />
              <div className="text-sm font-medium">Veilig Betalen</div>
              <div className="text-xs text-muted-foreground">SSL Beveiligd</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Phone className="h-8 w-8 text-primary" />
              <div className="text-sm font-medium">24/7 Support</div>
              <div className="text-xs text-muted-foreground">Expert hulp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t bg-muted/30">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} Bros&Baits. Alle rechten voorbehouden.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'YouTube' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-primary smooth-transition"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary smooth-transition">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary smooth-transition">
                Voorwaarden
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary smooth-transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;