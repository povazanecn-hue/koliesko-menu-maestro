import { Link } from 'react-router-dom';
import logo from '@/assets/logo-koliesko.png';

export default function Footer() {
  return (
    <footer className="py-12 bg-surface-overlay border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img src={logo} alt="Koliesko Country Klub" className="h-8 w-auto" />
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-gold transition-colors">Domov</Link>
            <Link to="/akcie" className="hover:text-gold transition-colors">Akcie</Link>
            <Link to="/eshop" className="hover:text-gold transition-colors">E-shop</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Koliesko Country Klub. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
}
