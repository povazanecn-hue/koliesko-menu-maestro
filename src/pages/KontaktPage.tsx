import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { MapPin, Phone, Mail, Clock, Navigation, Send, Loader2, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function KontaktPage() {
  const { ref, isVisible } = useScrollReveal(0.12);
  const { ref: formRef, isVisible: formVisible } = useScrollReveal(0.12);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim(),
    });
    setSubmitting(false);

    if (error) {
      toast.error('Správu sa nepodarilo odoslať. Skúste to znova.');
      return;
    }

    toast.success('Ďakujeme za vašu správu! Ozveme sa vám čo najskôr.');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const inputClass = "w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200";

  const contactItems = [
    { icon: MapPin, label: 'Adresa', value: 'Banšelova 3, 821 04 Bratislava', href: undefined },
    { icon: Phone, label: 'Telefón', value: '0903 510 220', href: 'tel:+421903510220' },
    { icon: Mail, label: 'E-mail', value: 'rezervacie@klubkoliesko.sk', href: 'mailto:rezervacie@klubkoliesko.sk' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Kontakt | Koliesko Country Klub</title>
        <meta name="description" content="Kontaktujte Koliesko Country Klub v Bratislave. Adresa, telefón, otváracie hodiny a kontaktný formulár." />
      </Helmet>
      <Navbar />

      <section className="pt-28 md:pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <Navigation size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Kontakt</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4" style={{ lineHeight: '0.95', letterSpacing: '-0.02em' }}>
            Napíšte <span className="text-gold italic">nám</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Máte otázky, pripomienky alebo si chcete niečo dohodnúť? Vyplňte formulár alebo nás kontaktujte priamo.
          </p>
        </div>
      </section>

      <section className="pb-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div ref={ref} className={`space-y-6 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
              <div className="bg-card rounded-2xl border border-border p-6 shadow-premium space-y-5">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                      <Icon size={17} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-foreground hover:text-gold transition-colors font-medium text-sm">{value}</a>
                      ) : (
                        <p className="text-foreground font-medium text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                    <Clock size={17} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Otváracie hodiny</p>
                    <p className="text-foreground font-medium text-sm">Po–Pi: 10:00 – 22:00</p>
                    <p className="text-muted-foreground text-sm">So–Ne: 11:00 – 23:00</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border h-64 shadow-premium">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.1!2d17.15!3d48.16!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA5JzM2LjAiTiAxN8KwMDknMDAuMCJF!5e0!3m2!1ssk!2ssk!4v1"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)' }}
                  allowFullScreen loading="lazy" title="Koliesko Country Klub mapa"
                />
              </div>
            </div>

            <div ref={formRef} className={`${formVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-premium-lg space-y-4">
                <h2 className="font-display text-xl font-bold text-foreground mb-2">Kontaktný formulár</h2>
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
                    <MessageSquare size={12} /> Správa *
                  </label>
                  <textarea required value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={5}
                    className={`${inputClass} resize-none`} placeholder="Vaša správa, otázka alebo požiadavka..." />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-premium glow-gold-hover active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? 'Odosielam...' : 'Odoslať správu'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
