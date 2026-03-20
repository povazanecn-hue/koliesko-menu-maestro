import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import heroImg from '@/assets/koliesko-skica.jpeg';
import { Heart } from 'lucide-react';

export default function AtmosphereSection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="py-28 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/15 to-transparent" />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${isVisible ? '' : 'opacity-0'}`}>
          {/* Image */}
          <div
            className="rounded-2xl overflow-hidden border border-border shadow-premium-lg"
            style={{ animation: isVisible ? 'reveal-left 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}
          >
            <img src={heroImg} alt="Koliesko Country Klub – atmosféra" className="w-full h-auto object-cover" />
          </div>

          {/* Text */}
          <div style={{ animation: isVisible ? 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s forwards' : 'none', opacity: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-5">
              <Heart size={13} className="text-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Od roku 2004</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5" style={{ lineHeight: '1.1', letterSpacing: '-0.01em' }}>
              Miesto s <span className="text-gold italic">dušou</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
              Koliesko Country Klub nie je len reštaurácia — je to miesto, kde sa stretávajú rodiny, kolegovia a priatelia. Už vyše 20 rokov varíme s láskou a tradíciou.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Útulný interiér, krásna letná terasa a záhrada — ideálne na každodenné obedy aj veľké oslavy.
            </p>
            <a
              href="/o-nas"
              className="inline-flex items-center gap-2 text-gold text-sm font-semibold hover:underline underline-offset-4 transition-all"
            >
              Viac o nás →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
