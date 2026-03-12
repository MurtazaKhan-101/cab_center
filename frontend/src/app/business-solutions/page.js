"use client";

import BusinessSolutionsHero  from '../components/business-solutions/BusinessSolutionsHero';
import TrustedPartnersSection from '../components/business-solutions/TrustedPartnersSection';
import WhyBusinessSection     from '../components/business-solutions/WhyBusinessSection';
import AgencyReviewsSection   from '../components/travel-agencies/AgencyReviewsSection';
import BusinessContactSection from '../components/business-solutions/BusinessContactSection';
import VehiclesSection        from '../components/home/VehiclesSection';
import BusinessSignUpSection  from '../components/business-solutions/BusinessSignUpSection';
import Footer                 from '../components/home/Footer';

export default function BusinessSolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <BusinessSolutionsHero />
      <TrustedPartnersSection />
      <WhyBusinessSection />
      <AgencyReviewsSection />
      <BusinessContactSection />
      <VehiclesSection />
      <BusinessSignUpSection />
      <Footer />
    </div>
  );
}
