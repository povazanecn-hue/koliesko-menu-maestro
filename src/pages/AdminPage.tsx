import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Plus, Trash2, LogOut, CalendarDays, ClipboardList, Loader2, Check, X, Pencil, Eye, EyeOff, Users, ChevronRight } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import logo from '@/assets/logo-koliesko-gold.png';

type Event = Tables<'events'>;
type Reservation = Tables<'reservations'>;

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'events' | 'reservations'>('events');
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

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    const [evRes, resRes] = await Promise.all([
      supabase.from('events').select('*').order('event_date', { ascending: false }),
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
    ]);
    if (evRes.data) setEvents(evRes.data);
    if (resRes.data) setReservations(resRes.data);
    setLoading(false);
  };

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
    fetchData();
  };

  const handleDeleteEvent = async (id: string) => {
    await supabase.from('events').delete().eq('id', id);
    toast.success('Akcia odstránená');
    fetchData();
  };

  const handleResStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    await supabase.from('reservations').update({ status }).eq('id', id);
    toast.success(status === 'confirmed' ? 'Rezervácia potvrdená' : 'Rezervácia zrušená');
    fetchData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  const inputClass = "w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const pendingCount = reservations.filter(r => r.status === 'pending').length;

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
          <button
            onClick={() => { signOut(); navigate('/'); }}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all"
          >
            <LogOut size={14} /> Odhlásiť
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('events')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === 'events'
                ? 'bg-primary text-primary-foreground shadow-premium'
                : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary'
            }`}
          >
            <CalendarDays size={15} /> Akcie
            <span className="text-[11px] opacity-70 tabular-nums">{events.length}</span>
          </button>
          <button
            onClick={() => setTab('reservations')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
              tab === 'reservations'
                ? 'bg-primary text-primary-foreground shadow-premium'
                : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary'
            }`}
          >
            <ClipboardList size={15} /> Rezervácie
            <span className="text-[11px] opacity-70 tabular-nums">{reservations.length}</span>
            {pendingCount > 0 && tab !== 'reservations' && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Events tab */}
        {tab === 'events' && (
          <div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm mb-6 hover:shadow-premium active:scale-[0.97] transition-all"
            >
              <Plus size={15} strokeWidth={2.5} /> Pridať akciu
            </button>

            {showForm && (
              <form onSubmit={handleAddEvent} className="bg-card rounded-2xl border border-border p-6 mb-6 space-y-4 shadow-premium">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Názov *</label>
                    <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Dátum *</label>
                    <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Popis</label>
                  <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Hostia</label>
                    <input type="number" min={1} max={500} value={newGuests} onChange={(e) => setNewGuests(Number(e.target.value))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Stav</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as 'confirmed' | 'tentative')} className={inputClass}>
                      <option value="confirmed">Potvrdená</option>
                      <option value="tentative">Predbežná</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={newPrivate} onChange={(e) => setNewPrivate(e.target.checked)}
                        className="rounded border-input" style={{ accentColor: 'hsl(40, 82%, 52%)' }} />
                      {newPrivate ? <EyeOff size={14} /> : <Eye size={14} />}
                      Súkromná
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-premium active:scale-[0.97] transition-all disabled:opacity-50">
                    {saving ? <Loader2 size={14} className="animate-spin inline mr-2" /> : null}
                    {saving ? 'Ukladám...' : 'Uložiť akciu'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-all">
                    Zrušiť
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {events.map((ev) => (
                <div key={ev.id} className="bg-card rounded-xl border border-border p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-border/80 transition-all group">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-foreground text-sm">{ev.title}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        ev.status === 'confirmed' ? 'bg-destructive/12 text-destructive' : 'bg-gold/12 text-gold'
                      }`}>
                        {ev.status === 'confirmed' ? 'Potvrdená' : 'Predbežná'}
                      </span>
                      {ev.is_private && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                          <EyeOff size={10} /> Súkromná
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CalendarDays size={12} />
                      {format(new Date(ev.event_date), 'd. MMMM yyyy', { locale: sk })}
                      {ev.guest_count ? <><Users size={12} className="ml-2" /> {ev.guest_count} hostí</> : ''}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteEvent(ev.id)}
                    className="p-2.5 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/8 transition-all shrink-0 opacity-0 group-hover:opacity-100">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-16">
                  <CalendarDays size={32} className="text-muted-foreground/15 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Žiadne akcie</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reservations tab */}
        {tab === 'reservations' && (
          <div className="space-y-2.5">
            {reservations.map((r) => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-4 sm:p-5 group hover:border-border/80 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-foreground text-sm">{r.name}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        r.status === 'pending' ? 'bg-gold/12 text-gold' :
                        r.status === 'confirmed' ? 'bg-success/15 text-success' :
                        'bg-destructive/12 text-destructive'
                      }`}>
                        {r.status === 'pending' ? 'Čaká na potvrdenie' : r.status === 'confirmed' ? 'Potvrdená' : 'Zrušená'}
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
                      <button onClick={() => handleResStatus(r.id, 'confirmed')}
                        className="p-2.5 text-success hover:bg-success/10 rounded-xl transition-all active:scale-95" title="Potvrdiť">
                        <Check size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => handleResStatus(r.id, 'cancelled')}
                        className="p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-95" title="Zrušiť">
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {reservations.length === 0 && (
              <div className="text-center py-16">
                <ClipboardList size={32} className="text-muted-foreground/15 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Žiadne rezervácie</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
