"use client";

import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import FAQSection from '../components/home/FAQSection';
import Footer from '../components/home/Footer';

export default function Homepage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  );
}