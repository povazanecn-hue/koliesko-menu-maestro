import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import eventImg from '@/assets/event-space.jpg';
import { Users, Calculator, Send, Sparkles, PartyPopper, Utensils, TreePine } from 'lucide-react';

const PRICE_PER_PERSON = 40;

export default function AkciePage() {
  const [guests, setGuests] = useState(20);
  const { ref, isVisible } = useScrollReveal(0.1);
  const { ref: calcRef, isVisible: calcVisible } = useScrollReveal(0.12);

  const totalPrice = guests * PRICE_PER_PERSON;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section ref={ref} className="relative pt-20 md:pt-24 min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={eventImg} alt="Event priestor" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        </div>
        <div className={`relative z-10 container mx-auto px-4 py-24 max-w-3xl text-center ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <PartyPopper size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.15em] uppercase">Firemné akcie & eventy</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-5" style={{ lineHeight: '0.95', letterSpacing: '-0.02em' }}>
            Usporiadajte svoju
            <br />
            <span className="text-gold italic">akciu u nás</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Firemné večierky, oslavy, teambuildingy a svadby. Kapacita až 120 hostí s kompletným servisom.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section ref={calcRef} className="py-28 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className={`bg-card rounded-2xl border border-border p-6 sm:p-10 shadow-premium-lg ${calcVisible ? 'animate-reveal-scale' : 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center">
                <Calculator className="text-gold" size={18} />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground" style={{ letterSpacing: '-0.01em' }}>Kalkulačka ceny</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Orientačný prepočet nákladov na akciu</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Users size={13} className="text-gold" />
                  Počet hostí
                </label>
                <div className="flex items-center gap-5">
                  <input
                    type="range"
                    min={10}
                    max={120}
                    step={5}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none bg-secondary cursor-pointer"
                    style={{ accentColor: 'hsl(40, 82%, 52%)' }}
                  />
                  <div className="bg-secondary rounded-xl px-5 py-2.5 min-w-[80px] text-center border border-border">
                    <span className="text-2xl font-bold text-gold tabular-nums">{guests}</span>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Cena za osobu</span>
                  <span className="text-foreground font-semibold text-sm tabular-nums">{PRICE_PER_PERSON} €</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Počet hostí</span>
                  <span className="text-foreground font-semibold text-sm tabular-nums">{guests}</span>
                </div>
                <div className="border-t border-border my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-bold text-base">Odhadovaná cena</span>
                  <span className="text-gold font-bold text-3xl tabular-nums tracking-tight">{totalPrice.toLocaleString('sk-SK')} €</span>
                </div>
                <p className="text-[11px] text-muted-foreground/60 mt-3">* Približná cena. Finálna suma závisí od výberu menu a doplnkových služieb.</p>
              </div>

              <div className="text-center">
                <a
                  href={`mailto:rezervacie@klubkoliesko.sk?subject=Rezervácia akcie pre ${guests} hostí&body=Dobrý deň, mám záujem o usporiadanie akcie pre ${guests} hostí. Prosím o kontaktovanie.`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-premium-lg glow-gold-hover active:scale-[0.97]"
                >
                  <Send size={16} />
                  Nezáväzná rezervácia
                </a>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className={`grid md:grid-cols-3 gap-4 mt-10 ${calcVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            {[
              { icon: TreePine, title: 'Letná terasa', desc: 'Vonkajší priestor pre až 60 hostí s výhľadom do záhrady' },
              { icon: Sparkles, title: 'Kompletný servis', desc: 'Od prípravy po upratanie – o všetko sa postaráme' },
              { icon: Utensils, title: 'Vlastné menu', desc: 'Zostavíme menu podľa vašich preferencií a rozpočtu' },
            ].map((f) => (
              <div key={f.title} className="bg-card rounded-xl border border-border p-6 text-center group hover:border-gold/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/15 transition-colors">
                  <f.icon size={18} className="text-gold" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
