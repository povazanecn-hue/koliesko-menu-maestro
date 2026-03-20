import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ShoppingBag, Truck, Clock, ArrowRight } from 'lucide-react';

export default function EshopTeaser() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="py-32 bg-card relative overflow-hidden">
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 max-w-4xl relative">
        <div className={`bg-background/60 backdrop-blur-sm rounded-3xl border border-border/50 p-10 sm:p-14 shadow-premium-lg text-center relative overflow-hidden ${isVisible ? 'animate-reveal-scale' : 'opacity-0'}`}>
          {/* Top gold line */}
          <div className="absolute top-0 left-0 right-0 h-px shimmer-line" />

          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-gold/15 mb-7">
            <ShoppingBag size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Objednajte online</span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-5" style={{ letterSpacing: '-0.02em' }}>
            Jedlá z menu <span className="gold-gradient-text italic">k vám</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed mb-10">
            Objednajte si obľúbené jedlá z denného menu na výdaj alebo s&nbsp;rozvozom v&nbsp;zóne Ružinov–Trnávka.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            {[
              { icon: Clock, label: 'Výdaj', time: '11:00 – 14:30' },
              { icon: Truck, label: 'Rozvoz', time: '10:00 – 12:00' },
            ].map(({ icon: Icon, label, time }) => (
              <div key={label} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-secondary/40 border border-border/30">
                <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Icon size={16} className="text-gold" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium">{label}</p>
                  <p className="text-sm font-semibold text-foreground">{time}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/eshop"
            className="group inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl gold-gradient text-primary-foreground font-bold text-sm tracking-wide transition-all duration-500 hover:shadow-xl hover:shadow-[hsl(40_82%_52%/0.3)] active:scale-[0.97] relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <ShoppingBag size={16} className="relative" />
            <span className="relative">Objednať online</span>
            <ArrowRight size={14} className="relative group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
