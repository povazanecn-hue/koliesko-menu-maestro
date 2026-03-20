import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { Send, Loader2 } from 'lucide-react';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            Rezervácia termínu
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {selectedDate
              ? format(selectedDate, "EEEE, d. MMMM yyyy", { locale: sk })
              : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Meno *</label>
            <input
              type="text"
              required
              maxLength={200}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Vaše meno"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">E-mail *</label>
            <input
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="vas@email.sk"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Telefón</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="+421 ..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Počet hostí</label>
            <input
              type="number"
              min={1}
              max={500}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring tabular-nums"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Správa</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Typ akcie, špeciálne požiadavky..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 active:scale-[0.97] disabled:opacity-50"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {submitting ? 'Odosielam...' : 'Odoslať rezerváciu'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
