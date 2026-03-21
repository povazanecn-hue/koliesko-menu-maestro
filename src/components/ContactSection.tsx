import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal(0.12);

  const contactItems = [
    { icon: MapPin, label: 'Adresa', value: 'Banšelova 3, 821 04 Bratislava', href: undefined },
    { icon: Phone, label: 'Telefón', value: '0903 510 220', href: 'tel:+421903510220' },
    { icon: Mail, label: 'E-mail', value: 'rezervacie@klubkoliesko.sk', href: 'mailto:rezervacie@klubkoliesko.sk' },
  ];

  return (
    <section id="kontakt" ref={ref} className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className={`text-center mb-16 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Kontakt</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Navštívte nás
          </h2>
        </div>

        <div className={`grid md:grid-cols-2 gap-16 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
          {/* Contact info */}
          <div className="space-y-8">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <Icon size={20} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-foreground hover:text-primary transition-colors font-medium">{value}</a>
                  ) : (
                    <p className="text-foreground font-medium">{value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4">
              <Clock size={20} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Otváracie hodiny</p>
                <p className="text-foreground font-medium">Po–Pi: 10:00 – 22:00</p>
                <p className="text-muted-foreground text-sm mt-0.5">So–Ne: 11:00 – 23:00</p>
              </div>
            </div>

            <a
              href="/kontakt"
              className="group inline-flex items-center gap-2 text-foreground text-sm font-semibold hover:text-primary transition-colors duration-300 mt-4"
            >
              Napísať správu
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden h-80 md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.1!2d17.15!3d48.16!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA5JzM2LjAiTiAxN8KwMDknMDAuMCJF!5e0!3m2!1ssk!2ssk!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
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
