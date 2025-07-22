import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import heroImage from '@/assets/fishing-hero.jpg';

const Hero = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Fishing at sunset" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Star className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium">Trusted by 10,000+ Anglers Worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins mb-6 leading-tight">
            BROS<span className="text-secondary">&</span>BAITS
          </h1>
          
          <p className="text-xl md:text-2xl font-medium mb-4 text-gray-100">
            MASTER YOUR CATCH WITH PRECISION BAITS FOR
          </p>
          <p className="text-xl md:text-2xl font-bold mb-8 text-accent">
            FRESH & SALTWATER
          </p>

          <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Handpicked kunstaaas van vertrouwde leveranciers wereldwijd. 
            Ontdek onze premium collectie voor elke vissoort en elk water.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              variant="hero" 
              size="hero" 
              className="group"
              onClick={() => handleNavigation('/products')}
            >
              Shop Nu
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 smooth-transition" />
            </Button>
            <Button 
              variant="outline" 
              size="hero" 
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary"
              onClick={() => handleNavigation('/categories')}
            >
              Bekijk Categorieën
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 text-white/90">
              <Truck className="h-6 w-6 text-secondary" />
              <span className="font-medium">Wereldwijde Verzending</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white/90">
              <Shield className="h-6 w-6 text-secondary" />
              <span className="font-medium">Kwaliteitsgarantie</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-white/90">
              <Headphones className="h-6 w-6 text-secondary" />
              <span className="font-medium">Expert Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;