import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Camera } from 'lucide-react';
import heroImg from '@/assets/koliesko-skica.jpeg';

const galleryItems = [
  { src: heroImg, alt: 'Interiér reštaurácie – skica', caption: 'Interiér Kolieska' },
];

export default function GaleriaPage() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 md:pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <Camera size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Fotogaléria</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4" style={{ lineHeight: '0.95', letterSpacing: '-0.02em' }}>
            Nahliadnite <span className="text-gold italic">k nám</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Priestory, jedlá a atmosféra Kolieska Country Klubu.
          </p>
        </div>
      </section>

      <section ref={ref} className="pb-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden border border-border shadow-premium aspect-[4/3] bg-card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="absolute bottom-3 left-4 right-4 text-sm text-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {item.caption}
                </p>
              </div>
            ))}

            {/* Placeholder cards for future photos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={`placeholder-${i}`} className="rounded-2xl border border-border/50 border-dashed aspect-[4/3] bg-card/30 flex items-center justify-center">
                <div className="text-center">
                  <Camera size={24} className="text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground/40">Foto čoskoro</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
