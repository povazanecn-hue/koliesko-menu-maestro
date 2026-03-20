import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCalendarSection from '@/components/EventCalendarSection';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { CalendarCheck, Users, Calculator, Send, Sparkles } from 'lucide-react';

const PRICE_PER_PERSON = 40;

export default function RezervaciaPage() {
  const [guests, setGuests] = useState(20);
  const { ref: calcRef, isVisible: calcVisible } = useScrollReveal(0.12);
  const totalPrice = guests * PRICE_PER_PERSON;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Rezervácia | Koliesko Country Klub</title>
        <meta name="description" content="Rezervujte si termín na akciu alebo oslavu v Koliesko Country Klube v Bratislave." />
        <meta property="og:title" content="Rezervácia | Koliesko Country Klub" />
        <meta property="og:description" content="Vyberte termín a rezervujte si priestory pre vašu akciu." />
      </Helmet>
      <Navbar />

      {/* Hero header */}
      <section className="pt-28 md:pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <CalendarCheck size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Rezervácia akcie</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4" style={{ lineHeight: '0.95', letterSpacing: '-0.02em' }}>
            Rezervujte si <span className="text-gold italic">termín</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Vyberte voľný deň v kalendári, vyplňte formulár a my sa vám ozveme s potvrdením.
          </p>
        </div>
      </section>

      {/* Calendar - reuse the homepage component */}
      <EventCalendarSection />

      {/* Price calculator */}
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
