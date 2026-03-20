import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { UtensilsCrossed, Flame, Leaf, Star } from 'lucide-react';

const menuCategories = [
  {
    title: 'Predjedlá',
    items: [
      { name: 'Tatársky biftek z hovädzej sviečkovej', desc: 'Hrianky, maslo, korenie', price: '14,90 €', badge: 'Premium' },
      { name: 'Domáca paštéta z kačacích pečienok', desc: 'Brusnicový kompót, hrianky', price: '8,90 €' },
      { name: 'Carpaccio z červenej repy', desc: 'Kozí syr, vlašské orechy, med', price: '7,90 €', badge: 'Vegetariánske' },
    ],
  },
  {
    title: 'Polievky',
    items: [
      { name: 'Hovädzia vývarová polievka', desc: 'Domáce rezance, zelenina', price: '3,90 €' },
      { name: 'Cesnaková krémová polievka', desc: 'Krutóny, opečená slanina', price: '3,90 €' },
      { name: 'Sezónna polievka dňa', desc: 'Podľa aktuálnej ponuky', price: '2,90 €' },
    ],
  },
  {
    title: 'Hlavné jedlá',
    items: [
      { name: 'Grilovaný hovädzí steak', desc: 'Pečené zemiaky, grilovaná zelenina, bylinkové maslo', price: '22,90 €', badge: 'Špeciál' },
      { name: 'Pečená kačka', desc: 'Lokše, červená kapusta, dusená kapusta', price: '16,90 €', badge: 'Tradičné' },
      { name: 'Hovädzia sviečková na smotane', desc: 'Hovädzí knedlík, brusnice', price: '14,90 €' },
      { name: 'Grilovaný losos', desc: 'Špenátové rizoto, citrónové maslo', price: '18,90 €' },
      { name: 'Vyprážaný bravčový rezeň', desc: 'Zemiaková kaša, kyslá uhorka', price: '11,90 €' },
      { name: 'Bryndzové halušky', desc: 'Opečená slanina, kyslé mlieko', price: '9,90 €', badge: 'Tradičné' },
    ],
  },
  {
    title: 'Šaláty',
    items: [
      { name: 'Caesar šalát s grilovaným kuracím', desc: 'Parmezán, krutóny, anchovy dresing', price: '10,90 €' },
      { name: 'Halloumi šalát', desc: 'Mix listový, cherry paradajky, olivy, medový dresing', price: '9,90 €', badge: 'Vegetariánske' },
    ],
  },
  {
    title: 'Dezerty',
    items: [
      { name: 'Panna cotta', desc: 'Lesné ovocie, mätový sirup', price: '5,90 €' },
      { name: 'Domáci jablkový štrúdľa', desc: 'Vanilková zmrzlina, škorica', price: '5,90 €' },
      { name: 'Čokoládový fondant', desc: 'Malinové coulis, šľahačka', price: '6,90 €', badge: 'Obľúbené' },
    ],
  },
];

export default function MenuPage() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 md:pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <UtensilsCrossed size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">À la carte</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4" style={{ lineHeight: '0.95', letterSpacing: '-0.02em' }}>
            Stály <span className="text-gold italic">jedálny lístok</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Naša stála ponuka — tradičná slovenská a česká kuchyňa, grilované špeciality a sezónne výbery.
          </p>
        </div>
      </section>

      <section ref={ref} className="pb-28">
        <div className="container mx-auto px-4 max-w-3xl space-y-16">
          {menuCategories.map((cat, catIdx) => (
            <div
              key={cat.title}
              className={isVisible ? 'animate-reveal-up' : 'opacity-0'}
              style={{ animationDelay: `${catIdx * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap" style={{ letterSpacing: '-0.01em' }}>
                  {cat.title}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              </div>

              <div className="space-y-1">
                {cat.items.map((item) => (
                  <div key={item.name} className="group flex items-start justify-between gap-4 py-4 px-4 -mx-4 rounded-xl hover:bg-card/50 transition-all duration-200">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-[15px] group-hover:text-gold transition-colors duration-200">
                          {item.name}
                        </h3>
                        {item.badge && (
                          <span className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-bold border border-gold/15">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-gold font-bold text-base sm:text-lg tabular-nums tracking-tight whitespace-nowrap shrink-0 mt-0.5">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-8">
            <p className="text-xs text-muted-foreground/70">
              Ceny sú s DPH. Alergény vám radi poskytneme na požiadanie.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
