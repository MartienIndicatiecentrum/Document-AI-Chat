import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Gift, 
  Bell, 
  CheckCircle, 
  Fish,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Welkom bij Bros&Baits!",
        description: "Je ontvangt binnenkort exclusieve aanbiedingen en fishing tips.",
      });
    }, 500);
  };

  if (isSubmitted) {
    return (
      <section className="py-20 primary-gradient text-primary-foreground relative overflow-hidden">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <CheckCircle className="h-16 w-16 mx-auto mb-6 text-secondary" />
            <h2 className="text-3xl font-bold mb-4">Bedankt voor je aanmelding!</h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              We hebben je een bevestigingsmail gestuurd. Check je inbox voor je welkomstbonus!
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
              onClick={() => setIsSubmitted(false)}
            >
              Nog een email toevoegen
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 primary-gradient text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <Fish className="h-20 w-20 rotate-12" />
        </div>
        <div className="absolute top-32 right-20">
          <Fish className="h-16 w-16 -rotate-45" />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <Fish className="h-12 w-12 rotate-90" />
        </div>
        <div className="absolute bottom-32 right-10">
          <Fish className="h-24 w-24 -rotate-12" />
        </div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <Badge className="bg-secondary text-secondary-foreground mb-6 px-4 py-2">
              <Gift className="h-4 w-4 mr-2" />
              Exclusieve Voordelen
            </Badge>
            
            <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-6">
              Krijg <span className="text-secondary">Exclusieve Aanbiedingen</span> 
              <br />& Professionele Fishing Tips
            </h2>
            
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Blijf op de hoogte van nieuwe producten, seizoensaanbiedingen en 
              waardevolle vistechnieken van onze experts.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Gift className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">10% Welkomstkorting</h3>
              <p className="text-primary-foreground/80 text-sm">
                Direct te gebruiken op je eerste bestelling
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Bell className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Vroege Toegang</h3>
              <p className="text-primary-foreground/80 text-sm">
                Als eerste weten van nieuwe collecties en sales
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Fish className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expert Tips</h3>
              <p className="text-primary-foreground/80 text-sm">
                Exclusieve vistechnieken en seizoensadvies
              </p>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Jouw email adres..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:bg-white/20"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 group"
              >
                Aanmelden
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 smooth-transition" />
              </Button>
            </form>
            
            <p className="text-xs text-primary-foreground/70 mt-4">
              Door je aan te melden ga je akkoord met onze privacyvoorwaarden. 
              Je kunt je op elk moment uitschrijven.
            </p>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              <span className="text-sm">5,000+ subscribers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              <span className="text-sm">Geen spam</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              <span className="text-sm">Uitschrijven altijd mogelijk</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;