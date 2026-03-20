import heroImg from '@/assets/hero-koliesko.jpg';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ArrowDown, Sparkles, CalendarCheck } from 'lucide-react';

export default function HeroSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Koliesko Country Klub interiér" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
      </div>

      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

      {/* Content */}
      <div className={`relative z-10 container mx-auto px-4 text-center max-w-3xl ${isVisible ? '' : 'opacity-0'}`}>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-8"
          style={{ animation: isVisible ? 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}
        >
          <Sparkles size={13} className="text-gold" />
          <span className="text-gold text-xs font-semibold tracking-[0.15em] uppercase">Bratislava · Trnávka</span>
        </div>

        <h1
          className="font-display text-5xl sm:text-6xl md:text-8xl font-bold text-foreground mb-6"
          style={{
            animation: isVisible ? 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none',
            opacity: 0,
            lineHeight: '0.9',
            letterSpacing: '-0.02em',
          }}
        >
          Koliesko
          <br />
          <span className="text-gold italic">Country Klub</span>
        </h1>

        <p
          className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-lg mx-auto mb-10 font-light leading-relaxed"
          style={{ animation: isVisible ? 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s forwards' : 'none', opacity: 0 }}
        >
          Tradičná slovenská a česká kuchyňa v srdci Bratislavy. Denné menu, firemné akcie a nezabudnuteľné zážitky.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          style={{ animation: isVisible ? 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s forwards' : 'none', opacity: 0 }}
        >
          <a
            href="#denne-menu"
            className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-premium-lg glow-gold-hover active:scale-[0.97]"
          >
            <Sparkles size={16} strokeWidth={2.5} />
            Denné menu
          </a>
          <a
            href="/akcie"
            onClick={(e) => { e.preventDefault(); window.location.href = '/akcie'; }}
            className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl border border-border/60 text-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:border-gold/40 hover:text-gold hover:bg-gold/5 active:scale-[0.97]"
          >
            <CalendarCheck size={16} strokeWidth={2.5} />
            Naplánovať akciu
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: isVisible ? 'fade-in 1s ease-out 1.2s forwards' : 'none', opacity: 0 }}
      >
        <span className="text-muted-foreground/40 text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDown size={14} className="text-muted-foreground/40 animate-float" />
      </div>
    </section>
  );
}
