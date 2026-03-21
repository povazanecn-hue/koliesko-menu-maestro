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
    <section ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className={`text-center mb-16 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Recenzie</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Čo hovoria naši hostia
          </h2>
        </div>

        <div className={`grid md:grid-cols-3 gap-10 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
          {testimonials.map((t) => (
            <div key={t.id} className="relative">
              <Quote size={32} className="text-primary/10 mb-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={idx < t.rating ? 'text-primary fill-primary' : 'text-border'}
                  />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                „{t.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground text-sm font-semibold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                  {t.source && (
                    <span className="text-xs text-muted-foreground">{t.source}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
