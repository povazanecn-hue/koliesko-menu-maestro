import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import eventImg from '@/assets/event-space.jpg';
import { Users, Calculator, Send } from 'lucide-react';

const PRICE_PER_PERSON = 40;

export default function AkciePage() {
  const [guests, setGuests] = useState(20);
  const { ref, isVisible } = useScrollReveal(0.1);
  const { ref: calcRef, isVisible: calcVisible } = useScrollReveal(0.15);

  const totalPrice = guests * PRICE_PER_PERSON;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section ref={ref} className="relative pt-20 md:pt-24 min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={eventImg} alt="Event priestor" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
        <div className={`relative z-10 container mx-auto px-4 py-24 max-w-3xl text-center ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-4">Firemné akcie & eventy</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95]">
            Usporiadajte svoju <span className="text-gold">akciu u nás</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Firemné večierky, oslavy, teambuildingy a svadby. Kapacita až 120 hostí s kompletným servisom.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section ref={calcRef} className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className={`bg-card rounded-2xl border border-border p-8 md:p-12 shadow-2xl shadow-black/20 ${calcVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="text-gold" size={24} />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Kalkulačka ceny akcie</h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  <Users className="inline mr-2 text-gold" size={16} />
                  Počet hostí
                </label>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min={10}
                    max={120}
                    step={5}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none bg-secondary cursor-pointer accent-gold"
                    style={{ accentColor: 'hsl(38, 75%, 55%)' }}
                  />
                  <div className="bg-secondary rounded-lg px-4 py-2 min-w-[80px] text-center">
                    <span className="text-2xl font-bold text-gold tabular-nums">{guests}</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Cena za osobu</span>
                  <span className="text-foreground font-semibold">{PRICE_PER_PERSON} €</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Počet hostí</span>
                  <span className="text-foreground font-semibold tabular-nums">{guests}</span>
                </div>
                <div className="border-t border-border my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-bold text-lg">Odhadovaná cena</span>
                  <span className="text-gold font-bold text-3xl tabular-nums">{totalPrice.toLocaleString('sk-SK')} €</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">* Približná cena. Finálna suma závisí od výberu menu a doplnkových služieb.</p>
              </div>

              <div className="text-center">
                <a
                  href={`mailto:rezervacie@klubkoliesko.sk?subject=Rezervácia akcie pre ${guests} hostí&body=Dobrý deň, mám záujem o usporiadanie akcie pre ${guests} hostí. Prosím o kontaktovanie.`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-gold/25 active:scale-[0.97]"
                >
                  <Send size={18} />
                  Nezáväzná rezervácia
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className={`grid md:grid-cols-3 gap-6 mt-12 ${calcVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            {[
              { title: 'Letná terasa', desc: 'Vonkajší priestor pre až 60 hostí s výhľadom do záhrady' },
              { title: 'Kompletný servis', desc: 'Od prípravy po upratanie – o všetko sa postaráme' },
              { title: 'Vlastné menu', desc: 'Zostavíme menu podľa vašich preferencií a rozpočtu' },
            ].map((f) => (
              <div key={f.title} className="bg-card rounded-xl border border-border p-6 text-center">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
