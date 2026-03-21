import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-koliesko-gold.png';
import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto flex items-center justify-between h-18 md:h-20 px-4 lg:px-8">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Koliesko Country Klub"
              className="h-12 md:h-14 w-auto transition-all duration-300"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNav(e, item.path)}
                  className={`px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="tel:+421903510220"
              className="ml-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-[13px] font-semibold tracking-wide transition-all duration-300 hover:bg-foreground/90 active:scale-[0.97]"
            >
              <Phone size={13} />
              Rezervovať
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-foreground active:scale-95 transition-all"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm" />
          <div
            className="absolute top-[72px] left-0 right-0 bg-background border-t border-border overflow-y-auto max-h-[calc(100vh-72px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-6 gap-0">
              {navItems.map((item, i) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNav(e, item.path)}
                  className="text-lg font-medium text-foreground py-4 transition-colors hover:text-primary border-b border-border/50 last:border-0"
                  style={{ animation: `reveal-up 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s forwards`, opacity: 0 }}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="tel:+421903510220"
                className="mt-6 px-6 py-4 rounded-full bg-foreground text-background text-base font-semibold text-center transition-all"
                style={{ animation: `reveal-up 0.4s cubic-bezier(0.16,1,0.3,1) 0.3s forwards`, opacity: 0 }}
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
