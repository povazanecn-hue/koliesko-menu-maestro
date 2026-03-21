import { useState, useEffect, useMemo } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Clock, AlertTriangle, Scale, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-20 rounded-full" />)}
          </div>
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </section>
    );
  }

  if (menus.length === 0) {
    return (
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-muted-foreground">Denné menu ešte nebolo publikované.</p>
          <p className="text-sm text-muted-foreground/60 mt-2">Skúste to neskôr alebo nás kontaktujte.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="denne-menu" ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Section header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">Tento týždeň</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Denné menu
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
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
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeDay === i
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <span className="hidden sm:inline">{day.day_of_week}</span>
              <span className="sm:hidden">{shortDays[day.day_of_week] || day.day_of_week.slice(0, 2)}</span>
            </button>
          ))}
        </div>

        {/* Menu content */}
        <div className={`${isVisible ? 'animate-reveal-scale' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {/* Day navigation */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={prevDay} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <h3 className="font-display text-2xl font-semibold text-foreground">{currentMenu?.day_of_week}</h3>
            </div>
            <button onClick={nextDay} className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Soup */}
          {soup && (
            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-3">Polievka dňa</p>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">{soup.name}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {soup.weight && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Scale size={11} /> {soup.weight}
                      </span>
                    )}
                    {soup.allergens.length > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1"
                        title={soup.allergens.map(a => `${a} - ${allergenLabels[Number(a)] || a}`).join(', ')}>
                        <AlertTriangle size={11} /> {soup.allergens.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-foreground font-semibold text-lg tabular-nums whitespace-nowrap">
                  {Number(soup.price).toFixed(2).replace('.', ',')} €
                </span>
              </div>
            </div>
          )}

          {/* Main items */}
          <div className="space-y-0">
            {mainItems.map((item, i) => (
              <div
                key={item.id}
                className="group py-6 border-b border-border/60 last:border-0"
                style={{ animation: isVisible ? `reveal-up 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.06}s forwards` : 'none', opacity: 0 }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-muted-foreground/60 tabular-nums">{i + 1}.</span>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {item.name}
                      </h3>
                      {item.tags?.map((tag) => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed ml-6">{item.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 ml-6">
                      {item.weight && (
                        <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                          <Scale size={11} /> {item.weight}
                        </span>
                      )}
                      {item.allergens.length > 0 && (
                        <span
                          className="text-xs text-muted-foreground/60 cursor-help flex items-center gap-1"
                          title={item.allergens.map(a => `${a} - ${allergenLabels[Number(a)] || a}`).join('\n')}
                        >
                          <AlertTriangle size={11} /> Al: {item.allergens.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-foreground font-semibold text-lg tabular-nums">
                    {Number(item.price).toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
              <span className="inline-flex items-center gap-1.5"><Clock size={12} /> Po–Pi 11:00 – 14:30</span>
            </div>
            <a href="/denne-menu" className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline underline-offset-4">
              Celé menu <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
