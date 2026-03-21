import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Clock, Truck, ArrowRight } from 'lucide-react';

export default function EshopTeaser() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className={`text-center ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Objednajte online</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-5">
            Jedlá z menu k&nbsp;vám
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10">
            Objednajte si obľúbené jedlá z denného menu na výdaj alebo s&nbsp;rozvozom v&nbsp;zóne Ružinov–Trnávka.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-12">
            {[
              { icon: Clock, label: 'Výdaj', time: '11:00 – 14:30' },
              { icon: Truck, label: 'Rozvoz', time: '10:00 – 12:00' },
            ].map(({ icon: Icon, label, time }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={18} className="text-primary" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-foreground">{time}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/eshop"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-foreground/90 active:scale-[0.97]"
          >
            Objednať online
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
