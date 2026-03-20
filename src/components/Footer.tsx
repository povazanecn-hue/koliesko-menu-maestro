import { Link } from 'react-router-dom';
import logo from '@/assets/logo-koliesko-gold.png';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-16 bg-surface-overlay border-t border-border relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div>
            <img src={logo} alt="Koliesko Country Klub" className="h-14 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Tradičná slovenská a česká kuchyňa v srdci Bratislavy-Trnávky od roku 2004.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4">Navigácia</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Domov', to: '/' },
                { label: 'Denné menu', to: '/denne-menu' },
                { label: 'Jedálny lístok', to: '/menu' },
                { label: 'Akcie & Eventy', to: '/akcie' },
                { label: 'E-shop', to: '/eshop' },
                { label: 'O nás', to: '/o-nas' },
                { label: 'Galéria', to: '/galeria' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4">Kontakt</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin size={14} className="text-gold shrink-0" />
                Banšelova 3, Bratislava
              </div>
              <a href="tel:+421903510220" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-gold transition-colors">
                <Phone size={14} className="text-gold shrink-0" />
                0903 510 220
              </a>
              <a href="mailto:rezervacie@klubkoliesko.sk" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-gold transition-colors">
                <Mail size={14} className="text-gold shrink-0" />
                rezervacie@klubkoliesko.sk
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">© 2026 Koliesko Country Klub. Všetky práva vyhradené.</p>
          <Link to="/login" className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
