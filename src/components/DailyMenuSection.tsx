import { useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { UtensilsCrossed, Clock, Flame, Leaf, Star } from 'lucide-react';

type MenuItem = {
  name: string;
  description: string;
  price: string;
  tag?: string;
  icon?: 'flame' | 'leaf' | 'star';
};

type DayMenu = {
  day: string;
  shortDay: string;
  soup: string;
  items: MenuItem[];
};

const weeklyMenu: DayMenu[] = [
  {
    day: 'Pondelok', shortDay: 'Po',
    soup: 'Hovädzia vývarová polievka s cestovinou',
    items: [
      { name: 'Vyprážaný rezeň', description: 'Bravčový rezeň, zemiaková kaša, kyslá uhorka', price: '7,90 €', tag: 'OBĽÚBENÉ', icon: 'star' },
      { name: 'Špagety Bolognese', description: 'Hovädzí ragú, parmezán', price: '7,50 €' },
      { name: 'Grilované kuracie prsia', description: 'S ryžou a zeleninou', price: '8,20 €', icon: 'leaf' },
    ],
  },
  {
    day: 'Utorok', shortDay: 'Ut',
    soup: 'Kapustová polievka s klobásou',
    items: [
      { name: 'Bryndzové halušky', description: 'S opečenou slaninou a kyslým mliekom', price: '7,90 €', tag: 'TRADIČNÉ', icon: 'flame' },
      { name: 'Bravčový guláš', description: 'S knedľou a cibuľou', price: '7,50 €' },
      { name: 'Zapekané cestoviny', description: 'So šunkou a syrom', price: '6,90 €' },
    ],
  },
  {
    day: 'Streda', shortDay: 'St',
    soup: 'Šošovicová polievka',
    items: [
      { name: 'Pečená kačka', description: 'S lokšami a červenou kapustou', price: '9,50 €', tag: 'ŠPECIÁL', icon: 'star' },
      { name: 'Morčacie stehno', description: 'Na šampiňónoch s ryžou', price: '8,20 €' },
      { name: 'Vyprážaný syr', description: 'S hranolkami a tatárskou omáčkou', price: '7,50 €' },
    ],
  },
  {
    day: 'Štvrtok', shortDay: 'Št',
    soup: 'Gulášová polievka',
    items: [
      { name: 'Segedínsky guláš', description: 'S knedľou a kyslou smotanou', price: '7,90 €', tag: 'OBĽÚBENÉ', icon: 'flame' },
      { name: 'Kuracie curry', description: 'S basmati ryžou a naan chlebom', price: '8,50 €' },
      { name: 'Zeleninový šalát', description: 'S grilovaným halloumi', price: '7,20 €', icon: 'leaf' },
    ],
  },
  {
    day: 'Piatok', shortDay: 'Pi',
    soup: 'Rybacia polievka',
    items: [
      { name: 'Pečený losos', description: 'S grilovanou zeleninou a citrónovým maslom', price: '10,50 €', tag: 'FRESH', icon: 'star' },
      { name: 'Vyprážaná ryba', description: 'S hranolkami a remoulade', price: '8,90 €' },
      { name: 'Rizoto s hubami', description: 'Krémové risotto s lesnými hubami', price: '8,20 €', icon: 'leaf' },
    ],
  },
];

const TagIcon = ({ icon }: { icon?: string }) => {
  if (icon === 'flame') return <Flame size={12} />;
  if (icon === 'leaf') return <Leaf size={12} />;
  if (icon === 'star') return <Star size={12} />;
  return null;
};

export default function DailyMenuSection() {
  const [activeDay, setActiveDay] = useState(0);
  const { ref, isVisible } = useScrollReveal(0.12);

  const currentMenu = weeklyMenu[activeDay];

  return (
    <section id="denne-menu" ref={ref} className="py-28 bg-background relative">
      {/* Decorative top line */}
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
            Každý deň čerstvé jedlá z kvalitných surovín. Polievka + hlavné jedlo od 7,50 €.
          </p>
        </div>

        {/* Day tabs */}
        <div
          className={`flex gap-1.5 justify-center mb-10 flex-wrap ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.1s' }}
        >
          {weeklyMenu.map((day, i) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(i)}
              className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.96] ${
                activeDay === i
                  ? 'bg-primary text-primary-foreground shadow-premium'
                  : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <span className="hidden sm:inline">{day.day}</span>
              <span className="sm:hidden">{day.shortDay}</span>
            </button>
          ))}
        </div>

        {/* Menu card */}
        <div
          className={`bg-card rounded-2xl border border-border overflow-hidden shadow-premium-lg ${isVisible ? 'animate-reveal-scale' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s' }}
        >
          {/* Soup banner */}
          <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-gold/8 to-transparent border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
              <span className="text-base">🍲</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gold font-semibold">Polievka dňa</p>
              <p className="text-foreground font-medium text-sm">{currentMenu.soup}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="divide-y divide-border/60">
            {currentMenu.items.map((item, i) => (
              <div
                key={item.name}
                className="group px-5 sm:px-7 py-5 flex items-start justify-between gap-3 hover:bg-secondary/30 transition-all duration-200"
                style={{ animation: isVisible ? `reveal-up 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.07}s forwards` : 'none', opacity: 0 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-sm sm:text-[15px] group-hover:text-gold transition-colors duration-200">
                      {item.name}
                    </h3>
                    {item.tag && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full bg-gold/10 text-gold font-bold border border-gold/15">
                        <TagIcon icon={item.icon} />
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                <span className="text-gold font-bold text-base sm:text-lg tabular-nums whitespace-nowrap tracking-tight">
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-7 py-4 bg-secondary/30 border-t border-border flex items-center justify-center gap-2">
            <Clock size={13} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Menu sa podáva denne od 11:00 do 14:30 · Polievka k menu za 1,50 €
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
