"use client";

import TravelAgenciesHero  from '../components/travel-agencies/TravelAgenciesHero';
import WhyPartnerSection   from '../components/travel-agencies/WhyPartnerSection';
import AgencyCtaBanner     from '../components/travel-agencies/AgencyCtaBanner';
import AgencyReviewsSection from '../components/travel-agencies/AgencyReviewsSection';
import LetsConnectSection  from '../components/travel-agencies/LetsConnectSection';
import VehiclesSection     from '../components/home/VehiclesSection';
import AgencySignUpSection from '../components/travel-agencies/AgencySignUpSection';
import Footer              from '../components/home/Footer';

export default function TravelAgenciesPage() {
  return (
    <div className="min-h-screen bg-white">
      <TravelAgenciesHero />
      <WhyPartnerSection />
      <AgencyCtaBanner />
      <AgencyReviewsSection />
      <LetsConnectSection />
      <VehiclesSection />
      <AgencySignUpSection />
      <Footer />
    </div>
  );
}
