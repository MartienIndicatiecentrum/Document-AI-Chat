import { Button } from '@/components/ui/button';
import { 
  Truck, 
  Shield, 
  Headphones, 
  Globe, 
  Award, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Globe,
      title: 'Wereldwijde Verzending',
      description: 'Snelle en betrouwbare levering naar Europa, Amerika en Canada. Gratis verzending vanaf €75.',
      highlight: '150+ landen'
    },
    {
      icon: Award,
      title: 'Premium Kwaliteit',
      description: 'Handgeselecteerde kunstaaas van vertrouwde leveranciers. Elke lure wordt getest door professionals.',
      highlight: 'Getest & Goedgekeurd'
    },
    {
      icon: Shield,
      title: 'Kwaliteitsgarantie',
      description: '30 dagen geld-terug-garantie. Niet tevreden? Wij zorgen voor een volledige terugbetaling.',
      highlight: '30 dagen garantie'
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Persoonlijk advies van ervaren vissers. Wij helpen je de perfecte kunstaaas te vinden.',
      highlight: '24/7 beschikbaar'
    },
    {
      icon: Clock,
      title: 'Snelle Levering',
      description: 'Besteld voor 14:00? Vandaag nog verzonden. Express levering binnen 24-48 uur mogelijk.',
      highlight: 'Zelfde dag verzending'
    },
    {
      icon: Star,
      title: 'Vertrouwd Merk',
      description: 'Meer dan 10.000 tevreden klanten wereldwijd. Beoordeeld met 4.8/5 sterren.',
      highlight: '4.8★ rating'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-6">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Waarom Bros&Baits</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-6">
            Jouw Partner in
            <span className="primary-gradient bg-clip-text text-transparent"> Succesvol Vissen</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Van beginners tot professionals - wij bieden de beste kunstaaas en service 
            om jouw visavontuur naar een hoger niveau te tillen.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative p-8 bg-background rounded-xl border hover-lift elegant-shadow"
              >
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl primary-gradient group-hover:glow-shadow smooth-transition">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  {/* Highlight Badge */}
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                    {feature.highlight}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary smooth-transition">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold primary-gradient bg-clip-text text-transparent mb-2">
                10,000+
              </div>
              <div className="text-sm text-muted-foreground">Tevreden Klanten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold primary-gradient bg-clip-text text-transparent mb-2">
                150+
              </div>
              <div className="text-sm text-muted-foreground">Landen Wereldwijd</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold primary-gradient bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-sm text-muted-foreground">Premium Producten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold primary-gradient bg-clip-text text-transparent mb-2">
                4.8★
              </div>
              <div className="text-sm text-muted-foreground">Gemiddelde Beoordeling</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Klaar om je vangst te verbeteren?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join duizenden vissers die al vertrouwen op Bros&Baits voor hun beste vangsten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Start Shopping
                <CheckCircle className="h-5 w-5 ml-2 group-hover:scale-110 smooth-transition" />
              </Button>
              <Button variant="outline" size="lg">
                Lees Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;