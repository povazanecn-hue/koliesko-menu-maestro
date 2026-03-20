import { useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

type MenuItem = {
  name: string;
  description: string;
  price: string;
  tag?: string;
};

type DayMenu = {
  day: string;
  soup: string;
  items: MenuItem[];
};

const weeklyMenu: DayMenu[] = [
  {
    day: 'Pondelok',
    soup: 'Hovädzia vývarová polievka s cestovinou',
    items: [
      { name: 'Vyprážaný rezeň', description: 'Bravčový rezeň, zemiaková kaša, kyslá uhorka', price: '7,90 €', tag: 'OBĽÚBENÉ' },
      { name: 'Špagety Bolognese', description: 'Hovädzí ragú, parmezán', price: '7,50 €' },
      { name: 'Grilované kuracie prsia', description: 'S ryžou a zeleninou', price: '8,20 €' },
    ],
  },
  {
    day: 'Utorok',
    soup: 'Kapustová polievka s klobásou',
    items: [
      { name: 'Bryndzové halušky', description: 'S opečenou slaninou a kyslým mliekom', price: '7,90 €', tag: 'TRADIČNÉ' },
      { name: 'Bravčový guláš', description: 'S knedľou a cibuľou', price: '7,50 €' },
      { name: 'Zapekané cestoviny', description: 'So šunkou a syrom', price: '6,90 €' },
    ],
  },
  {
    day: 'Streda',
    soup: 'Šošovicová polievka',
    items: [
      { name: 'Pečená kačka', description: 'S lokšami a červenou kapustou', price: '9,50 €', tag: 'ŠPECIÁL' },
      { name: 'Morčacie stehno', description: 'Na šampiňónoch s ryžou', price: '8,20 €' },
      { name: 'Vyprážaný syr', description: 'S hranolkami a tatárskou omáčkou', price: '7,50 €' },
    ],
  },
  {
    day: 'Štvrtok',
    soup: 'Gulášová polievka',
    items: [
      { name: 'Segedínsky guláš', description: 'S knedľou a kyslou smotanou', price: '7,90 €', tag: 'OBĽÚBENÉ' },
      { name: 'Kuracie curry', description: 'S basmati ryžou a naan chlebom', price: '8,50 €' },
      { name: 'Zeleninový šalát', description: 'S grilovaným halloumi', price: '7,20 €' },
    ],
  },
  {
    day: 'Piatok',
    soup: 'Rybacia polievka',
    items: [
      { name: 'Pečený losos', description: 'S grilovanou zeleninou a citrónovým maslom', price: '10,50 €', tag: 'FRESH' },
      { name: 'Vyprážaná ryba', description: 'S hranolkami a remoulade', price: '8,90 €' },
      { name: 'Rizoto s hubami', description: 'Krémové risotto s lesným hubami', price: '8,20 €' },
    ],
  },
];

export default function DailyMenuSection() {
  const [activeDay, setActiveDay] = useState(0);
  const { ref, isVisible } = useScrollReveal(0.15);

  const currentMenu = weeklyMenu[activeDay];

  return (
    <section id="denne-menu" ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div
          className={`text-center mb-12 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
        >
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">Tento týždeň</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Denné menu</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Každý deň čerstvé jedlá z kvalitných surovín. Polievka + hlavné jedlo od 7,50 €.
          </p>
        </div>

        {/* Day tabs */}
        <div
          className={`flex gap-2 justify-center mb-10 flex-wrap ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.15s' }}
        >
          {weeklyMenu.map((day, i) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(i)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.96] ${
                activeDay === i
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-gold/20'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {/* Menu card */}
        <div
          className={`bg-card rounded-2xl border border-border overflow-hidden shadow-2xl shadow-black/20 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.3s' }}
        >
          {/* Soup banner */}
          <div className="px-6 py-4 bg-secondary border-b border-border flex items-center gap-3">
            <span className="text-gold text-lg">🍲</span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Polievka dňa</p>
              <p className="text-foreground font-medium">{currentMenu.soup}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="divide-y divide-border">
            {currentMenu.items.map((item, i) => (
              <div
                key={item.name}
                className="px-6 py-5 flex items-start justify-between gap-4 hover:bg-secondary/50 transition-colors duration-150"
                style={{ animation: isVisible ? `reveal-up 0.5s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.08}s forwards` : 'none', opacity: 0 }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    {item.tag && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="text-gold font-bold text-lg tabular-nums whitespace-nowrap">{item.price}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-secondary/50 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Menu sa podáva denne od 11:00 do 14:30 · Polievka k menu za 1,50 €
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
