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
    <section ref={ref} className="py-28 bg-card relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/15 to-transparent" />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className={`text-center mb-14 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <Star size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Recenzie</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.01em' }}>
            Čo hovoria naši <span className="text-gold italic">hostia</span>
          </h2>
        </div>

        <div className={`grid md:grid-cols-3 gap-5 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-background rounded-2xl border border-border p-6 relative group hover:border-gold/20 transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                <Quote size={24} className="text-gold/10" />
              </div>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? 'text-gold fill-gold' : 'text-muted-foreground/20'}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-4">
                „{t.content}"
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{t.author}</p>
                {t.source && (
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{t.source}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
