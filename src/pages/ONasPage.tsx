import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import heroImg from '@/assets/koliesko-skica.jpeg';
import { Heart, Users, Utensils, TreePine, Star, MapPin } from 'lucide-react';

export default function ONasPage() {
  const { ref, isVisible } = useScrollReveal(0.1);
  const { ref: valRef, isVisible: valVisible } = useScrollReveal(0.12);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>O nás | Koliesko Country Klub</title>
        <meta name="description" content="Spoznajte príbeh Koliesko Country Klubu — rodinná reštaurácia v Bratislave od roku 2004." />
        <meta property="og:title" content="O nás | Koliesko Country Klub" />
        <meta property="og:description" content="Miesto, kde sa stretávajú chute a ľudia — už vyše 20 rokov." />
      </Helmet>
      <Navbar />

      {/* Hero with sketch */}
      <section className="pt-28 md:pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
                <Heart size={13} className="text-gold" />
                <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Od roku 2004</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-5" style={{ lineHeight: '1.05', letterSpacing: '-0.02em' }}>
                Miesto, kde sa <span className="text-gold italic">stretávajú</span> chute a ľudia
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                Koliesko Country Klub je rodinná reštaurácia v bratislavskej Trnávke. Už vyše 20 rokov pripravujeme tradičné slovenské a české jedlá z čerstvých surovín. Naše priestory sú ideálne na firemné akcie, oslavy aj každodenné obedy.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Veríme v jednoduchosť, poctivé prísady a atmosféru, v ktorej sa cítite ako doma. Či už prídete na rýchly obed alebo na veľkú oslavu — postaráme sa o vás.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-premium-lg">
              <img src={heroImg} alt="Koliesko Country Klub – skica interiéru" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valRef} className="py-24 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className={`text-center mb-14 ${valVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.01em' }}>
              Čo nás robí <span className="text-gold italic">výnimočnými</span>
            </h2>
          </div>
          <div className={`grid sm:grid-cols-2 gap-5 ${valVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
            {[
              { icon: Utensils, title: 'Poctivá kuchyňa', desc: 'Varíme z čerstvých, lokálnych surovín. Žiadne polotovary — všetko robíme od základov.' },
              { icon: Users, title: 'Rodinná atmosféra', desc: 'Malý tím, veľké srdce. Každý hosť je pre nás dôležitý.' },
              { icon: TreePine, title: 'Krásne priestory', desc: 'Útulný interiér s letnou terasou a záhradou — ideálne na akcie aj relaxáciu.' },
              { icon: Heart, title: 'Tradícia & srdce', desc: 'Viac než 20 rokov skúseností. Varíme s láskou a rešpektom k tradíciám.' },
            ].map((v) => (
              <div key={v.title} className="bg-background rounded-xl border border-border p-6 group hover:border-gold/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center mb-4 group-hover:bg-gold/15 transition-colors">
                  <v.icon size={18} className="text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
