import heroImg from '@/assets/hero-koliesko.jpg';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export default function HeroSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Koliesko Country Klub interiér" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </div>

      {/* Content */}
      <div className={`relative z-10 container mx-auto px-4 text-center max-w-3xl ${isVisible ? '' : 'opacity-0'}`}>
        <p
          className="text-gold uppercase tracking-[0.3em] text-sm font-medium mb-6"
          style={{ animation: isVisible ? 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}
        >
          Bratislava · Banšelova 3
        </p>
        <h1
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-[0.95] mb-6"
          style={{ animation: isVisible ? 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s forwards' : 'none', opacity: 0 }}
        >
          Koliesko
          <br />
          <span className="text-gold">Country Klub</span>
        </h1>
        <p
          className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 font-light"
          style={{ animation: isVisible ? 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s forwards' : 'none', opacity: 0 }}
        >
          Tradičná slovenská a česká kuchyňa v srdci Bratislavy-Trnávky. Denné menu, firemné akcie a nezabudnuteľné zážitky.
        </p>
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{ animation: isVisible ? 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s forwards' : 'none', opacity: 0 }}
        >
          <a
            href="#denne-menu"
            className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-base transition-all duration-200 hover:shadow-xl hover:shadow-gold/25 active:scale-[0.97]"
          >
            Pozrieť denné menu
          </a>
          <a
            href="/akcie"
            onClick={(e) => { e.preventDefault(); window.location.href = '/akcie'; }}
            className="px-8 py-4 rounded-lg border border-border text-foreground font-semibold text-base transition-all duration-200 hover:border-gold hover:text-gold active:scale-[0.97]"
          >
            Naplánovať akciu
          </a>
        </div>
      </div>
    </section>
  );
}
