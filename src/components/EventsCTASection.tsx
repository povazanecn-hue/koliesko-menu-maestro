import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { PartyPopper, Users, Utensils, CalendarCheck } from 'lucide-react';

export default function EventsCTASection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="py-28 bg-background relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/15 to-transparent" />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`text-center mb-14 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <PartyPopper size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Akcie & oslavy</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.01em' }}>
            Oslavujte <span className="text-gold italic">u nás</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Firemné večierky, narodeninové oslavy, svadby, teambuildingy — o všetko sa postaráme.
          </p>
        </div>

        <div className={`grid sm:grid-cols-3 gap-4 mb-10 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
          {[
            { icon: Users, title: 'Až 120 hostí', desc: 'Vnútorné aj vonkajšie priestory pre väčšie aj menšie skupiny' },
            { icon: Utensils, title: 'Menu na mieru', desc: 'Zostavíme ponuku podľa vašich preferencií a rozpočtu' },
            { icon: CalendarCheck, title: 'Jednoduchá rezervácia', desc: 'Online alebo telefonicky — ozveme sa do 24 hodín' },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-xl border border-border p-6 text-center group hover:border-gold/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/15 transition-colors">
                <item.icon size={18} className="text-gold" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className={`text-center ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.25s' }}>
          <a
            href="/akcie"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-premium-lg glow-gold-hover active:scale-[0.97]"
          >
            <PartyPopper size={16} />
            Naplánovať akciu
          </a>
        </div>
      </div>
    </section>
  );
}
