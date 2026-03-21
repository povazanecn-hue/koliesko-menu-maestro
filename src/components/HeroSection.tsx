import heroImg from '@/assets/koliesko-skica.jpeg';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ArrowDown } from 'lucide-react';
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

  const opacity = Math.max(0, 1 - scrollY / 700);

  return (
    <section ref={(node) => { (ref as React.MutableRefObject<HTMLElement | null>).current = node; sectionRef.current = node; }} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Koliesko Country Klub interiér"
          className="w-full h-[115%] object-cover will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-foreground/20" />
      </div>

      {/* Content */}
      <div className={`relative z-10 container mx-auto px-4 text-center max-w-3xl ${isVisible ? '' : 'opacity-0'}`} style={{ opacity }}>
        {/* Eyebrow */}
        <p
          className="text-sm font-medium tracking-[0.25em] uppercase text-muted-foreground mb-8"
          style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' : 'none', opacity: 0 }}
        >
          Bratislava · Trnávka
        </p>

        {/* Title */}
        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8"
          style={{
            animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' : 'none',
            opacity: 0,
            lineHeight: '1',
            letterSpacing: '-0.02em',
          }}
        >
          Koliesko
          <br />
          <span className="italic font-normal text-primary">Country Klub</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-14 leading-relaxed"
          style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s forwards' : 'none', opacity: 0 }}
        >
          Tradičná slovenská a česká kuchyňa v&nbsp;srdci Bratislavy.
          Denné menu · Oslavy · Online objednávky
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{ animation: isVisible ? 'reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s forwards' : 'none', opacity: 0 }}
        >
          <a
            href="/denne-menu"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-foreground text-background font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-foreground/90 active:scale-[0.97]"
          >
            Denné menu
          </a>
          <a
            href="/rezervacia"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent border border-foreground/20 text-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:border-foreground/40 active:scale-[0.97]"
          >
            Rezervovať stôl
          </a>
          <a
            href="/eshop"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent border border-foreground/20 text-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:border-foreground/40 active:scale-[0.97]"
          >
            Objednať online
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ animation: isVisible ? 'fade-in 1s ease-out 1.5s forwards' : 'none', opacity: 0 }}
      >
        <span className="text-muted-foreground/50 text-[10px] uppercase tracking-[0.3em] font-medium">Objavte viac</span>
        <ArrowDown size={16} className="text-muted-foreground/40 animate-float" />
      </div>
    </section>
  );
}
