import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo-koliesko.png';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Domov', path: '/' },
  { label: 'Denné menu', path: '/#denne-menu' },
  { label: 'Akcie & Eventy', path: '/akcie' },
  { label: 'E-shop', path: '/eshop' },
  { label: 'Kontakt', path: '/#kontakt' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileOpen(false);
    if (path.includes('#')) {
      const hash = path.split('#')[1];
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-overlay/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Koliesko" className="h-10 w-10 transition-transform group-hover:rotate-45 duration-500" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold text-foreground tracking-tight">Koliesko</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">Country Klub</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleNav(item.path)}
              className={`text-sm font-medium transition-colors duration-200 hover:text-gold ${
                location.pathname === item.path ? 'text-gold' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:+421903510220"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 active:scale-[0.97]"
          >
            Rezervovať
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground active:scale-95 transition-transform"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-overlay border-t border-border animate-reveal-up">
          <div className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleNav(item.path)}
                className="text-sm font-medium text-muted-foreground hover:text-gold py-2"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+421903510220"
              className="px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center"
            >
              Rezervovať
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
