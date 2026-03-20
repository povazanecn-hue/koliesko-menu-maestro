import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section id="kontakt" ref={ref} className="py-24 bg-card">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className={`text-center mb-12 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">Kontakt</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Navštívte nás</h2>
        </div>

        <div className={`grid md:grid-cols-2 gap-8 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-gold mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-foreground">Adresa</p>
                <p className="text-muted-foreground">Banšelova 3, 821 04 Bratislava</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-gold mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-foreground">Telefón</p>
                <a href="tel:+421903510220" className="text-muted-foreground hover:text-gold transition-colors">0903 510 220</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="text-gold mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-foreground">E-mail</p>
                <a href="mailto:rezervacie@klubkoliesko.sk" className="text-muted-foreground hover:text-gold transition-colors">rezervacie@klubkoliesko.sk</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="text-gold mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-foreground">Otváracie hodiny</p>
                <p className="text-muted-foreground">Po–Pi: 10:00 – 22:00</p>
                <p className="text-muted-foreground">So–Ne: 11:00 – 23:00</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border h-72 md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.1!2d17.15!3d48.16!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA5JzM2LjAiTiAxN8KwMDknMDAuMCJF!5e0!3m2!1ssk!2ssk!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)' }}
              allowFullScreen
              loading="lazy"
              title="Koliesko Country Klub mapa"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
