import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import heroImg from '@/assets/koliesko-skica.jpeg';
import { ArrowRight, MapPin, Users, Award } from 'lucide-react';

export default function AtmosphereSection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center ${isVisible ? '' : 'opacity-0'}`}>
          {/* Image */}
          <div
            className="relative"
            style={{ animation: isVisible ? 'reveal-left 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}
          >
            <div className="overflow-hidden rounded-lg">
              <img src={heroImg} alt="Koliesko Country Klub – atmosféra" className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.02]" />
            </div>
          </div>

          {/* Text */}
          <div style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s forwards' : 'none', opacity: 0 }}>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-6">Od roku 2004</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8" style={{ lineHeight: '1.1' }}>
              Miesto s&nbsp;dušou
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5">
              Koliesko Country Klub nie je len reštaurácia — je to miesto, kde sa stretávajú rodiny, kolegovia a priatelia.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Útulný interiér, krásna letná terasa a záhrada — ideálne na každodenné obedy aj veľké oslavy.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { icon: MapPin, text: 'Bratislava – Trnávka' },
                { icon: Users, text: 'Až 120 hostí' },
                { icon: Award, text: 'Tradičná kuchyňa' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Icon size={15} className="text-primary" />
                  {text}
                </div>
              ))}
            </div>

            <a
              href="/o-nas"
              className="group inline-flex items-center gap-2 text-foreground text-sm font-semibold hover:text-primary transition-colors duration-300"
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
