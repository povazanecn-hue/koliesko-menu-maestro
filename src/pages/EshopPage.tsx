import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ShoppingCart, Plus, Minus, Trash2, Store, ShoppingBag, Sparkles } from 'lucide-react';
import dailyMenuImg from '@/assets/daily-menu-food.jpg';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

const products: Product[] = [
  { id: '1', name: 'Vyprážaný rezeň', description: 'Bravčový rezeň, zemiaková kaša, kyslá uhorka', price: 7.9, category: 'Denné menu' },
  { id: '2', name: 'Bryndzové halušky', description: 'S opečenou slaninou a kyslým mliekom', price: 7.9, category: 'Denné menu' },
  { id: '3', name: 'Pečená kačka', description: 'S lokšami a červenou kapustou', price: 9.5, category: 'Denné menu' },
  { id: '4', name: 'Segedínsky guláš', description: 'S knedľou a kyslou smotanou', price: 7.9, category: 'Denné menu' },
  { id: '5', name: 'Pečený losos', description: 'S grilovanou zeleninou a citrónovým maslom', price: 10.5, category: 'Denné menu' },
  { id: '6', name: 'Špagety Bolognese', description: 'Hovädzí ragú, parmezán', price: 7.5, category: 'Denné menu' },
  { id: '7', name: 'Kuracie curry', description: 'S basmati ryžou a naan chlebom', price: 8.5, category: 'Denné menu' },
  { id: '8', name: 'Rizoto s hubami', description: 'Krémové risotto s lesnými hubami', price: 8.2, category: 'Denné menu' },
];

type CartItem = Product & { quantity: number };

export default function EshopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.1);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...product, quantity: 1 }];
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
            </div>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-3 rounded-xl bg-card border border-border hover:border-gold/30 transition-all duration-200 active:scale-[0.96] group"
            >
              <ShoppingCart className="text-foreground group-hover:text-gold transition-colors" size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[11px] font-bold w-5.5 h-5.5 flex items-center justify-center rounded-full shadow-premium tabular-nums min-w-[22px] h-[22px]">
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
            <div className="relative rounded-2xl overflow-hidden mb-8 h-36 border border-border">
              <img src={dailyMenuImg} alt="Denné menu" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent flex items-center px-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center">
                    <Sparkles size={16} className="text-gold" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Denné menu</h2>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className={`group bg-card rounded-xl border border-border p-5 flex flex-col justify-between hover:border-gold/20 hover:shadow-card-hover transition-all duration-300 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="mb-4">
                    <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-gold transition-colors">{product.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-lg tabular-nums tracking-tight">{product.price.toFixed(2).replace('.', ',')} €</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold transition-all duration-200 hover:shadow-premium active:scale-[0.95] flex items-center gap-1.5"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      Pridať
                    </button>
                  </div>
                </div>
              ))}
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
                </div>
              ) : (
                <>
                  <div className="space-y-2.5 mb-6 max-h-[400px] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3 border border-border/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground tabular-nums">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</p>
                        </div>
                        <div className="flex items-center gap-0.5">
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
                    ))}
                  </div>
                  <div className="border-t border-border pt-5">
                    <div className="flex justify-between mb-5">
                      <span className="text-foreground font-bold text-sm">Celkom</span>
                      <span className="text-gold font-bold text-xl tabular-nums tracking-tight">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <a
                      href={`mailto:rezervacie@klubkoliesko.sk?subject=Objednávka jedál&body=${encodeURIComponent(cart.map(i => `${i.quantity}x ${i.name} (${(i.price * i.quantity).toFixed(2).replace('.', ',')} €)`).join('\n') + '\n\nCelkom: ' + totalPrice.toFixed(2).replace('.', ',') + ' €')}`}
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
