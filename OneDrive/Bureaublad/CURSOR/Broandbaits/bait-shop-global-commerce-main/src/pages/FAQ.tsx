import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Package,
  Truck,
  CreditCard,
  RotateCcw,
  Shield,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  popular?: boolean;
}

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    scrollToTop();
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = [
    { id: 'all', name: 'Alle Vragen', icon: HelpCircle },
    { id: 'products', name: 'Producten', icon: Package },
    { id: 'shipping', name: 'Verzending', icon: Truck },
    { id: 'payment', name: 'Betaling', icon: CreditCard },
    { id: 'returns', name: 'Retourneren', icon: RotateCcw },
    { id: 'account', name: 'Account', icon: Shield }
  ];

  const faqItems: FAQItem[] = [
    // Populaire vragen
    {
      id: '1',
      category: 'products',
      question: 'Welke jighead gewichten zijn het meest populair?',
      answer: 'De meest populaire gewichten zijn 5g, 7g en 10g jigheads. Deze zijn ideaal voor de meeste Nederlandse wateren en vistechnieken. Voor ondiep water raden we 3-5g aan, voor dieper water 10-15g.',
      popular: true
    },
    {
      id: '2',
      category: 'products',
      question: 'Wat is het verschil tussen soft baits en hard baits?',
      answer: 'Soft baits zijn zachte kunstazen gemaakt van rubber of silicone, perfect voor jiggen en drop shot. Hard baits zijn harde kunstazen zoals plugs en spoons, ideaal voor spinnen en trolling. Beide hebben hun eigen toepassingen.',
      popular: true
    },
    {
      id: '3',
      category: 'shipping',
      question: 'Hoe snel wordt mijn bestelling geleverd?',
      answer: 'Bestellingen voor 15:00 worden dezelfde dag verzonden. Levering in Nederland duurt 1-2 werkdagen. Gratis verzending vanaf €50. Voor spoedeisende bestellingen bieden we ook express levering aan.',
      popular: true
    },

    // Producten
    {
      id: '4',
      category: 'products',
      question: 'Welke haakgroottes adviseren jullie voor snoekbaars?',
      answer: 'Voor snoekbaars adviseren we haakmaten 1/0 tot 4/0, afhankelijk van de aasgrootte. Voor kleine shads gebruik je 1/0-2/0, voor grotere baits 3/0-4/0. Onze jigheads zijn standaard voorzien van scherpe VMC haken.'
    },
    {
      id: '5',
      category: 'products',
      question: 'Zijn jullie producten geschikt voor zoutwater?',
      answer: 'Ja, veel van onze producten zijn geschikt voor zoutwater. Onze jigheads hebben een anti-corrosie coating en onze soft baits zijn zoutwater bestendig. Check altijd de productbeschrijving voor specifieke informatie.'
    },
    {
      id: '6',
      category: 'products',
      question: 'Hoe bewaar ik soft baits het beste?',
      answer: 'Bewaar soft baits op kamertemperatuur, uit direct zonlicht. Gebruik bij voorkeur de originele verpakking of een tackle box met compartimenten. Vermijd contact met hard plastic dat de baits kan beschadigen.'
    },

    // Verzending
    {
      id: '7',
      category: 'shipping',
      question: 'Verzenden jullie ook naar België?',
      answer: 'Ja, we verzenden naar heel Europa. Verzendkosten naar België zijn €7,50. Bestellingen boven €75 worden gratis verzonden. Levertijd is 2-4 werkdagen.'
    },
    {
      id: '8',
      category: 'shipping',
      question: 'Kan ik mijn bestelling volgen?',
      answer: 'Ja, zodra je bestelling is verzonden ontvang je een track & trace code per email. Hiermee kun je je pakket realtime volgen via de website van de vervoerder.'
    },
    {
      id: '9',
      category: 'shipping',
      question: 'Wat als ik niet thuis ben bij levering?',
      answer: 'Als je niet thuis bent, wordt het pakket bij een buurman of afhaalpunt bezorgd. Je ontvangt hiervan een kaartje in de brievenbus. Je kunt ook kiezen voor levering op een afhaalpunt.'
    },

    // Betaling
    {
      id: '10',
      category: 'payment',
      question: 'Welke betaalmethoden accepteren jullie?',
      answer: 'We accepteren iDEAL, creditcards (Visa, Mastercard), PayPal, Bancontact en SOFORT. Alle betalingen worden veilig verwerkt via onze beveiligde betaalomgeving.'
    },
    {
      id: '11',
      category: 'payment',
      question: 'Kan ik achteraf betalen?',
      answer: 'Ja, we bieden Klarna achteraf betalen aan voor bestellingen tot €500. Je betaalt dan binnen 30 dagen na ontvangst van je bestelling, zonder extra kosten.'
    },
    {
      id: '12',
      category: 'payment',
      question: 'Is mijn betaling veilig?',
      answer: 'Absoluut! We gebruiken SSL-encryptie en voldoen aan alle PCI-DSS veiligheidsnormen. Je betaalgegevens worden nooit opgeslagen op onze servers maar direct doorgestuurd naar de betaalprovider.'
    },

    // Retourneren
    {
      id: '13',
      category: 'returns',
      question: 'Kan ik mijn bestelling retourneren?',
      answer: 'Ja, je hebt 30 dagen bedenktijd. Producten moeten ongebruikt en in originele verpakking worden geretourneerd. Retourneren is gratis, je ontvangt een retourlabel per email.'
    },
    {
      id: '14',
      category: 'returns',
      question: 'Hoe lang duurt het voordat ik mijn geld terug krijg?',
      answer: 'Zodra we je retourzending hebben ontvangen en goedgekeurd, krijg je binnen 5-7 werkdagen je geld terug op dezelfde rekening als waarmee je hebt betaald.'
    },
    {
      id: '15',
      category: 'returns',
      question: 'Kan ik een product ruilen voor een andere maat/kleur?',
      answer: 'Ja, dat kan! Stuur het product terug met vermelding van de gewenste vervanging. We sturen het nieuwe product direct op zodra we je retour hebben ontvangen.'
    },

    // Account
    {
      id: '16',
      category: 'account',
      question: 'Moet ik een account aanmaken om te bestellen?',
      answer: 'Nee, je kunt ook als gast bestellen. Een account heeft wel voordelen: je kunt je bestellingen volgen, favorieten opslaan en sneller bestellen bij volgende aankopen.'
    },
    {
      id: '17',
      category: 'account',
      question: 'Hoe wijzig ik mijn accountgegevens?',
      answer: 'Log in op je account en ga naar "Mijn Profiel". Hier kun je al je gegevens wijzigen zoals adres, telefoonnummer en wachtwoord. Wijzigingen worden direct opgeslagen.'
    },
    {
      id: '18',
      category: 'account',
      question: 'Ik ben mijn wachtwoord vergeten, wat nu?',
      answer: 'Klik op "Wachtwoord vergeten" op de inlogpagina. Vul je emailadres in en je ontvangt een link om een nieuw wachtwoord in te stellen. De link is 24 uur geldig.'
    }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const popularFAQs = faqItems.filter(item => item.popular);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <button 
              onClick={() => handleNavigation('/')}
              className="hover:text-primary transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-foreground">FAQ</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Veelgestelde Vragen</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Vind snel antwoorden op de meest gestelde vragen over onze producten, 
              verzending, betaling en meer. Staat je vraag er niet bij? Neem gerust contact met ons op!
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{faqItems.length}+</div>
                <div className="text-muted-foreground">Vragen Beantwoord</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Beschikbare Hulp</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">&lt; 2u</div>
                <div className="text-muted-foreground">Gemiddelde Reactietijd</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Popular Questions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">🔥 Populaire Vragen</h2>
          <div className="grid gap-4 max-w-4xl mx-auto">
            {popularFAQs.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        Populair
                      </Badge>
                      <span className="font-medium">{item.question}</span>
                    </div>
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t">
                        <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Alle Vragen per Categorie</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.id === 'all' 
                      ? faqItems.length 
                      : faqItems.filter(item => item.category === category.id).length
                    }
                  </Badge>
                </Button>
              );
            })}
          </div>
        </section>

        {/* FAQ Items */}
        <section className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {filteredFAQs.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium pr-4">{item.question}</span>
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t">
                        <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Staat je vraag er niet bij?</h3>
              <p className="text-muted-foreground mb-6">
                Geen probleem! Ons vriendelijke team helpt je graag verder. 
                Neem contact met ons op en we reageren binnen 2 uur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleNavigation('/contact')}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Stuur een Bericht
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('tel:+31202123456', '_blank')}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Bel Ons Direct
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
