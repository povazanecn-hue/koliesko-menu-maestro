import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-koliesko-gold.png';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';

const navItems = [
  { label: 'Domov', path: '/' },
  { label: 'Denné menu', path: '/denne-menu' },
  { label: 'Jedálny lístok', path: '/menu' },
  { label: 'Akcie & Eventy', path: '/akcie' },
  { label: 'E-shop', path: '/eshop' },
  { label: 'O nás', path: '/o-nas' },
  { label: 'Kontakt', path: '/kontakt' },
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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'glass-strong border-b border-border/50 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="container mx-auto flex items-center justify-between h-16 md:h-[72px] px-4 lg:px-8">
          <Link to="/" className="flex items-center group relative">
            <img
              src={logo}
              alt="Koliesko Country Klub"
              className="h-14 md:h-16 w-auto transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNav(e, item.path)}
                  className={`relative px-3.5 py-2 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'text-gold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full gold-gradient" />
                  )}
                </Link>
              );
            })}
            <a
              href="tel:+421903510220"
              className="ml-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient text-primary-foreground text-[13px] font-bold tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(40_82%_52%/0.3)] active:scale-[0.97]"
            >
              <Phone size={14} strokeWidth={2.5} />
              Rezervovať
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl text-foreground hover:bg-secondary/50 active:scale-95 transition-all"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div
            className="absolute top-[64px] left-0 right-0 bottom-0 bg-surface-overlay/98 backdrop-blur-2xl border-t border-border overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-6 gap-1">
              {navItems.map((item, i) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNav(e, item.path)}
                  className="flex items-center justify-between text-base font-medium text-muted-foreground hover:text-gold py-4 px-4 rounded-xl transition-all border-b border-border/30 last:border-0"
                  style={{ animation: `reveal-up 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s forwards`, opacity: 0 }}
                >
                  {item.label}
                  <ChevronRight size={16} className="text-muted-foreground/30" />
                </Link>
              ))}
              <a
                href="tel:+421903510220"
                className="mt-6 px-6 py-4 rounded-xl gold-gradient text-primary-foreground text-base font-bold text-center transition-all hover:shadow-premium"
                style={{ animation: `reveal-up 0.4s cubic-bezier(0.16,1,0.3,1) 0.35s forwards`, opacity: 0 }}
              >
                <Phone size={16} className="inline mr-2" />
                Rezervovať stôl
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
