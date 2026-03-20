import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { UtensilsCrossed, AlertTriangle, Scale } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { allergenLabels } from '@/data/menuData';

type MenuCardItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price: number;
  weight: string | null;
  allergens: string[];
  photo_url: string | null;
};

const categoryOrder = ['predjedlá', 'polievky', 'hlavné jedlá', 'dezerty', 'nápoje'];
const categoryLabels: Record<string, string> = {
  predjedlá: 'Predjedlá',
  polievky: 'Polievky',
  'hlavné jedlá': 'Hlavné jedlá',
  dezerty: 'Dezerty',
  nápoje: 'Nápoje',
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollReveal(0.1);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('menu_card')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (data) setItems(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const groupedItems = categoryOrder
    .map((cat) => ({ category: cat, label: categoryLabels[cat] || cat, items: items.filter((i) => i.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Jedálny lístok | Koliesko Country Klub</title>
        <meta name="description" content="Stály jedálny lístok Koliesko Country Klubu – predjedlá, polievky, hlavné jedlá, dezerty a nápoje." />
      </Helmet>
      <Navbar />

      <section className="pt-28 md:pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <UtensilsCrossed size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">À la carte</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4" style={{ lineHeight: '0.95', letterSpacing: '-0.02em' }}>
            Jedálny <span className="text-gold italic">lístok</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Naša stála ponuka tradičných aj moderných jedál z čerstvých surovín.
          </p>
        </div>
      </section>

      <section ref={ref} className="pb-28">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <UtensilsCrossed size={32} className="text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground">Jedálny lístok sa pripravuje.</p>
            </div>
          ) : (
            <div className={`space-y-12 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
              {groupedItems.map((group) => (
                <div key={group.category}>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-gold/30" />
                    {group.label}
                  </h2>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="group bg-card rounded-xl border border-border p-5 hover:border-gold/20 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-[15px] group-hover:text-gold transition-colors">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                              {item.weight && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <Scale size={11} className="text-muted-foreground/50" /> {item.weight}
                                </span>
                              )}
                              {item.allergens.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground cursor-help"
                                  title={item.allergens.map(a => `${a} - ${allergenLabels[Number(a)] || a}`).join('\n')}>
                                  <AlertTriangle size={11} className="text-muted-foreground/50" />
                                  Alergény: {item.allergens.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-gold font-bold text-lg tabular-nums tracking-tight whitespace-nowrap">
                            {Number(item.price).toFixed(2).replace('.', ',')} €
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground/70">
                  Ceny sú s DPH. Alergény vám radi poskytneme na požiadanie.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
