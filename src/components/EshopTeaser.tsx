import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ShoppingBag, Truck, Clock } from 'lucide-react';

export default function EshopTeaser() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="py-28 bg-card relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/15 to-transparent" />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`bg-background rounded-2xl border border-border p-8 sm:p-12 shadow-premium-lg text-center ${isVisible ? 'animate-reveal-scale' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-5">
            <ShoppingBag size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Objednajte online</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.01em' }}>
            Jedlá z menu <span className="text-gold italic">k vám</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed mb-8">
            Objednajte si obľúbené jedlá z denného menu na výdaj alebo s rozvozom v zóne Ružinov–Trnávka.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Clock size={16} className="text-gold shrink-0" />
              Výdaj 11:00 – 14:30
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Truck size={16} className="text-gold shrink-0" />
              Rozvoz 10:00 – 12:00
            </div>
          </div>

          <a
            href="/eshop"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-premium-lg glow-gold-hover active:scale-[0.97]"
          >
            <ShoppingBag size={16} />
            Objednať online
          </a>
        </div>
      </div>
    </section>
  );
}
