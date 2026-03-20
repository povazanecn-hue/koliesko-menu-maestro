import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { MapPin, Phone, Mail, Clock, Navigation, ArrowRight } from 'lucide-react';

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal(0.12);

  const contactItems = [
    { icon: MapPin, label: 'Adresa', value: 'Banšelova 3, 821 04 Bratislava', href: undefined },
    { icon: Phone, label: 'Telefón', value: '0903 510 220', href: 'tel:+421903510220' },
    { icon: Mail, label: 'E-mail', value: 'rezervacie@klubkoliesko.sk', href: 'mailto:rezervacie@klubkoliesko.sk' },
  ];

  return (
    <section id="kontakt" ref={ref} className="py-32 bg-background relative overflow-hidden">
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/3 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 max-w-5xl relative">
        <div className={`text-center mb-16 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-gold/15 mb-6">
            <Navigation size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Kontakt</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5" style={{ letterSpacing: '-0.02em' }}>
            Navštívte <span className="gold-gradient-text italic">nás</span>
          </h2>
        </div>

        <div className={`grid md:grid-cols-2 gap-10 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
          {/* Contact info */}
          <div className="space-y-6">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 group-hover:border-gold/25 transition-all duration-300">
                  <Icon size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-foreground hover:text-gold transition-colors duration-300 font-medium text-[15px]">{value}</a>
                  ) : (
                    <p className="text-foreground font-medium text-[15px]">{value}</p>
                  )}
                </div>
              </div>
            ))}
            {/* Opening hours */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 group-hover:border-gold/25 transition-all duration-300">
                <Clock size={18} className="text-gold" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-1">Otváracie hodiny</p>
                <p className="text-foreground font-medium text-[15px]">Po–Pi: 10:00 – 22:00</p>
                <p className="text-muted-foreground text-sm mt-0.5">So–Ne: 11:00 – 23:00</p>
              </div>
            </div>

            <a
              href="/kontakt"
              className="group inline-flex items-center gap-2.5 text-gold text-sm font-bold hover:gap-3.5 transition-all duration-300 mt-4"
            >
              Napísať správu
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden border border-border/40 h-80 md:h-auto shadow-premium relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.1!2d17.15!3d48.16!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA5JzM2LjAiTiAxN8KwMDknMDAuMCJF!5e0!3m2!1ssk!2ssk!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.85) saturate(0.7)' }}
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
