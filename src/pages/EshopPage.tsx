import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ShoppingCart, Plus, Minus, Trash2, Store, ShoppingBag, Scale, AlertTriangle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { weeklyMenu, allergenLabels, type MenuItem } from '@/data/menuData';

type CartItem = MenuItem & { quantity: number; dayLabel: string };

export default function EshopPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.1);

  const currentMenu = weeklyMenu[activeDay];

  const prevDay = () => setActiveDay((p) => (p === 0 ? weeklyMenu.length - 1 : p - 1));
  const nextDay = () => setActiveDay((p) => (p === weeklyMenu.length - 1 ? 0 : p + 1));

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...item, quantity: 1, dayLabel: currentMenu.day }];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)).filter((i) => i.quantity > 0)
    );
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 md:pt-32 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-3">
                <Store size={13} className="text-gold" />
                <span className="text-gold text-[11px] font-semibold tracking-[0.15em] uppercase">Objednávka</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground" style={{ letterSpacing: '-0.01em' }}>E-shop</h1>
              <p className="text-muted-foreground text-sm mt-2">Objednajte si jedlá z denného menu na výdaj alebo rozvoz.</p>
            </div>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-3 rounded-xl bg-card border border-border hover:border-gold/30 transition-all duration-200 active:scale-[0.96] group"
            >
              <ShoppingCart className="text-foreground group-hover:text-gold transition-colors" size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center rounded-full shadow-premium tabular-nums min-w-[22px] h-[22px]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl pb-28">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Products */}
          <div ref={ref} className="flex-1">
            {/* Day tabs */}
            <div className="flex gap-1.5 justify-center mb-6 flex-wrap">
              {weeklyMenu.map((day, i) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.96] ${
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

            {/* Day card */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-premium-lg">
              {/* Day header */}
              <div className="px-5 sm:px-7 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
                <button onClick={prevDay} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground active:scale-95 transition-all">
                  <ChevronLeft size={18} />
                </button>
                <div className="text-center">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">{currentMenu.day}</h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Denné menu · Kategória</p>
                </div>
                <button onClick={nextDay} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground active:scale-95 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Soup */}
              <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-gold/8 to-transparent border-b border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-base">🍲</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gold font-semibold mb-0.5">Polievka dňa</p>
                      <p className="text-foreground font-medium text-sm">{currentMenu.soup.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Scale size={10} /> {currentMenu.soup.weight}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground" title={currentMenu.soup.allergens.map(a => `${a} - ${allergenLabels[a]}`).join(', ')}>
                          <AlertTriangle size={10} /> {currentMenu.soup.allergens.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-gold font-bold text-base tabular-nums whitespace-nowrap tracking-tight mt-1">
                    {currentMenu.soup.price.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="divide-y divide-border/60">
                {currentMenu.items.map((item, i) => (
                  <div
                    key={item.id}
                    className={`group px-5 sm:px-7 py-5 hover:bg-secondary/30 transition-all duration-200 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Number + name */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gold/10 text-gold text-[10px] font-bold shrink-0">
                            {i + 1}
                          </span>
                          <h3 className="font-semibold text-foreground text-sm sm:text-[15px] group-hover:text-gold transition-colors duration-200">
                            {item.name}
                          </h3>
                          {item.tag && (
                            <span className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-bold border border-gold/15">
                              {item.tag}
                            </span>
                          )}
                        </div>

                        {/* Side */}
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed ml-7">
                          <span className="text-foreground/70">Príloha:</span> {item.side}
                        </p>

                        {/* Extras */}
                        {item.extras && (
                          <p className="text-xs text-muted-foreground/80 ml-7 mt-0.5">
                            <span className="text-foreground/60">+ </span>{item.extras}
                          </p>
                        )}

                        {/* Weight + allergens */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 ml-7">
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Scale size={11} className="text-muted-foreground/50" />
                            {item.weight}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground cursor-help"
                            title={item.allergens.map(a => `${a} - ${allergenLabels[a]}`).join('\n')}
                          >
                            <AlertTriangle size={11} className="text-muted-foreground/50" />
                            Alergény: {item.allergens.join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Price + add button */}
                      <div className="flex flex-col items-end gap-2 shrink-0 mt-1">
                        <div className="text-right">
                          <span className="text-gold font-bold text-base sm:text-lg tabular-nums tracking-tight">
                            {item.price.toFixed(2).replace('.', ',')} €
                          </span>
                          <p className="text-[9px] text-muted-foreground/50">s DPH</p>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold transition-all duration-200 hover:shadow-premium active:scale-[0.95] flex items-center gap-1.5"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                          <span className="hidden sm:inline">Pridať</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-7 py-4 bg-secondary/30 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Výdaj Po–Pi 11:00 – 14:30</p>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} className="text-muted-foreground/60" />
                  <p className="text-[10px] text-muted-foreground/70">Alergény podľa EU 1169/2011</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart sidebar */}
          <div className={`lg:w-80 ${cartOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-premium">
              <h3 className="font-display text-lg font-bold text-foreground mb-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <ShoppingBag size={16} className="text-gold" />
                </div>
                Košík
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingCart size={32} className="text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Košík je prázdny</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Pridajte si jedlá z menu</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5 mb-6 max-h-[400px] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-secondary/50 rounded-xl p-3 border border-border/50">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">{item.dayLabel} · {item.weight}</p>
                            <p className="text-xs text-gold font-semibold tabular-nums mt-0.5">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground active:scale-90 transition-all">
                              <Minus size={13} />
                            </button>
                            <span className="text-sm font-bold text-foreground w-6 text-center tabular-nums">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground active:scale-90 transition-all">
                              <Plus size={13} />
                            </button>
                            <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/60 hover:text-destructive ml-0.5 active:scale-90 transition-all">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-5">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Položky</span>
                      <span className="text-sm text-foreground font-medium tabular-nums">{totalItems}×</span>
                    </div>
                    <div className="flex justify-between mb-5">
                      <span className="text-foreground font-bold text-sm">Celkom s DPH</span>
                      <span className="text-gold font-bold text-xl tabular-nums tracking-tight">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <a
                      href={`mailto:rezervacie@klubkoliesko.sk?subject=Objednávka jedál&body=${encodeURIComponent(cart.map(i => `${i.quantity}× ${i.name} (${i.dayLabel}) – ${i.side}${i.extras ? ' + ' + i.extras : ''} – ${i.weight} – ${(i.price * i.quantity).toFixed(2).replace('.', ',')} €`).join('\n') + '\n\nCelkom s DPH: ' + totalPrice.toFixed(2).replace('.', ',') + ' €')}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-premium-lg glow-gold-hover active:scale-[0.97]"
                    >
                      <ShoppingBag size={16} />
                      Objednať
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
