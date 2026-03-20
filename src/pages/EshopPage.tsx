import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { ShoppingCart, Plus, Minus, Trash2, Store, ShoppingBag, Scale, AlertTriangle, ChevronLeft, ChevronRight, Clock, Loader2, Truck, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { allergenLabels } from '@/data/menuData';
import { toast } from 'sonner';

type DailyMenu = { id: string; menu_date: string; day_of_week: string };
type MenuItem = { id: string; daily_menu_id: string; category: string; name: string; description: string | null; weight: string | null; price: number; allergens: string[]; tags: string[]; sort_order: number };
type CartItem = { menuItemId: string; name: string; price: number; weight: string | null; quantity: number; dayLabel: string };

export default function EshopPage() {
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('koliesko-cart') || '[]'); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [note, setNote] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const { ref, isVisible } = useScrollReveal(0.1);

  useEffect(() => { localStorage.setItem('koliesko-cart', JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: menuData } = await supabase.from('daily_menus').select('*').eq('is_published', true).order('menu_date');
      if (menuData && menuData.length > 0) {
        setMenus(menuData);
        const { data: itemData } = await supabase.from('menu_items').select('*').in('daily_menu_id', menuData.map(m => m.id)).order('sort_order');
        if (itemData) setItems(itemData);
        const today = new Date().toISOString().split('T')[0];
        const idx = menuData.findIndex(m => m.menu_date === today);
        if (idx >= 0) setActiveDay(idx);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const currentMenu = menus[activeDay];
  const currentItems = useMemo(() => currentMenu ? items.filter(i => i.daily_menu_id === currentMenu.id && i.category !== 'polievka') : [], [currentMenu, items]);
  const soup = useMemo(() => currentMenu ? items.find(i => i.daily_menu_id === currentMenu.id && i.category === 'polievka') : null, [currentMenu, items]);

  const shortDays: Record<string, string> = { Pondelok: 'Po', Utorok: 'Ut', Streda: 'St', Štvrtok: 'Št', Piatok: 'Pi' };
  const prevDay = () => setActiveDay(p => (p === 0 ? menus.length - 1 : p - 1));
  const nextDay = () => setActiveDay(p => (p === menus.length - 1 ? 0 : p + 1));

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItemId: item.id, name: item.name, price: Number(item.price), weight: item.weight, quantity: 1, dayLabel: currentMenu?.day_of_week || '' }];
    });
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.menuItemId !== id));
  const updateQty = (id: string, delta: number) => setCart(prev => prev.map(i => i.menuItemId === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    const orderNumber = `KOL-${Date.now().toString(36).toUpperCase()}`;
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone: customerPhone.trim() || null,
      delivery_type: deliveryType,
      delivery_address: deliveryType === 'delivery' ? deliveryAddress.trim() : null,
      note: note.trim() || null,
      total_amount: totalPrice,
    }).select('id').single();

    if (orderError || !order) {
      toast.error('Chyba pri odosielaní objednávky.');
      setSubmitting(false);
      return;
    }

    const orderItems = cart.map(i => ({
      order_id: order.id,
      product_name: i.name,
      quantity: i.quantity,
      unit_price: i.price,
    }));
    await supabase.from('order_items').insert(orderItems);

    setCart([]);
    setCheckoutOpen(false);
    setOrderSuccess(orderNumber);
    setSubmitting(false);
    setCustomerName(''); setCustomerEmail(''); setCustomerPhone(''); setDeliveryAddress(''); setNote('');
  };

  const inputClass = "w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 container mx-auto px-4 max-w-5xl space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>E-shop – Objednávka jedál | Koliesko Country Klub</title>
        <meta name="description" content="Objednajte si jedlá z denného menu Koliesko Country Klubu na výdaj alebo rozvoz." />
      </Helmet>
      <Navbar />

      {/* Order success overlay */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 max-w-md text-center shadow-premium-lg">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/15 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={28} className="text-gold" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Objednávka odoslaná!</h2>
            <p className="text-muted-foreground text-sm mb-4">Vaše číslo objednávky:</p>
            <p className="text-gold font-bold text-xl tabular-nums mb-6">{orderSuccess}</p>
            <p className="text-xs text-muted-foreground mb-8">Potvrdenie vám pošleme e-mailom. Ďakujeme!</p>
            <button onClick={() => setOrderSuccess(null)} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-premium transition-all">
              Pokračovať
            </button>
          </div>
        </div>
      )}

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
            <button onClick={() => setCartOpen(!cartOpen)} className="relative p-3 rounded-xl bg-card border border-border hover:border-gold/30 transition-all group">
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
          <div ref={ref} className="flex-1">
            {menus.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Store size={32} className="text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground">Žiadne menu nie je aktuálne dostupné.</p>
              </div>
            ) : (
              <>
                <div className="flex gap-1.5 justify-center mb-6 flex-wrap">
                  {menus.map((day, i) => (
                    <button key={day.id} onClick={() => setActiveDay(i)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.96] ${activeDay === i ? 'bg-primary text-primary-foreground shadow-premium' : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary'}`}>
                      <span className="hidden sm:inline">{day.day_of_week}</span>
                      <span className="sm:hidden">{shortDays[day.day_of_week] || day.day_of_week.slice(0, 2)}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-premium-lg">
                  <div className="px-5 sm:px-7 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
                    <button onClick={prevDay} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground active:scale-95 transition-all"><ChevronLeft size={18} /></button>
                    <div className="text-center">
                      <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">{currentMenu?.day_of_week}</h2>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Denné menu · Objednávka</p>
                    </div>
                    <button onClick={nextDay} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground active:scale-95 transition-all"><ChevronRight size={18} /></button>
                  </div>

                  {soup && (
                    <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-gold/8 to-transparent border-b border-border">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0 mt-0.5"><span className="text-base">🍲</span></div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-gold font-semibold mb-0.5">Polievka dňa</p>
                            <p className="text-foreground font-medium text-sm">{soup.name}</p>
                          </div>
                        </div>
                        <span className="text-gold font-bold text-base tabular-nums whitespace-nowrap mt-1">{Number(soup.price).toFixed(2).replace('.', ',')} €</span>
                      </div>
                    </div>
                  )}

                  <div className="divide-y divide-border/60">
                    {currentItems.map((item, i) => (
                      <div key={item.id} className={`group px-5 sm:px-7 py-5 hover:bg-secondary/30 transition-all ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gold/10 text-gold text-[10px] font-bold shrink-0">{i + 1}</span>
                              <h3 className="font-semibold text-foreground text-sm sm:text-[15px] group-hover:text-gold transition-colors">{item.name}</h3>
                              {item.tags?.map(tag => (
                                <span key={tag} className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-bold border border-gold/15">{tag}</span>
                              ))}
                            </div>
                            {item.description && <p className="text-xs text-muted-foreground ml-7">{item.description}</p>}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 ml-7">
                              {item.weight && <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Scale size={11} /> {item.weight}</span>}
                              {item.allergens.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground cursor-help"
                                  title={item.allergens.map(a => `${a} - ${allergenLabels[Number(a)] || a}`).join('\n')}>
                                  <AlertTriangle size={11} /> Alergény: {item.allergens.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0 mt-1">
                            <span className="text-gold font-bold text-base sm:text-lg tabular-nums">{Number(item.price).toFixed(2).replace('.', ',')} €</span>
                            <button onClick={() => addToCart(item)}
                              className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold transition-all hover:shadow-premium active:scale-[0.95] flex items-center gap-1.5">
                              <Plus size={14} strokeWidth={2.5} />
                              <span className="hidden sm:inline">Pridať</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 sm:px-7 py-4 bg-secondary/30 border-t border-border flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2"><Clock size={13} className="text-muted-foreground" /><p className="text-xs text-muted-foreground">Výdaj Po–Pi 11:00 – 14:30</p></div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart sidebar */}
          <div className={`lg:w-80 ${cartOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-premium">
              <h3 className="font-display text-lg font-bold text-foreground mb-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center"><ShoppingBag size={16} className="text-gold" /></div>
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
                      <div key={item.menuItemId} className="bg-secondary/50 rounded-xl p-3 border border-border/50">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">{item.dayLabel}</p>
                            <p className="text-xs text-gold font-semibold tabular-nums mt-0.5">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button onClick={() => updateQty(item.menuItemId, -1)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><Minus size={13} /></button>
                            <span className="text-sm font-bold text-foreground w-6 text-center tabular-nums">{item.quantity}</span>
                            <button onClick={() => updateQty(item.menuItemId, 1)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><Plus size={13} /></button>
                            <button onClick={() => removeFromCart(item.menuItemId)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/60 hover:text-destructive ml-0.5"><Trash2 size={13} /></button>
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
                    <button onClick={() => setCheckoutOpen(true)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-premium-lg glow-gold-hover active:scale-[0.97]">
                      <ShoppingBag size={16} /> Objednať
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setCheckoutOpen(false)}>
          <form onSubmit={handleCheckout} onClick={e => e.stopPropagation()}
            className="bg-card rounded-2xl border border-border p-6 sm:p-8 max-w-md w-full shadow-premium-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Dokončiť objednávku</h2>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Meno *</label>
              <input type="text" required maxLength={200} value={customerName} onChange={e => setCustomerName(e.target.value)} className={inputClass} placeholder="Vaše meno" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">E-mail *</label>
              <input type="email" required maxLength={255} value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={inputClass} placeholder="vas@email.sk" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Telefón</label>
              <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className={inputClass} placeholder="+421 ..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Spôsob prevzatia *</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setDeliveryType('pickup')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${deliveryType === 'pickup' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  <Store size={14} /> Výdaj
                </button>
                <button type="button" onClick={() => setDeliveryType('delivery')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${deliveryType === 'delivery' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  <Truck size={14} /> Rozvoz
                </button>
              </div>
            </div>
            {deliveryType === 'delivery' && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Adresa doručenia *</label>
                <input type="text" required maxLength={500} value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className={inputClass} placeholder="Ulica, číslo, mesto" />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Poznámka</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} maxLength={1000} rows={2} className={`${inputClass} resize-none`} placeholder="Špeciálne požiadavky..." />
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-foreground">Celkom</span>
                <span className="text-gold font-bold text-xl tabular-nums">{totalPrice.toFixed(2).replace('.', ',')} €</span>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-premium transition-all disabled:opacity-50">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
                {submitting ? 'Odosielam...' : 'Potvrdiť objednávku'}
              </button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
