import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DailyMenuSection from '@/components/DailyMenuSection';
import AtmosphereSection from '@/components/AtmosphereSection';
import EventsCTASection from '@/components/EventsCTASection';
import EshopTeaser from '@/components/EshopTeaser';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <DailyMenuSection />
      <AtmosphereSection />
      <EventsCTASection />
      <EshopTeaser />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
