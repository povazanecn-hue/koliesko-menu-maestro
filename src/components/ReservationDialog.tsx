import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Send, Loader2, CalendarCheck, User, Mail, Phone, Users, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
}

export default function ReservationDialog({ open, onOpenChange, selectedDate }: ReservationDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(20);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !name.trim() || !email.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('reservations').insert({
      event_date: format(selectedDate, 'yyyy-MM-dd'),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      guest_count: guestCount,
      message: message.trim() || null,
      status: 'pending',
    });

    setSubmitting(false);
    if (error) {
      toast.error('Chyba pri odosielaní. Skúste znova.');
      return;
    }

    toast.success('Rezervácia odoslaná! Ozveme sa vám.');
    setName('');
    setEmail('');
    setPhone('');
    setGuestCount(20);
    setMessage('');
    onOpenChange(false);
  };

  const inputClass = "w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center">
              <CalendarCheck size={18} className="text-gold" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl text-foreground">
                Rezervácia termínu
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mt-0.5">
                {selectedDate
                  ? format(selectedDate, "EEEE, d. MMMM yyyy", { locale: sk })
                  : ''}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              <User size={12} /> Meno *
            </label>
            <input type="text" required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Vaše meno" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              <Mail size={12} /> E-mail *
            </label>
            <input type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="vas@email.sk" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              <Phone size={12} /> Telefón
            </label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+421 ..." />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              <Users size={12} /> Počet hostí
            </label>
            <input type="number" min={1} max={500} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className={`${inputClass} tabular-nums`} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              <MessageSquare size={12} /> Správa
            </label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={3}
              className={`${inputClass} resize-none`} placeholder="Typ akcie, špeciálne požiadavky..." />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-premium glow-gold-hover active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {submitting ? 'Odosielam...' : 'Odoslať rezerváciu'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
