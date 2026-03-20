import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import {
  Plus, Trash2, LogOut, CalendarDays, ClipboardList, Loader2, Check, X,
  Eye, EyeOff, Users, UtensilsCrossed, ShoppingBag, Image, MessageSquare,
  ChevronDown, ChevronUp, Package, Truck, MapPin
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import logo from '@/assets/logo-koliesko-gold.png';

type Event = Tables<'events'>;
type Reservation = Tables<'reservations'>;
type Order = Tables<'orders'>;
type DailyMenu = Tables<'daily_menus'>;
type MenuItem = Tables<'menu_items'>;
type GalleryItem = Tables<'gallery'>;
type ContactMsg = Tables<'contact_messages'>;

type TabKey = 'events' | 'reservations' | 'menu' | 'orders' | 'gallery' | 'messages';

const inputClass = "w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('events');

  // Events
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newGuests, setNewGuests] = useState(20);
  const [newStatus, setNewStatus] = useState<'confirmed' | 'tentative'>('confirmed');
  const [newPrivate, setNewPrivate] = useState(false);
  const [saving, setSaving] = useState(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, Tables<'order_items'>[]>>({});

  // Menu
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [miName, setMiName] = useState('');
  const [miCategory, setMiCategory] = useState('hlavne_jedlo');
  const [miPrice, setMiPrice] = useState('');
  const [miWeight, setMiWeight] = useState('');
  const [miDesc, setMiDesc] = useState('');

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [gTitle, setGTitle] = useState('');
  const [gUrl, setGUrl] = useState('');
  const [gCategory, setGCategory] = useState('Interiér');

  // Messages
  const [messages, setMessages] = useState<ContactMsg[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate('/login');
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    const [evRes, resRes, ordRes, dmRes, miRes, galRes, msgRes] = await Promise.all([
      supabase.from('events').select('*').order('event_date', { ascending: false }),
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('daily_menus').select('*').order('menu_date', { ascending: false }),
      supabase.from('menu_items').select('*').order('sort_order'),
      supabase.from('gallery').select('*').order('sort_order'),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ]);
    if (evRes.data) setEvents(evRes.data);
    if (resRes.data) setReservations(resRes.data);
    if (ordRes.data) setOrders(ordRes.data);
    if (dmRes.data) { setDailyMenus(dmRes.data); if (dmRes.data.length > 0 && !selectedMenu) setSelectedMenu(dmRes.data[0].id); }
    if (miRes.data) setMenuItems(miRes.data);
    if (galRes.data) setGallery(galRes.data);
    if (msgRes.data) setMessages(msgRes.data);
    setLoading(false);
  };

  // --- Event handlers ---
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('events').insert({
      title: newTitle, event_date: newDate, description: newDesc || null,
      guest_count: newGuests, status: newStatus, is_private: newPrivate,
    });
    setSaving(false);
    if (error) { toast.error('Chyba pri ukladaní'); return; }
    toast.success('Akcia pridaná');
    setShowForm(false);
    setNewTitle(''); setNewDate(''); setNewDesc(''); setNewGuests(20); setNewStatus('confirmed'); setNewPrivate(false);
    fetchAll();
  };
  const handleDeleteEvent = async (id: string) => { await supabase.from('events').delete().eq('id', id); toast.success('Akcia odstránená'); fetchAll(); };
  const handleResStatus = async (id: string, status: 'confirmed' | 'cancelled') => { await supabase.from('reservations').update({ status }).eq('id', id); toast.success(status === 'confirmed' ? 'Potvrdená' : 'Zrušená'); fetchAll(); };

  // --- Order handlers ---
  const handleOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status: status as any }).eq('id', id);
    toast.success('Stav objednávky aktualizovaný');
    fetchAll();
  };
  const fetchOrderItems = async (orderId: string) => {
    if (orderItems[orderId]) { setExpandedOrder(expandedOrder === orderId ? null : orderId); return; }
    const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId);
    if (data) setOrderItems(prev => ({ ...prev, [orderId]: data }));
    setExpandedOrder(orderId);
  };

  // --- Menu handlers ---
  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from('daily_menus').update({ is_published: !current }).eq('id', id);
    toast.success(!current ? 'Menu publikované' : 'Menu skryté');
    fetchAll();
  };
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;
    setSaving(true);
    const { error } = await supabase.from('menu_items').insert({
      daily_menu_id: selectedMenu, name: miName, category: miCategory,
      price: parseFloat(miPrice) || 0, weight: miWeight || null, description: miDesc || null,
      sort_order: menuItems.filter(i => i.daily_menu_id === selectedMenu).length,
    });
    setSaving(false);
    if (error) { toast.error('Chyba'); return; }
    toast.success('Položka pridaná');
    setShowMenuItemForm(false);
    setMiName(''); setMiPrice(''); setMiWeight(''); setMiDesc('');
    fetchAll();
  };
  const handleDeleteMenuItem = async (id: string) => { await supabase.from('menu_items').delete().eq('id', id); toast.success('Položka odstránená'); fetchAll(); };

  // --- Gallery handlers ---
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('gallery').insert({
      title: gTitle || null, image_url: gUrl, category: gCategory,
      sort_order: gallery.length,
    });
    setSaving(false);
    if (error) { toast.error('Chyba'); return; }
    toast.success('Obrázok pridaný');
    setShowGalleryForm(false); setGTitle(''); setGUrl(''); setGCategory('Interiér');
    fetchAll();
  };
  const handleDeleteGallery = async (id: string) => { await supabase.from('gallery').delete().eq('id', id); toast.success('Obrázok odstránený'); fetchAll(); };
  const handleToggleGallery = async (id: string, visible: boolean) => { await supabase.from('gallery').update({ is_visible: !visible }).eq('id', id); fetchAll(); };

  // --- Message handlers ---
  const handleMarkRead = async (id: string) => { await supabase.from('contact_messages').update({ is_read: true }).eq('id', id); fetchAll(); };
  const handleDeleteMsg = async (id: string) => { await supabase.from('contact_messages').delete().eq('id', id); toast.success('Správa odstránená'); fetchAll(); };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-gold" size={28} /></div>;
  }

  const pendingRes = reservations.filter(r => r.status === 'pending').length;
  const pendingOrd = orders.filter(o => o.status === 'pending').length;
  const unreadMsg = messages.filter(m => !m.is_read).length;
  const currentMenuItems = menuItems.filter(i => i.daily_menu_id === selectedMenu);

  const tabs: { key: TabKey; label: string; icon: any; count: number; badge?: number }[] = [
    { key: 'events', label: 'Akcie', icon: CalendarDays, count: events.length },
    { key: 'reservations', label: 'Rezervácie', icon: ClipboardList, count: reservations.length, badge: pendingRes },
    { key: 'menu', label: 'Menu', icon: UtensilsCrossed, count: dailyMenus.length },
    { key: 'orders', label: 'Objednávky', icon: ShoppingBag, count: orders.length, badge: pendingOrd },
    { key: 'gallery', label: 'Galéria', icon: Image, count: gallery.length },
    { key: 'messages', label: 'Správy', icon: MessageSquare, count: messages.length, badge: unreadMsg },
  ];

  const orderStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'] as const;
  const orderStatusLabels: Record<string, string> = { pending: 'Nová', confirmed: 'Potvrdená', preparing: 'Pripravuje sa', ready: 'Pripravená', delivered: 'Doručená', cancelled: 'Zrušená' };
  const orderStatusColors: Record<string, string> = { pending: 'bg-gold/12 text-gold', confirmed: 'bg-blue-500/12 text-blue-400', preparing: 'bg-orange-500/12 text-orange-400', ready: 'bg-success/15 text-success', delivered: 'bg-muted text-muted-foreground', cancelled: 'bg-destructive/12 text-destructive' };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface-overlay/98 backdrop-blur-xl border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Koliesko" className="h-8 w-auto" />
            <div className="hidden sm:block">
              <h1 className="font-display text-base font-bold text-foreground leading-tight">Admin Panel</h1>
              <p className="text-[10px] text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { signOut(); navigate('/'); }}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all">
            <LogOut size={14} /> Odhlásiť
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Tabs */}
        <div className="flex gap-1.5 mb-8 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                tab === t.key ? 'bg-primary text-primary-foreground shadow-premium' : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary'
              }`}>
              <t.icon size={14} />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="text-[10px] opacity-60 tabular-nums">{t.count}</span>
              {t.badge && t.badge > 0 && tab !== t.key && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ===================== EVENTS ===================== */}
        {tab === 'events' && (
          <div>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm mb-6 hover:shadow-premium active:scale-[0.97] transition-all">
              <Plus size={15} strokeWidth={2.5} /> Pridať akciu
            </button>
            {showForm && (
              <form onSubmit={handleAddEvent} className="bg-card rounded-2xl border border-border p-6 mb-6 space-y-4 shadow-premium">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Názov *</label><input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} className={inputClass} /></div>
                  <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Dátum *</label><input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)} className={inputClass} /></div>
                </div>
                <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Popis</label><textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} /></div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Hostia</label><input type="number" min={1} max={500} value={newGuests} onChange={e => setNewGuests(Number(e.target.value))} className={inputClass} /></div>
                  <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Stav</label>
                    <select value={newStatus} onChange={e => setNewStatus(e.target.value as any)} className={inputClass}><option value="confirmed">Potvrdená</option><option value="tentative">Predbežná</option></select></div>
                  <div className="flex items-end pb-1"><label className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer"><input type="checkbox" checked={newPrivate} onChange={e => setNewPrivate(e.target.checked)} className="rounded border-input" style={{ accentColor: 'hsl(40, 82%, 52%)' }} />{newPrivate ? <EyeOff size={14} /> : <Eye size={14} />}Súkromná</label></div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-premium active:scale-[0.97] transition-all disabled:opacity-50">{saving ? 'Ukladám...' : 'Uložiť akciu'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-all">Zrušiť</button>
                </div>
              </form>
            )}
            <div className="space-y-2.5">
              {events.map(ev => (
                <div key={ev.id} className="bg-card rounded-xl border border-border p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-border/80 transition-all group">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-foreground text-sm">{ev.title}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${ev.status === 'confirmed' ? 'bg-success/15 text-success' : ev.status === 'tentative' ? 'bg-gold/12 text-gold' : 'bg-destructive/12 text-destructive'}`}>
                        {ev.status === 'confirmed' ? 'Potvrdená' : ev.status === 'tentative' ? 'Predbežná' : 'Zrušená'}
                      </span>
                      {ev.is_private && <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1"><EyeOff size={10} /> Súkromná</span>}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CalendarDays size={12} /> {format(new Date(ev.event_date), 'd. MMMM yyyy', { locale: sk })}
                      {ev.guest_count ? <><Users size={12} className="ml-2" /> {ev.guest_count} hostí</> : ''}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="p-2.5 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/8 transition-all shrink-0 opacity-0 group-hover:opacity-100"><Trash2 size={15} /></button>
                </div>
              ))}
              {events.length === 0 && <EmptyState icon={CalendarDays} text="Žiadne akcie" />}
            </div>
          </div>
        )}

        {/* ===================== RESERVATIONS ===================== */}
        {tab === 'reservations' && (
          <div className="space-y-2.5">
            {reservations.map(r => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-4 sm:p-5 group hover:border-border/80 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-foreground text-sm">{r.name}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${r.status === 'pending' ? 'bg-gold/12 text-gold' : r.status === 'confirmed' ? 'bg-success/15 text-success' : 'bg-destructive/12 text-destructive'}`}>
                        {r.status === 'pending' ? 'Čaká' : r.status === 'confirmed' ? 'Potvrdená' : 'Zrušená'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><CalendarDays size={12} /> {format(new Date(r.event_date), 'd. MMMM yyyy', { locale: sk })}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {r.guest_count} hostí</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.email}{r.phone ? ` · ${r.phone}` : ''}</p>
                    {r.message && <p className="text-xs text-muted-foreground/70 mt-2 italic bg-secondary/30 rounded-lg px-3 py-2">"{r.message}"</p>}
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleResStatus(r.id, 'confirmed')} className="p-2.5 text-success hover:bg-success/10 rounded-xl transition-all active:scale-95" title="Potvrdiť"><Check size={16} strokeWidth={2.5} /></button>
                      <button onClick={() => handleResStatus(r.id, 'cancelled')} className="p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-95" title="Zrušiť"><X size={16} strokeWidth={2.5} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {reservations.length === 0 && <EmptyState icon={ClipboardList} text="Žiadne rezervácie" />}
          </div>
        )}

        {/* ===================== MENU ===================== */}
        {tab === 'menu' && (
          <div>
            <div className="flex gap-1.5 mb-6 flex-wrap">
              {dailyMenus.map(dm => (
                <button key={dm.id} onClick={() => setSelectedMenu(dm.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedMenu === dm.id ? 'bg-primary text-primary-foreground shadow-premium' : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary'}`}>
                  {dm.day_of_week}
                  {!dm.is_published && <EyeOff size={12} className="inline ml-1.5 opacity-60" />}
                </button>
              ))}
            </div>

            {selectedMenu && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => { const dm = dailyMenus.find(d => d.id === selectedMenu); if (dm) handleTogglePublish(dm.id, dm.is_published); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-semibold hover:bg-secondary/80 transition-all">
                    {dailyMenus.find(d => d.id === selectedMenu)?.is_published ? <><EyeOff size={14} /> Skryť</> : <><Eye size={14} /> Publikovať</>}
                  </button>
                  <button onClick={() => setShowMenuItemForm(!showMenuItemForm)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-premium active:scale-[0.97] transition-all">
                    <Plus size={14} /> Pridať položku
                  </button>
                </div>

                {showMenuItemForm && (
                  <form onSubmit={handleAddMenuItem} className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-premium">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Názov *</label><input type="text" required value={miName} onChange={e => setMiName(e.target.value)} className={inputClass} /></div>
                      <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Kategória</label>
                        <select value={miCategory} onChange={e => setMiCategory(e.target.value)} className={inputClass}>
                          <option value="polievka">Polievka</option><option value="hlavne_jedlo">Hlavné jedlo</option><option value="dezert">Dezert</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Cena (€)</label><input type="number" step="0.01" min="0" value={miPrice} onChange={e => setMiPrice(e.target.value)} className={inputClass} placeholder="6.90" /></div>
                      <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Gramáž</label><input type="text" value={miWeight} onChange={e => setMiWeight(e.target.value)} className={inputClass} placeholder="300/150 g" /></div>
                    </div>
                    <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Popis</label><textarea value={miDesc} onChange={e => setMiDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} /></div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-premium active:scale-[0.97] transition-all disabled:opacity-50">{saving ? 'Ukladám...' : 'Pridať'}</button>
                      <button type="button" onClick={() => setShowMenuItemForm(false)} className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-all">Zrušiť</button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {currentMenuItems.map((item, i) => (
                    <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-3 group hover:border-border/80 transition-all">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-gold/10 text-gold text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                          <span className="font-semibold text-foreground text-sm">{item.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase tracking-wider">{item.category}</span>
                        </div>
                        {item.description && <p className="text-xs text-muted-foreground mt-1 ml-7">{item.description}</p>}
                      </div>
                      <span className="text-gold font-bold text-sm tabular-nums whitespace-nowrap">{Number(item.price).toFixed(2).replace('.', ',')} €</span>
                      <button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/8 transition-all shrink-0 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  {currentMenuItems.length === 0 && <EmptyState icon={UtensilsCrossed} text="Žiadne položky v tomto menu" />}
                </div>
              </div>
            )}
            {dailyMenus.length === 0 && <EmptyState icon={UtensilsCrossed} text="Žiadne denné menu" />}
          </div>
        )}

        {/* ===================== ORDERS ===================== */}
        {tab === 'orders' && (
          <div className="space-y-2.5">
            {orders.map(o => (
              <div key={o.id} className="bg-card rounded-xl border border-border overflow-hidden hover:border-border/80 transition-all">
                <button onClick={() => fetchOrderItems(o.id)} className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-foreground text-sm tabular-nums">{o.order_number}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${orderStatusColors[o.status] || ''}`}>{orderStatusLabels[o.status]}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground flex items-center gap-1">
                        {o.delivery_type === 'delivery' ? <Truck size={10} /> : <Package size={10} />}
                        {o.delivery_type === 'delivery' ? 'Rozvoz' : 'Výdaj'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{o.customer_name}</span>
                      <span>{o.customer_email}</span>
                      {o.customer_phone && <span>{o.customer_phone}</span>}
                      <span>{format(new Date(o.created_at), 'd.M.yyyy HH:mm')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-gold font-bold tabular-nums">{Number(o.total_amount).toFixed(2).replace('.', ',')} €</span>
                    {expandedOrder === o.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </button>

                {expandedOrder === o.id && (
                  <div className="border-t border-border px-5 py-4 bg-secondary/20 space-y-3">
                    {o.delivery_address && <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin size={12} /> {o.delivery_address}</p>}
                    {o.note && <p className="text-xs text-muted-foreground italic bg-secondary/30 rounded-lg px-3 py-2">"{o.note}"</p>}
                    <div className="space-y-1.5">
                      {(orderItems[o.id] || []).map(oi => (
                        <div key={oi.id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{oi.quantity}× {oi.product_name}</span>
                          <span className="text-muted-foreground tabular-nums">{(Number(oi.unit_price) * oi.quantity).toFixed(2).replace('.', ',')} €</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5 flex-wrap pt-2">
                      {orderStatuses.filter(s => s !== o.status).map(s => (
                        <button key={s} onClick={() => handleOrderStatus(o.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${s === 'cancelled' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                          {orderStatusLabels[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {orders.length === 0 && <EmptyState icon={ShoppingBag} text="Žiadne objednávky" />}
          </div>
        )}

        {/* ===================== GALLERY ===================== */}
        {tab === 'gallery' && (
          <div>
            <button onClick={() => setShowGalleryForm(!showGalleryForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm mb-6 hover:shadow-premium active:scale-[0.97] transition-all">
              <Plus size={15} /> Pridať obrázok
            </button>

            {showGalleryForm && (
              <form onSubmit={handleAddGallery} className="bg-card rounded-2xl border border-border p-6 mb-6 space-y-4 shadow-premium">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Názov</label><input type="text" value={gTitle} onChange={e => setGTitle(e.target.value)} className={inputClass} placeholder="Interiér reštaurácie" /></div>
                  <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Kategória</label>
                    <select value={gCategory} onChange={e => setGCategory(e.target.value)} className={inputClass}>
                      <option>Interiér</option><option>Jedlá</option><option>Akcie</option><option>Terasa</option>
                    </select>
                  </div>
                </div>
                <div><label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">URL obrázka *</label><input type="url" required value={gUrl} onChange={e => setGUrl(e.target.value)} className={inputClass} placeholder="https://..." /></div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-premium active:scale-[0.97] transition-all disabled:opacity-50">{saving ? 'Ukladám...' : 'Pridať'}</button>
                  <button type="button" onClick={() => setShowGalleryForm(false)} className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-all">Zrušiť</button>
                </div>
              </form>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map(g => (
                <div key={g.id} className="bg-card rounded-xl border border-border overflow-hidden group relative">
                  <div className="aspect-[4/3] bg-secondary">
                    <img src={g.image_url} alt={g.title || 'Galéria'} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{g.title || 'Bez názvu'}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{g.category}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleToggleGallery(g.id, g.is_visible)} className="p-1.5 rounded-lg hover:bg-secondary transition-all" title={g.is_visible ? 'Skryť' : 'Zobraziť'}>
                        {g.is_visible ? <Eye size={14} className="text-success" /> : <EyeOff size={14} className="text-muted-foreground" />}
                      </button>
                      <button onClick={() => handleDeleteGallery(g.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {gallery.length === 0 && <EmptyState icon={Image} text="Žiadne obrázky" />}
          </div>
        )}

        {/* ===================== MESSAGES ===================== */}
        {tab === 'messages' && (
          <div className="space-y-2.5">
            {messages.map(m => (
              <div key={m.id} className={`bg-card rounded-xl border p-4 sm:p-5 group hover:border-border/80 transition-all ${m.is_read ? 'border-border' : 'border-gold/30'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-foreground text-sm">{m.name}</span>
                      {!m.is_read && <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-bold uppercase tracking-wider">Nová</span>}
                      <span className="text-[10px] text-muted-foreground">{format(new Date(m.created_at), 'd.M.yyyy HH:mm')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
                    {m.subject && <p className="text-xs text-foreground font-medium mt-1">{m.subject}</p>}
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{m.message}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!m.is_read && <button onClick={() => handleMarkRead(m.id)} className="p-2 rounded-lg text-success hover:bg-success/10 transition-all" title="Označiť ako prečítanú"><Check size={14} /></button>}
                    <button onClick={() => handleDeleteMsg(m.id)} className="p-2 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/8 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && <EmptyState icon={MessageSquare} text="Žiadne správy" />}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="text-center py-16">
      <Icon size={32} className="text-muted-foreground/15 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
