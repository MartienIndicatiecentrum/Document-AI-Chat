import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Fish, 
  Globe, 
  Clock,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const teamMembers = [
    {
      name: 'Marco van der Berg',
      role: 'Oprichter & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Met 25+ jaar ervaring in de viswereld, begon Marco Bros&Baits vanuit zijn passie voor kwaliteitsvolle visuitrusting.',
      specialties: ['Zoetwater vissen', 'Product ontwikkeling', 'Bedrijfsstrategie']
    },
    {
      name: 'Lisa Janssen',
      role: 'Hoofd Inkoop',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Lisa zorgt ervoor dat we alleen de beste producten selecteren van betrouwbare leveranciers wereldwijd.',
      specialties: ['Productbeoordeling', 'Leveranciersbeheer', 'Kwaliteitscontrole']
    },
    {
      name: 'Jan Pieterse',
      role: 'Technisch Specialist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Jan test alle producten uitgebreid en ontwikkelt nieuwe technieken voor optimale visresultaten.',
      specialties: ['Product testing', 'Technische innovatie', 'Klantadvies']
    },
    {
      name: 'Sandra Bakker',
      role: 'Klantenservice Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Sandra en haar team zorgen ervoor dat elke klant de beste service en ondersteuning krijgt.',
      specialties: ['Klantenservice', 'After-sales support', 'Training']
    }
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Bros&Baits opgericht',
      description: 'Marco start vanuit zijn garage met de verkoop van hoogwaardige jigheads.'
    },
    {
      year: '2013',
      title: 'Eerste eigen productlijn',
      description: 'Lancering van onze eigen premium jighead collectie.'
    },
    {
      year: '2016',
      title: 'Online expansie',
      description: 'Start van onze webshop en internationale verzending.'
    },
    {
      year: '2019',
      title: '10.000+ tevreden klanten',
      description: 'Bereiken van een belangrijke mijlpaal in klanttevredenheid.'
    },
    {
      year: '2021',
      title: 'Duurzaamheidsinitiatieven',
      description: 'Start van ons programma voor milieuvriendelijke verpakkingen.'
    },
    {
      year: '2024',
      title: 'Nieuwe website & platform',
      description: 'Lancering van ons vernieuwde platform met verbeterde gebruikerservaring.'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Kwaliteit Voorop',
      description: 'We selecteren alleen producten die voldoen aan onze strenge kwaliteitseisen en die we zelf zouden gebruiken.'
    },
    {
      icon: Heart,
      title: 'Passie voor Vissen',
      description: 'Onze liefde voor de vissport drijft ons om constant te zoeken naar de beste producten en technieken.'
    },
    {
      icon: Users,
      title: 'Klant Centraal',
      description: 'Elke beslissing die we nemen, baseren we op wat het beste is voor onze klanten en hun viservaring.'
    },
    {
      icon: Globe,
      title: 'Duurzaamheid',
      description: 'We nemen onze verantwoordelijkheid serieus en werken aan een duurzamere toekomst voor de vissport.'
    }
  ];

  const stats = [
    { number: '15+', label: 'Jaar Ervaring' },
    { number: '25K+', label: 'Tevreden Klanten' },
    { number: '500+', label: 'Producten' },
    { number: '98%', label: 'Klanttevredenheid' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-primary">Home</a>
          <span>/</span>
          <span className="text-foreground">Over Ons</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Over Bros&Baits</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Sinds 2010 zijn wij gepassioneerde vissers die zich hebben toegelegd op het leveren van 
            de hoogste kwaliteit visuitrusting. Van onze bescheiden start in een garage tot een 
            vertrouwde naam in de viswereld.
          </p>
          <div className="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop"
              alt="Bros&Baits team aan het vissen"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="lg" className="bg-white/90 text-gray-900 hover:bg-white">
                <Fish className="mr-2 h-5 w-5" />
                Bekijk Onze Story
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Onze Missie</h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Bij Bros&Baits geloven we dat elke visser toegang moet hebben tot uitrusting van de 
                hoogste kwaliteit. Onze missie is om vissers van alle niveaus te voorzien van de 
                tools die ze nodig hebben om succesvol te zijn op het water.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We streven ernaar om niet alleen producten te verkopen, maar om een gemeenschap 
                te bouwen van gepassioneerde vissers die kennis delen en elkaar helpen groeien 
                in deze prachtige sport.
              </p>
              <Button 
                size="lg"
                onClick={() => handleNavigation('/products')}
              >
                Ontdek Onze Producten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Onze Reis</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card>
                      <CardContent className="p-6">
                        <Badge className="mb-3">{milestone.year}</Badge>
                        <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ons Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ontmoet de gepassioneerde mensen achter Bros&Baits die er elke dag voor zorgen 
              dat je de beste visuitrusting krijgt.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certifications & Awards */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certificeringen & Erkenningen</h2>
            <p className="text-muted-foreground">
              Onze toewijding aan kwaliteit wordt erkend door verschillende organisaties.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">ISO 9001 Gecertificeerd</h3>
                <p className="text-muted-foreground text-sm">
                  Erkend voor onze kwaliteitsmanagementsystemen
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Beste Webshop 2023</h3>
                <p className="text-muted-foreground text-sm">
                  Uitgeroepen tot beste viswinkel online
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Duurzaamheidslabel</h3>
                <p className="text-muted-foreground text-sm">
                  Erkend voor onze milieuvriendelijke praktijken
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Word onderdeel van onze gemeenschap van gepassioneerde vissers. 
                Ontdek waarom duizenden vissers vertrouwen op Bros&Baits voor hun uitrusting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => handleNavigation('/products')}
                >
                  Shop Nu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => handleNavigation('/contact')}
                >
                  Neem Contact Op
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

export default About;
