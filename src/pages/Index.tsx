import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DailyMenuSection from '@/components/DailyMenuSection';
import AtmosphereSection from '@/components/AtmosphereSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EventsCTASection from '@/components/EventsCTASection';
import EshopTeaser from '@/components/EshopTeaser';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Koliesko Country Klub | Reštaurácia Bratislava – Trnávka</title>
        <meta name="description" content="Tradičná slovenská a česká kuchyňa v Bratislave. Denné menu, firemné akcie, oslavy, online objednávky a rozvoz v zóne Ružinov–Trnávka." />
        <meta property="og:title" content="Koliesko Country Klub | Reštaurácia Bratislava" />
        <meta property="og:description" content="Tradičná slovenská a česká kuchyňa. Denné menu, firemné akcie, online objednávky." />
        <meta property="og:type" content="restaurant" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "Koliesko Country Klub",
          "address": { "@type": "PostalAddress", "streetAddress": "Banšelova 3", "addressLocality": "Bratislava", "postalCode": "821 04", "addressCountry": "SK" },
          "telephone": "+421903510220",
          "servesCuisine": ["Slovak", "Czech"],
          "priceRange": "€€",
          "openingHours": ["Mo-Fr 10:00-22:00", "Sa-Su 11:00-23:00"]
        })}</script>
      </Helmet>
      <Navbar />
      <HeroSection />
      <DailyMenuSection />
      <AtmosphereSection />
      <TestimonialsSection />
      <EventsCTASection />
      <EshopTeaser />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
