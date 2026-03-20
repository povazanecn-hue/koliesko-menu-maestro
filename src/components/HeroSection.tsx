import heroImg from '@/assets/koliesko-skica.jpeg';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ArrowDown, Sparkles, CalendarCheck, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 600);

  return (
    <section ref={(node) => { (ref as React.MutableRefObject<HTMLElement | null>).current = node; sectionRef.current = node; }} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Koliesko Country Klub interiér"
          className="w-full h-[120%] object-cover will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        />
        {/* Multi-layer overlay for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
        {/* Gold ambient light from bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[radial-gradient(ellipse_at_bottom,hsl(40_82%_52%/0.06),transparent_70%)]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-32 left-[15%] w-24 h-24 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute top-48 right-[10%] w-32 h-32 rounded-full bg-gold/3 blur-3xl" />

      {/* Content */}
      <div className={`relative z-10 container mx-auto px-4 text-center max-w-4xl ${isVisible ? '' : 'opacity-0'}`} style={{ opacity }}>
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass border border-gold/20 mb-10"
          style={{ animation: isVisible ? 'reveal-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">Bratislava · Trnávka</span>
        </div>

        {/* Title */}
        <h1
          className="font-display text-6xl sm:text-7xl md:text-[7rem] lg:text-[8.5rem] font-bold text-foreground mb-8"
          style={{
            animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none',
            opacity: 0,
            lineHeight: '0.85',
            letterSpacing: '-0.03em',
          }}
        >
          Koliesko
          <br />
          <span className="gold-gradient-text italic font-bold">Country Klub</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-muted-foreground text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-14 font-light leading-relaxed"
          style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards' : 'none', opacity: 0 }}
        >
          Tradičná slovenská a česká kuchyňa v&nbsp;srdci Bratislavy.
          <br className="hidden sm:block" />
          <span className="text-foreground/70">Denné menu · Oslavy · Online objednávky</span>
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s forwards' : 'none', opacity: 0 }}
        >
          <a
            href="/denne-menu"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl gold-gradient text-primary-foreground font-bold text-sm tracking-wide transition-all duration-500 hover:shadow-xl hover:shadow-[hsl(40_82%_52%/0.35)] active:scale-[0.97] relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Sparkles size={17} strokeWidth={2.5} className="relative" />
            <span className="relative">Denné menu</span>
          </a>
          <a
            href="/rezervacia"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl glass border border-border/60 text-foreground font-semibold text-sm tracking-wide transition-all duration-500 hover:border-gold/40 hover:text-gold active:scale-[0.97]"
          >
            <CalendarCheck size={17} strokeWidth={2} />
            Rezervovať stôl
          </a>
          <a
            href="/eshop"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl glass border border-border/60 text-foreground font-semibold text-sm tracking-wide transition-all duration-500 hover:border-gold/40 hover:text-gold active:scale-[0.97]"
          >
            <ShoppingBag size={17} strokeWidth={2} />
            Objednať online
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ animation: isVisible ? 'fade-in 1s ease-out 1.5s forwards' : 'none', opacity: 0 }}
      >
        <span className="text-muted-foreground/30 text-[9px] uppercase tracking-[0.3em] font-medium">Objavte viac</span>
        <div className="w-5 h-8 rounded-full border border-muted-foreground/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-gold/60 animate-float" />
        </div>
      </div>
    </section>
  );
}
