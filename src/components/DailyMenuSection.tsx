import { useState, useEffect, useMemo } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { UtensilsCrossed, Clock, AlertTriangle, Scale, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { allergenLabels } from '@/data/menuData';

type DailyMenu = {
  id: string;
  menu_date: string;
  day_of_week: string;
  is_published: boolean;
};

type MenuItem = {
  id: string;
  daily_menu_id: string;
  category: string;
  name: string;
  description: string | null;
  weight: string | null;
  price: number;
  allergens: string[];
  tags: string[];
  sort_order: number;
};

export default function DailyMenuSection() {
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollReveal(0.12);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data: menuData } = await supabase
        .from('daily_menus')
        .select('*')
        .eq('is_published', true)
        .order('menu_date', { ascending: true });

      if (menuData && menuData.length > 0) {
        setMenus(menuData);
        const menuIds = menuData.map((m) => m.id);
        const { data: itemData } = await supabase
          .from('menu_items')
          .select('*')
          .in('daily_menu_id', menuIds)
          .order('sort_order', { ascending: true });
        if (itemData) setItems(itemData);

        const today = new Date().toISOString().split('T')[0];
        const todayIdx = menuData.findIndex((m) => m.menu_date === today);
        if (todayIdx >= 0) setActiveDay(todayIdx);
      }
      setLoading(false);
    };
    fetchMenus();
  }, []);

  const currentMenu = menus[activeDay];
  const currentItems = useMemo(
    () => (currentMenu ? items.filter((i) => i.daily_menu_id === currentMenu.id) : []),
    [currentMenu, items]
  );
  const soup = currentItems.find((i) => i.category === 'polievka');
  const mainItems = currentItems.filter((i) => i.category !== 'polievka');

  const prevDay = () => setActiveDay((p) => (p === 0 ? menus.length - 1 : p - 1));
  const nextDay = () => setActiveDay((p) => (p === menus.length - 1 ? 0 : p + 1));

  const shortDays: Record<string, string> = {
    Pondelok: 'Po', Utorok: 'Ut', Streda: 'St', Štvrtok: 'Št', Piatok: 'Pi',
  };

  if (loading) {
    return (
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-24 rounded-2xl" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </section>
    );
  }

  if (menus.length === 0) {
    return (
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed size={28} className="text-muted-foreground/30" />
          </div>
          <p className="text-muted-foreground font-medium">Denné menu ešte nebolo publikované.</p>
          <p className="text-xs text-muted-foreground/50 mt-2">Skúste to neskôr alebo nás kontaktujte.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="denne-menu" ref={ref} className="py-32 bg-background relative">
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-gold/15 mb-6">
            <UtensilsCrossed size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Tento týždeň</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5" style={{ letterSpacing: '-0.02em' }}>
            Denné <span className="gold-gradient-text italic">menu</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
            Každý deň čerstvé jedlá z kvalitných surovín
          </p>
        </div>

        {/* Day tabs */}
        <div
          className={`flex gap-2 justify-center mb-12 flex-wrap ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.1s' }}
        >
          {menus.map((day, i) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(i)}
              className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 active:scale-[0.96] ${
                activeDay === i
                  ? 'gold-gradient text-primary-foreground shadow-lg shadow-[hsl(40_82%_52%/0.25)]'
                  : 'bg-card/80 text-muted-foreground border border-border hover:border-gold/30 hover:text-foreground'
              }`}
            >
              <span className="hidden sm:inline">{day.day_of_week}</span>
              <span className="sm:hidden">{shortDays[day.day_of_week] || day.day_of_week.slice(0, 2)}</span>
            </button>
          ))}
        </div>

        {/* Menu card */}
        <div
          className={`bg-card/80 rounded-3xl border border-border/60 overflow-hidden shadow-premium-lg backdrop-blur-sm ${isVisible ? 'animate-reveal-scale' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s' }}
        >
          {/* Day header */}
          <div className="px-6 sm:px-8 py-5 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-gold/5 via-transparent to-gold/5">
            <button onClick={prevDay} className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground active:scale-95 transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">{currentMenu?.day_of_week}</h3>
              <div className="flex items-center gap-2 justify-center mt-1">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/30" />
                <p className="text-[10px] text-gold/70 uppercase tracking-[0.2em] font-medium">Denné menu</p>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/30" />
              </div>
            </div>
            <button onClick={nextDay} className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground active:scale-95 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Soup */}
          {soup && (
            <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-gold/8 via-gold/4 to-transparent border-b border-border/40">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-lg">🍲</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-1">Polievka dňa</p>
                    <p className="text-foreground font-semibold text-base">{soup.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {soup.weight && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70">
                          <Scale size={11} /> {soup.weight}
                        </span>
                      )}
                      {soup.allergens.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70"
                          title={soup.allergens.map(a => `${a} - ${allergenLabels[Number(a)] || a}`).join(', ')}>
                          <AlertTriangle size={11} /> {soup.allergens.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-gold font-bold text-lg tabular-nums whitespace-nowrap mt-1">
                  {Number(soup.price).toFixed(2).replace('.', ',')} €
                </span>
              </div>
            </div>
          )}

          {/* Main items */}
          <div className="divide-y divide-border/30">
            {mainItems.map((item, i) => (
              <div
                key={item.id}
                className="group px-6 sm:px-8 py-6 hover:bg-gold/[0.03] transition-all duration-300"
                style={{ animation: isVisible ? `reveal-up 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.06}s forwards` : 'none', opacity: 0 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gold/10 border border-gold/15 text-gold text-[11px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold text-foreground text-[15px] group-hover:text-gold transition-colors duration-300">
                        {item.name}
                      </h3>
                      {item.tags?.map((tag) => (
                        <span key={tag} className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full bg-gold/10 text-gold font-bold border border-gold/15">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.description && (
                      <p className="text-sm text-muted-foreground/70 leading-relaxed ml-8">{item.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 ml-8">
                      {item.weight && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/50">
                          <Scale size={11} />
                          {item.weight}
                        </span>
                      )}
                      {item.allergens.length > 0 && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/50 cursor-help"
                          title={item.allergens.map(a => `${a} - ${allergenLabels[Number(a)] || a}`).join('\n')}
                        >
                          <AlertTriangle size={11} />
                          Al: {item.allergens.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 mt-1">
                    <span className="text-gold font-bold text-lg tabular-nums tracking-tight">
                      {Number(item.price).toFixed(2).replace('.', ',')} €
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-secondary/40 via-secondary/20 to-secondary/40 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
              <span className="inline-flex items-center gap-1.5"><Clock size={12} /> Po–Pi 11:00 – 14:30</span>
              <span className="inline-flex items-center gap-1.5"><AlertTriangle size={11} /> EÚ 1169/2011</span>
            </div>
            <a href="/denne-menu" className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold hover:underline underline-offset-4">
              Celé menu <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
