import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Camera, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import heroImg from '@/assets/koliesko-skica.jpeg';

type GalleryItem = {
  id: string;
  title: string | null;
  category: string;
  image_url: string;
};

const categories = ['Všetko', 'Interiér', 'Jedlá', 'Akcie', 'Terasa'];

export default function GaleriaPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Všetko');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const { ref, isVisible } = useScrollReveal(0.1);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (data) setItems(data);
      setLoading(false);
    };
    fetch();
  }, []);

  // Always include the sketch as first item
  const allItems: GalleryItem[] = [
    { id: 'sketch', title: 'Interiér Kolieska', category: 'Interiér', image_url: heroImg },
    ...items,
  ];

  const filtered = activeCategory === 'Všetko'
    ? allItems
    : allItems.filter((i) => i.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Galéria | Koliesko Country Klub</title>
        <meta name="description" content="Fotogaléria Koliesko Country Klubu – interiér, jedlá, akcie a terasa." />
      </Helmet>
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

      {/* Category tabs */}
      <div className="container mx-auto px-4 max-w-5xl mb-8">
        <div className="flex gap-1.5 justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.96] ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-premium'
                  : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section ref={ref} className="pb-28">
        <div className="container mx-auto px-4 max-w-5xl">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />)}
            </div>
          ) : (
            <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className="group relative rounded-2xl overflow-hidden border border-border shadow-premium aspect-[4/3] bg-card text-left"
                >
                  <img src={item.image_url} alt={item.title || 'Galéria'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {item.title && (
                    <p className="absolute bottom-3 left-4 right-4 text-sm text-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.title}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 p-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-all" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>
          <img src={lightbox.image_url} alt={lightbox.title || ''} className="max-w-full max-h-[85vh] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <Footer />
    </div>
  );
}
