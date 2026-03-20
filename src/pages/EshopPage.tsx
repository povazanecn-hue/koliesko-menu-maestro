import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
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
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

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

      {/* Header */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-2">Objednávka</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">E-shop</h1>
            </div>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-3 rounded-xl bg-card border border-border hover:border-gold transition-colors active:scale-[0.96]"
            >
              <ShoppingCart className="text-foreground" size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Products */}
          <div ref={ref} className="flex-1">
            {/* Category header */}
            <div className="relative rounded-2xl overflow-hidden mb-8 h-40">
              <img src={dailyMenuImg} alt="Denné menu" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent flex items-center px-6">
                <h2 className="font-display text-2xl font-bold text-foreground">Denné menu</h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className={`bg-card rounded-xl border border-border p-5 flex flex-col justify-between hover:border-gold/40 transition-all duration-200 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="mb-4">
                    <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-lg tabular-nums">{product.price.toFixed(2).replace('.', ',')} €</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 active:scale-[0.95] flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Pridať
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart sidebar */}
          <div className={`lg:w-80 ${cartOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <ShoppingCart size={20} className="text-gold" />
                Košík
              </h3>

              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Košík je prázdny</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground tabular-nums">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded hover:bg-muted text-muted-foreground active:scale-90">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-foreground w-6 text-center tabular-nums">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded hover:bg-muted text-muted-foreground active:scale-90">
                            <Plus size={14} />
                          </button>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive ml-1 active:scale-90">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="text-foreground font-bold">Celkom</span>
                      <span className="text-gold font-bold text-xl tabular-nums">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:shadow-lg hover:shadow-gold/20 active:scale-[0.97]">
                      Objednať
                    </button>
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
