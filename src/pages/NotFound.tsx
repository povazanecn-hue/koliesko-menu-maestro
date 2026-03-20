import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <p className="text-gold text-sm uppercase tracking-[0.25em] font-medium mb-4">Chyba</p>
        <h1 className="font-display text-6xl md:text-8xl font-bold text-foreground mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-8">Stránka ktorú hľadáte neexistuje.</p>
        <Link
          to="/"
          className="inline-block px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-gold/25 active:scale-[0.97]"
        >
          Späť na domov
        </Link>
      </div>
    </div>
  );
};

export default NotFound;