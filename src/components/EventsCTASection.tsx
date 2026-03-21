import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Users, Utensils, CalendarCheck, ArrowRight } from 'lucide-react';
import eventImg from '@/assets/event-space.jpg';

export default function EventsCTASection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  const features = [
    { icon: Users, title: 'Až 120 hostí', desc: 'Vnútorné aj vonkajšie priestory' },
    { icon: Utensils, title: 'Menu na mieru', desc: 'Ponuka podľa vašich preferencií' },
    { icon: CalendarCheck, title: 'Rýchla rezervácia', desc: 'Ozveme sa do 24h' },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center ${isVisible ? '' : 'opacity-0'}`}>
          {/* Content */}
          <div style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-6">Akcie & oslavy</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ lineHeight: '1.1' }}>
              Oslavujte u&nbsp;nás
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg">
              Firemné večierky, narodeninové oslavy, svadby, teambuildingy — o&nbsp;všetko sa postaráme.
            </p>

            <div className="space-y-6 mb-10">
              {features.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4"
                  style={{ animation: isVisible ? `reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s forwards` : 'none', opacity: 0 }}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-0.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/akcie"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-foreground/90 active:scale-[0.97]"
            >
              Naplánovať akciu
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Image */}
          <div
            className="relative"
            style={{ animation: isVisible ? 'reveal-right 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none', opacity: 0 }}
          >
            <div className="overflow-hidden rounded-lg aspect-[4/5]">
              <img src={eventImg} alt="Priestory na akcie" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
