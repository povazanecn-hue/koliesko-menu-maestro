import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal(0.12);

  const items = [
    { icon: MapPin, label: 'Adresa', value: 'Banšelova 3, 821 04 Bratislava', href: undefined },
    { icon: Phone, label: 'Telefón', value: '0903 510 220', href: 'tel:+421903510220' },
    { icon: Mail, label: 'E-mail', value: 'rezervacie@klubkoliesko.sk', href: 'mailto:rezervacie@klubkoliesko.sk' },
  ];

  return (
    <section id="kontakt" ref={ref} className="py-28 bg-background relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/15 to-transparent" />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className={`text-center mb-14 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <Navigation size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Kontakt</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.01em' }}>
            Navštívte nás
          </h2>
        </div>

        <div className={`grid md:grid-cols-2 gap-8 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
          <div className="space-y-5">
            {items.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                  <Icon size={17} className="text-gold" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-foreground hover:text-gold transition-colors font-medium text-sm">{value}</a>
                  ) : (
                    <p className="text-foreground font-medium text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                <Clock size={17} className="text-gold" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Otváracie hodiny</p>
                <p className="text-foreground font-medium text-sm">Po–Pi: 10:00 – 22:00</p>
                <p className="text-muted-foreground text-sm">So–Ne: 11:00 – 23:00</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border h-72 md:h-auto shadow-premium">
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
