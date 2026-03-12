"use client";

import AboutHero             from '../components/about/AboutHero';
import AboutTrustedBrands    from '../components/about/AboutTrustedBrands';
import AboutStorySection     from '../components/about/AboutStorySection';
import AgencyReviewsSection  from '../components/travel-agencies/AgencyReviewsSection';
import AboutCommitmentSection from '../components/about/AboutCommitmentSection';
import VehiclesSection       from '../components/home/VehiclesSection';
import Footer                from '../components/home/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <AboutTrustedBrands />
      <AboutStorySection />
      <AgencyReviewsSection />
      <AboutCommitmentSection />
      <VehiclesSection />
      <Footer />
    </div>
  );
}
