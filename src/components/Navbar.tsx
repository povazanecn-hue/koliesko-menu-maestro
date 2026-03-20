import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-koliesko.png';
import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const navItems = [
  { label: 'Domov', path: '/' },
  { label: 'Denné menu', path: '/#denne-menu' },
  { label: 'Kalendár', path: '/#kalendar' },
  { label: 'Akcie & Eventy', path: '/akcie' },
  { label: 'E-shop', path: '/eshop' },
  { label: 'Kontakt', path: '/#kontakt' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-surface-overlay/98 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto flex items-center justify-between h-16 md:h-[72px] px-4 lg:px-8">
        <Link to="/" className="flex items-center group">
          <img
            src={logo}
            alt="Koliesko Country Klub"
            className="h-11 md:h-13 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path.startsWith('/#') && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNav(e, item.path)}
                className={`relative px-3.5 py-2 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-gold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
          <a
            href="tel:+421903510220"
            className="ml-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold tracking-wide transition-all duration-300 hover:shadow-premium glow-gold-hover active:scale-[0.97]"
          >
            <Phone size={14} strokeWidth={2.5} />
            Rezervovať
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-xl text-foreground hover:bg-secondary/50 active:scale-95 transition-all"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-overlay/98 backdrop-blur-xl border-t border-border">
          <div className="flex flex-col p-5 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNav(e, item.path)}
                className="text-sm font-medium text-muted-foreground hover:text-gold hover:bg-secondary/30 py-3 px-4 rounded-xl transition-all"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+421903510220"
              className="mt-3 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold text-center transition-all hover:shadow-premium"
            >
              <Phone size={14} className="inline mr-2" />
              Rezervovať
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
