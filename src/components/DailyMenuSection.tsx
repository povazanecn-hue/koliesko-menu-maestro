import { useState, useEffect, useMemo } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { UtensilsCrossed, Clock, AlertTriangle, Scale, ChevronLeft, ChevronRight } from 'lucide-react';
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

        // Auto-select today
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
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-20 rounded-xl" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </section>
    );
  }

  if (menus.length === 0) {
    return (
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <UtensilsCrossed size={32} className="text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">Denné menu ešte nebolo publikované.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Skúste to neskôr alebo nás kontaktujte.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="denne-menu" ref={ref} className="py-28 bg-background relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/15 to-transparent" />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`text-center mb-14 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <UtensilsCrossed size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Tento týždeň</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.01em' }}>
            Denné menu
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Každý deň čerstvé jedlá z kvalitných surovín. Polievka + hlavné jedlo.
          </p>
        </div>

        {/* Day tabs */}
        <div
          className={`flex gap-1.5 justify-center mb-10 flex-wrap ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.1s' }}
        >
          {menus.map((day, i) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(i)}
              className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.96] ${
                activeDay === i
                  ? 'bg-primary text-primary-foreground shadow-premium'
                  : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <span className="hidden sm:inline">{day.day_of_week}</span>
              <span className="sm:hidden">{shortDays[day.day_of_week] || day.day_of_week.slice(0, 2)}</span>
            </button>
          ))}
        </div>

        {/* Menu card */}
        <div
          className={`bg-card rounded-2xl border border-border overflow-hidden shadow-premium-lg ${isVisible ? 'animate-reveal-scale' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s' }}
        >
          {/* Day header */}
          <div className="px-5 sm:px-7 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
            <button onClick={prevDay} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground active:scale-95 transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{currentMenu?.day_of_week}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Denné menu</p>
            </div>
            <button onClick={nextDay} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground active:scale-95 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Soup */}
          {soup && (
            <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-gold/8 to-transparent border-b border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-base">🍲</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gold font-semibold mb-0.5">Polievka dňa</p>
                    <p className="text-foreground font-medium text-sm">{soup.name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {soup.weight && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Scale size={10} /> {soup.weight}
                        </span>
                      )}
                      {soup.allergens.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
                          title={soup.allergens.map(a => `${a} - ${allergenLabels[Number(a)] || a}`).join(', ')}>
                          <AlertTriangle size={10} /> {soup.allergens.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-gold font-bold text-base tabular-nums whitespace-nowrap tracking-tight mt-1">
                  {Number(soup.price).toFixed(2).replace('.', ',')} €
                </span>
              </div>
            </div>
          )}

          {/* Main items */}
          <div className="divide-y divide-border/60">
            {mainItems.map((item, i) => (
              <div
                key={item.id}
                className="group px-5 sm:px-7 py-5 hover:bg-secondary/30 transition-all duration-200"
                style={{ animation: isVisible ? `reveal-up 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.07}s forwards` : 'none', opacity: 0 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gold/10 text-gold text-[10px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold text-foreground text-sm sm:text-[15px] group-hover:text-gold transition-colors duration-200">
                        {item.name}
                      </h3>
                      {item.tags?.map((tag) => (
                        <span key={tag} className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-bold border border-gold/15">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed ml-7">{item.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 ml-7">
                      {item.weight && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Scale size={11} className="text-muted-foreground/50" />
                          {item.weight}
                        </span>
                      )}
                      {item.allergens.length > 0 && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground cursor-help"
                          title={item.allergens.map(a => `${a} - ${allergenLabels[Number(a)] || a}`).join('\n')}
                        >
                          <AlertTriangle size={11} className="text-muted-foreground/50" />
                          Alergény: {item.allergens.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 mt-1">
                    <span className="text-gold font-bold text-base sm:text-lg tabular-nums tracking-tight">
                      {Number(item.price).toFixed(2).replace('.', ',')} €
                    </span>
                    <p className="text-[9px] text-muted-foreground/50 mt-0.5">s DPH</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-7 py-4 bg-secondary/30 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Menu sa podáva Po–Pi od 11:00 do 14:30</p>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={12} className="text-muted-foreground/60" />
              <p className="text-[10px] text-muted-foreground/70">Čísla alergénov podľa nariadenia EÚ 1169/2011</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
