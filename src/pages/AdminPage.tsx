import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Plus, Trash2, LogOut, CalendarDays, ClipboardList, Loader2, Check, X } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Event = Tables<'events'>;
type Reservation = Tables<'reservations'>;

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'events' | 'reservations'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // New event form
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
      title: newTitle,
      event_date: newDate,
      description: newDesc || null,
      guest_count: newGuests,
      status: newStatus,
      is_private: newPrivate,
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
    fetchData();
  };

  const handleResStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    await supabase.from('reservations').update({ status }).eq('id', id);
    fetchData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface-overlay border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="font-display text-xl font-bold text-foreground">Admin Panel</h1>
          <button onClick={() => { signOut(); navigate('/'); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={16} /> Odhlásiť
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('events')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'events' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            <CalendarDays size={16} /> Akcie ({events.length})
          </button>
          <button
            onClick={() => setTab('reservations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'reservations' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            <ClipboardList size={16} /> Rezervácie ({reservations.length})
          </button>
        </div>

        {/* Events tab */}
        {tab === 'events' && (
          <div>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm mb-6 hover:shadow-lg hover:shadow-gold/20 active:scale-[0.97] transition-all">
              <Plus size={16} /> Pridať akciu
            </button>

            {showForm && (
              <form onSubmit={handleAddEvent} className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Názov *</label>
                    <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Dátum *</label>
                    <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Popis</label>
                  <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Počet hostí</label>
                    <input type="number" min={1} max={500} value={newGuests} onChange={(e) => setNewGuests(Number(e.target.value))}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Stav</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as 'confirmed' | 'tentative')}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="confirmed">Potvrdená</option>
                      <option value="tentative">Predbežná</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={newPrivate} onChange={(e) => setNewPrivate(e.target.checked)}
                        className="rounded border-input accent-gold" />
                      Súkromná akcia
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg active:scale-[0.97] transition-all disabled:opacity-50">
                  {saving ? 'Ukladám...' : 'Uložiť'}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{ev.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ev.status === 'confirmed' ? 'bg-destructive/15 text-destructive' : 'bg-gold/15 text-gold'}`}>
                        {ev.status === 'confirmed' ? 'Potvrdená' : 'Predbežná'}
                      </span>
                      {ev.is_private && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">Súkromná</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(ev.event_date), 'd. MMMM yyyy', { locale: sk })}
                      {ev.guest_count ? ` · ${ev.guest_count} hostí` : ''}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {events.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">Žiadne akcie</p>}
            </div>
          </div>
        )}

        {/* Reservations tab */}
        {tab === 'reservations' && (
          <div className="space-y-3">
            {reservations.map((r) => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{r.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        r.status === 'pending' ? 'bg-gold/15 text-gold' :
                        r.status === 'confirmed' ? 'bg-green-500/15 text-green-400' :
                        'bg-destructive/15 text-destructive'
                      }`}>
                        {r.status === 'pending' ? 'Čaká' : r.status === 'confirmed' ? 'Potvrdená' : 'Zrušená'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(r.event_date), 'd. MMMM yyyy', { locale: sk })} · {r.guest_count} hostí
                    </p>
                    <p className="text-sm text-muted-foreground">{r.email} {r.phone ? `· ${r.phone}` : ''}</p>
                    {r.message && <p className="text-sm text-muted-foreground mt-1 italic">"{r.message}"</p>}
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleResStatus(r.id, 'confirmed')} className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors">
                        <Check size={16} />
                      </button>
                      <button onClick={() => handleResStatus(r.id, 'cancelled')} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {reservations.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">Žiadne rezervácie</p>}
          </div>
        )}
      </div>
    </div>
  );
}
