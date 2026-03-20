import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { PartyPopper, Users, Utensils, CalendarCheck, ArrowRight } from 'lucide-react';
import eventImg from '@/assets/event-space.jpg';

export default function EventsCTASection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  const features = [
    { icon: Users, title: 'Až 120 hostí', desc: 'Vnútorné aj vonkajšie priestory pre väčšie aj menšie skupiny' },
    { icon: Utensils, title: 'Menu na mieru', desc: 'Ponuka podľa vašich preferencií a rozpočtu' },
    { icon: CalendarCheck, title: 'Rýchla rezervácia', desc: 'Online alebo telefonicky — ozveme sa do 24h' },
  ];

  return (
    <section ref={ref} className="py-32 bg-background relative overflow-hidden">
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isVisible ? '' : 'opacity-0'}`}>
          {/* Content */}
          <div style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-gold/15 mb-7">
              <PartyPopper size={13} className="text-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Akcie & oslavy</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6" style={{ letterSpacing: '-0.02em', lineHeight: '1.05' }}>
              Oslavujte<br /><span className="gold-gradient-text italic">u nás</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
              Firemné večierky, narodeninové oslavy, svadby, teambuildingy — o&nbsp;všetko sa postaráme.
            </p>

            <div className="space-y-5 mb-10">
              {features.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 group"
                  style={{ animation: isVisible ? `reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s forwards` : 'none', opacity: 0 }}
                >
                  <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 group-hover:border-gold/25 transition-all duration-300">
                    <item.icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground mb-0.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/akcie"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl gold-gradient text-primary-foreground font-bold text-sm tracking-wide transition-all duration-500 hover:shadow-xl hover:shadow-[hsl(40_82%_52%/0.3)] active:scale-[0.97] relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <PartyPopper size={16} className="relative" />
              <span className="relative">Naplánovať akciu</span>
              <ArrowRight size={14} className="relative group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Image card */}
          <div
            className="relative"
            style={{ animation: isVisible ? 'reveal-right 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none', opacity: 0 }}
          >
            <div className="rounded-3xl overflow-hidden border border-border/40 shadow-premium-lg aspect-[4/5]">
              <img src={eventImg} alt="Priestory na akcie" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Decorative */}
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full rounded-3xl border border-gold/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
