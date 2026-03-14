"use client";

import HeroSection           from '../components/home/HeroSection';
import ServiceCardsSection   from '../components/home/ServiceCardsSection';
import GlobalCoverageSection from '../components/home/GlobalCoverageSection';
import SeamlessSection       from '../components/home/SeamlessSection';
import FeaturesSection       from '../components/home/FeaturesSection';
import VehiclesSection       from '../components/home/VehiclesSection';
import DestinationsSection   from '../components/home/DestinationsSection';
import FAQSection            from '../components/home/FAQSection';
import NewsletterSection     from '../components/home/NewsletterSection';
import Footer                from '../components/home/Footer';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServiceCardsSection />
      <GlobalCoverageSection />
      <SeamlessSection />
      <FeaturesSection />
      <VehiclesSection />
      <DestinationsSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}