import { Link } from 'react-router-dom';
import logo from '@/assets/logo-koliesko-gold.png';
import { MapPin, Phone, Mail, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-surface-overlay border-t border-border/30 overflow-hidden">
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container mx-auto px-4 max-w-6xl py-20">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={logo} alt="Koliesko Country Klub" className="h-14 w-auto mb-5" />
            <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-xs mb-6">
              Tradičná slovenská a česká kuchyňa v&nbsp;srdci Bratislavy-Trnávky od roku 2004.
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground/40 hover:text-gold transition-colors duration-300"
            >
              Späť nahor ↑
            </button>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-5">Navigácia</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Domov', to: '/' },
                { label: 'Denné menu', to: '/denne-menu' },
                { label: 'Jedálny lístok', to: '/menu' },
                { label: 'Akcie & Eventy', to: '/akcie' },
                { label: 'E-shop', to: '/eshop' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group text-sm text-muted-foreground/60 hover:text-gold transition-all duration-300 inline-flex items-center gap-1"
                >
                  {item.label}
                  <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* More */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-5">Viac</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: 'O nás', to: '/o-nas' },
                { label: 'Galéria', to: '/galeria' },
                { label: 'Kontakt', to: '/kontakt' },
                { label: 'Rezervácia', to: '/rezervacia' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group text-sm text-muted-foreground/60 hover:text-gold transition-all duration-300 inline-flex items-center gap-1"
                >
                  {item.label}
                  <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-5">Kontakt</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground/60">
                <MapPin size={14} className="text-gold/50 shrink-0" />
                Banšelova 3, Bratislava
              </div>
              <a href="tel:+421903510220" className="flex items-center gap-3 text-sm text-muted-foreground/60 hover:text-gold transition-colors">
                <Phone size={14} className="text-gold/50 shrink-0" />
                0903 510 220
              </a>
              <a href="mailto:rezervacie@klubkoliesko.sk" className="flex items-center gap-3 text-sm text-muted-foreground/60 hover:text-gold transition-colors">
                <Mail size={14} className="text-gold/50 shrink-0" />
                rezervacie@klubkoliesko.sk
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/30 flex items-center gap-1.5">
            © 2026 Koliesko Country Klub · S <Heart size={10} className="text-gold/40" /> v Bratislave
          </p>
          <Link to="/login" className="text-xs text-muted-foreground/20 hover:text-muted-foreground/50 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
