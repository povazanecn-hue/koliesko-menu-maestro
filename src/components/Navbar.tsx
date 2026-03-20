import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (e: React.MouseEvent, path: string) => {
    setMobileOpen(false);
    if (path.includes('#')) {
      const hash = path.split('#')[1];
      const basePath = path.split('#')[0] || '/';

      if (location.pathname === basePath) {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        e.preventDefault();
        navigate(basePath);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-overlay/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Koliesko Country Klub" className="h-12 md:h-14 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => handleNav(e, item.path)}
              className={`text-sm font-medium transition-colors duration-200 hover:text-gold ${
                location.pathname === item.path || (item.path.startsWith('/#') && location.pathname === '/') ? 'text-gold' : 'text-muted-foreground'
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
                onClick={(e) => handleNav(e, item.path)}
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
