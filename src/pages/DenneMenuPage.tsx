import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DailyMenuSection from '@/components/DailyMenuSection';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { UtensilsCrossed, Truck, Clock } from 'lucide-react';

export default function DenneMenuPage() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 md:pt-32 pb-8">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <UtensilsCrossed size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Pondelok – Piatok</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4" style={{ lineHeight: '0.95', letterSpacing: '-0.02em' }}>
            Denné <span className="text-gold italic">menu</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Každý pracovný deň pre vás pripravujeme čerstvé obedy z kvalitných surovín. Polievka + hlavné jedlo od 6,90 €.
          </p>
        </div>
      </section>

      <DailyMenuSection />

      {/* Info cards */}
      <section ref={ref} className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className={`grid md:grid-cols-3 gap-4 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            {[
              { icon: Clock, title: 'Výdaj obedov', desc: 'Pondelok – Piatok\n11:00 – 14:30' },
              { icon: Truck, title: 'Rozvoz v zóne', desc: 'Ružinov – Trnávka\n10:00 – 12:00' },
              { icon: UtensilsCrossed, title: 'So sebou', desc: 'Všetky jedlá z menu\nsi môžete vziať so sebou' },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border p-6 text-center group hover:border-gold/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/15 transition-colors">
                  <item.icon size={18} className="text-gold" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
