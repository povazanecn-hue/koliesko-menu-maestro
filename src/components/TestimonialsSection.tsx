import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Testimonial = {
  id: string;
  author: string;
  content: string;
  rating: number;
  source: string | null;
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { ref, isVisible } = useScrollReveal(0.12);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })
        .limit(6);
      if (data) setTestimonials(data);
    };
    fetch();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section ref={ref} className="py-32 bg-card relative overflow-hidden">
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 max-w-5xl relative">
        <div className={`text-center mb-16 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-gold/15 mb-6">
            <Star size={13} className="text-gold fill-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Recenzie</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5" style={{ letterSpacing: '-0.02em' }}>
            Čo hovoria naši <span className="gold-gradient-text italic">hostia</span>
          </h2>
        </div>

        <div className={`grid md:grid-cols-3 gap-6 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="relative bg-background/60 backdrop-blur-sm rounded-3xl border border-border/50 p-7 group hover:border-gold/25 hover-lift transition-all duration-500"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              {/* Gold accent line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-5 right-5">
                <Quote size={28} className="text-gold/8 group-hover:text-gold/15 transition-colors duration-500" />
              </div>
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={15}
                    className={idx < t.rating ? 'text-gold fill-gold' : 'text-muted-foreground/15'}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-4">
                „{t.content}"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {t.author.charAt(0)}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                </div>
                {t.source && (
                  <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{t.source}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
