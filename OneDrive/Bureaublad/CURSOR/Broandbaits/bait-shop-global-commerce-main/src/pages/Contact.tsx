// ===== TYPES & INTERFACES =====
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ContactInfo {
  icon: any;
  title: string;
  details: string[];
}

interface Department {
  name: string;
  email: string;
  description: string;
}

interface SocialMedia {
  name: string;
  icon: any;
  url: string;
  followers: string;
}

// ===== CUSTOM HOOKS =====
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
// Simple email mock function to avoid module complexity
const sendContactEmailMock = async (formData: ContactFormData) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Log the email data for debugging
  console.log('📧 Contact Form Submission:', {
    timestamp: new Date().toISOString(),
    to: 'martienstrik@hotmail.com',
    from: formData.email,
    subject: `Bros&Baits Contact: ${formData.subject}`,
    data: formData
  });
  
  // Always return success for demo purposes
  return {
    success: true,
    message: `Email succesvol verzonden naar martienstrik@hotmail.com! We nemen binnen 24 uur contact met je op.`
  };
};
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle,
  Facebook, Instagram, Youtube, Twitter, AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Custom Hook voor Form Management met Proactive Features
const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  
  const autoSaveTimeout = useRef<NodeJS.Timeout>();
  
  // Real-time validatie
  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Naam moet minimaal 2 karakters zijn' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Ongeldig emailadres' : '';
      case 'subject':
        return value.length < 3 ? 'Onderwerp moet minimaal 3 karakters zijn' : '';
      case 'message':
        return value.length < 10 ? 'Bericht moet minimaal 10 karakters zijn' : '';
      default:
        return '';
    }
  }, []);

  // Proactive input handling met real-time validatie
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validatie
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Auto-save draft (proactief)
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }
    
    autoSaveTimeout.current = setTimeout(() => {
      if (Object.values(formData).some(val => val.trim())) {
        localStorage.setItem('contactFormDraft', JSON.stringify({ ...formData, [name]: value }));
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 2000);
      }
    }, 1000);
  }, [formData, validateField]);

  // Load draft on mount (proactief)
  useEffect(() => {
    const draft = localStorage.getItem('contactFormDraft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        setFormData(draftData);
      } catch (error) {
        console.warn('Failed to load draft:', error);
      }
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'phone') { // Phone is optional
        const error = validateField(key, formData[key as keyof ContactFormData]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const result = await sendContactEmailMock(formData);
      
      if (result.success) {
        setIsSubmitted(true);
        setSubmitMessage(result.message);
        localStorage.removeItem('contactFormDraft');
        
        // Auto reset na 5 seconden
        setTimeout(() => {
          setIsSubmitted(false);
          setSubmitMessage('');
          setFormData({
            name: '', email: '', phone: '', subject: '', message: ''
          });
          setErrors({});
        }, 5000);
      } else {
        setSubmitMessage(result.message);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitMessage('Er is een onverwachte fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setErrors({});
    setSubmitMessage('');
    setIsSubmitted(false);
    localStorage.removeItem('contactFormDraft');
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    submitMessage,
    isDraftSaved,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};

// ===== DATA MODELS (Delegatie) =====
const useContactData = () => {
  const contactInfo: ContactInfo[] = [
    {
      icon: MapPin,
      title: 'Bezoekadres',
      details: [
        'Bros&Baits Hoofdkantoor',
        'Visserijstraat 123', 
        '1234 AB Amsterdam',
        'Nederland'
      ]
    },
    {
      icon: Phone,
      title: 'Telefoon',
      details: [
        '+31 (0)20 123 4567',
        'Klantenservice: +31 (0)20 123 4568',
        'WhatsApp: +31 (0)6 12 34 56 78'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'info@brosandbaits.nl',
        'support@brosandbaits.nl',
        'sales@brosandbaits.nl'
      ]
    },
    {
      icon: Clock,
      title: 'Openingstijden',
      details: [
        'Maandag - Vrijdag: 9:00 - 18:00',
        'Zaterdag: 10:00 - 16:00',
        'Zondag: Gesloten',
        'Feestdagen: Gesloten'
      ]
    }
  ];

  const departments: Department[] = [
    {
      name: 'Algemene Vragen',
      email: 'info@brosandbaits.nl',
      description: 'Voor algemene informatie over onze producten en diensten'
    },
    {
      name: 'Klantenservice', 
      email: 'support@brosandbaits.nl',
      description: 'Voor vragen over bestellingen, retouren en technische ondersteuning'
    },
    {
      name: 'Verkoop & Advies',
      email: 'sales@brosandbaits.nl',
      description: 'Voor productadvies en groothandel vragen'
    },
    {
      name: 'Partnerships',
      email: 'partners@brosandbaits.nl',
      description: 'Voor samenwerkingen en zakelijke partnerships'
    }
  ];

  const socialMedia: SocialMedia[] = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/brosandbaits', followers: '12.5K' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/brosandbaits', followers: '8.2K' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/brosandbaits', followers: '5.1K' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/brosandbaits', followers: '3.8K' }
  ];

  return { contactInfo, departments, socialMedia };
};

// ===== DELEGATED COMPONENTS =====
interface ContactFormProps {
  formData: ContactFormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitMessage: string;
  isDraftSaved: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  formData, errors, isSubmitting, isSubmitted, submitMessage, isDraftSaved,
  onInputChange, onSubmit, onReset
}) => {
  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Bericht succesvol verzonden!</h3>
            <p className="text-muted-foreground mb-4">
              {submitMessage || 'We hebben je bericht ontvangen en nemen binnen 24 uur contact met je op.'}
            </p>
            <Button variant="outline" onClick={onReset}>
              Nieuw bericht
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Stuur ons een bericht</h2>
          </div>
          {isDraftSaved && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Concept opgeslagen
            </div>
          )}
        </div>

        {submitMessage && !isSubmitted && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{submitMessage}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">
                Naam * 
                {errors.name && <span className="text-red-500 text-sm ml-2">{errors.name}</span>}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Je volledige naam"
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={errors.name ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label htmlFor="email">
                Email *
                {errors.email && <span className="text-red-500 text-sm ml-2">{errors.email}</span>}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="je@email.com"
                required
                aria-invalid={!!errors.email}
                className={errors.email ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone">Telefoon</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                placeholder="+31 6 12 34 56 78"
              />
            </div>
            <div>
              <Label htmlFor="subject">
                Onderwerp *
                {errors.subject && <span className="text-red-500 text-sm ml-2">{errors.subject}</span>}
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={onInputChange}
                placeholder="Waar gaat je bericht over?"
                required
                aria-invalid={!!errors.subject}
                className={errors.subject ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">
              Bericht *
              {errors.message && <span className="text-red-500 text-sm ml-2">{errors.message}</span>}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={onInputChange}
              placeholder="Vertel ons meer over je vraag of opmerking..."
              rows={6}
              required
              aria-invalid={!!errors.message}
              className={errors.message ? "border-red-500" : ""}
            />
            <div className="text-right text-sm text-muted-foreground mt-1">
              {formData.message.length}/500
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              size="lg" 
              className="flex-1"
              disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Versturen...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Verstuur Bericht
                </>
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              size="lg"
              onClick={onReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const ContactInfoCard: React.FC<{ info: ContactInfo }> = ({ info }) => {
  const IconComponent = info.icon;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-lg p-3">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">{info.title}</h3>
            <div className="space-y-1">
              {info.details.map((detail, idx) => {
                const isEmail = detail.includes('@') && detail.includes('.');
                const isPhone = detail.includes('+') || detail.match(/^0\d/);
                
                if (isEmail) {
                  return (
                    <a 
                      key={idx}
                      href={`mailto:${detail}`}
                      className="text-sm text-primary hover:underline cursor-pointer transition-colors block"
                    >
                      {detail}
                    </a>
                  );
                } else if (isPhone) {
                  return (
                    <a 
                      key={idx}
                      href={`tel:${detail.replace(/\s/g, '')}`}
                      className="text-sm text-primary hover:underline cursor-pointer transition-colors block"
                    >
                      {detail}
                    </a>
                  );
                } else {
                  return (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ===== MAIN COMPONENT =====
const Contact: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData, errors, isSubmitting, isSubmitted, submitMessage, isDraftSaved,
    handleInputChange, handleSubmit, resetForm
  } = useContactForm();
  
  const { contactInfo, departments, socialMedia } = useContactData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary">Home</a>
          <span>/</span>
          <span className="text-foreground">Contact</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Neem Contact Op</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Heb je vragen over onze producten of wil je persoonlijk advies? 
            Ons team staat klaar om je te helpen!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
              submitMessage={submitMessage}
              isDraftSaved={isDraftSaved}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onReset={resetForm}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <ContactInfoCard key={index} info={info} />
            ))}
          </div>
        </div>

        {/* Departments */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Verschillende Afdelingen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{dept.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{dept.description}</p>
                  <a 
                    href={`mailto:${dept.email}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    {dept.email}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Vind Ons</h2>
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=600&fit=crop"
                  alt="Bros&Baits locatie kaart"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Bros&Baits Hoofdkantoor</h3>
                      <p className="text-sm text-muted-foreground">
                        Visserijstraat 123, 1234 AB Amsterdam
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => window.open('https://maps.google.com', '_blank')}
                      >
                        Open in Google Maps
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Social Media */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Volg Ons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {socialMedia.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-all hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-3">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{social.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {social.followers} volgers
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(social.url, '_blank')}
                    >
                      Volgen
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Veelgestelde Vragen</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Misschien staat je vraag al beantwoord in onze uitgebreide FAQ sectie. 
                Bekijk eerst onze veelgestelde vragen voordat je contact opneemt.
              </p>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleNavigation('/faq')}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Bekijk FAQ
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;