import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'koliesko-cookies-accepted';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-reveal-up">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-premium-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center shrink-0">
              <Cookie size={16} className="text-gold" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Táto stránka používa cookies na zlepšenie používateľského zážitku. Pokračovaním v prehliadaní súhlasíte s ich používaním.{' '}
              <a href="/kontakt" className="text-gold hover:underline underline-offset-2">Viac informácií</a>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={accept}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-premium active:scale-[0.97] transition-all"
            >
              Súhlasím
            </button>
            <button
              onClick={accept}
              className="p-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
              title="Zavrieť"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
