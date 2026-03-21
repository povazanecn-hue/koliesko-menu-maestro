import { Link } from 'react-router-dom';
import logo from '@/assets/logo-koliesko-gold.png';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div>
            <img src={logo} alt="Koliesko Country Klub" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tradičná slovenská a česká kuchyňa v&nbsp;Bratislave od roku 2004.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Navigácia</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Domov', to: '/' },
                { label: 'Denné menu', to: '/denne-menu' },
                { label: 'Jedálny lístok', to: '/menu' },
                { label: 'Akcie & Eventy', to: '/akcie' },
                { label: 'E-shop', to: '/eshop' },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* More */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Viac</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'O nás', to: '/o-nas' },
                { label: 'Galéria', to: '/galeria' },
                { label: 'Kontakt', to: '/kontakt' },
                { label: 'Rezervácia', to: '/rezervacia' },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Kontakt</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary shrink-0" />
                Banšelova 3, Bratislava
              </div>
              <a href="tel:+421903510220" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone size={14} className="text-primary shrink-0" />
                0903 510 220
              </a>
              <a href="mailto:rezervacie@klubkoliesko.sk" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail size={14} className="text-primary shrink-0" />
                rezervacie@klubkoliesko.sk
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Koliesko Country Klub</p>
          <Link to="/login" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
