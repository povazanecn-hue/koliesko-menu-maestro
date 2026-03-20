import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import heroImg from '@/assets/koliesko-skica.jpeg';
import { Heart, ArrowRight, MapPin, Users, Award } from 'lucide-react';

export default function AtmosphereSection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="py-32 bg-card relative overflow-hidden">
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/2 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isVisible ? '' : 'opacity-0'}`}>
          {/* Image */}
          <div
            className="relative group"
            style={{ animation: isVisible ? 'reveal-left 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}
          >
            <div className="rounded-3xl overflow-hidden border border-border/40 shadow-premium-lg relative">
              <img src={heroImg} alt="Koliesko Country Klub – atmosféra" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 sm:right-4 glass-strong border border-gold/20 rounded-2xl px-5 py-4 shadow-premium-lg">
              <p className="text-3xl font-display font-bold gold-gradient-text">20+</p>
              <p className="text-xs text-muted-foreground mt-0.5">rokov tradície</p>
            </div>
          </div>

          {/* Text */}
          <div style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s forwards' : 'none', opacity: 0 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-gold/15 mb-7">
              <Heart size={13} className="text-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Od roku 2004</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-7" style={{ lineHeight: '1.05', letterSpacing: '-0.02em' }}>
              Miesto s<br /><span className="gold-gradient-text italic">dušou</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-5">
              Koliesko Country Klub nie je len reštaurácia — je to miesto, kde sa stretávajú rodiny, kolegovia a priatelia.
            </p>
            <p className="text-muted-foreground/70 text-sm leading-relaxed mb-8">
              Útulný interiér, krásna letná terasa a záhrada — ideálne na každodenné obedy aj veľké oslavy.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-9">
              {[
                { icon: MapPin, text: 'Bratislava – Trnávka' },
                { icon: Users, text: 'Až 120 hostí' },
                { icon: Award, text: 'Tradičná kuchyňa' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/60 border border-border/40 text-sm text-muted-foreground">
                  <Icon size={14} className="text-gold/70" />
                  {text}
                </div>
              ))}
            </div>

            <a
              href="/o-nas"
              className="group inline-flex items-center gap-2.5 text-gold text-sm font-bold hover:gap-3.5 transition-all duration-300"
            >
              Viac o nás
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
