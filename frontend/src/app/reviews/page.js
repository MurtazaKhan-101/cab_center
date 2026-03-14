"use client";

import ReviewsTrustSection    from '../components/reviews/ReviewsTrustSection';
import ReviewsQueriesSection  from '../components/reviews/ReviewsQueriesSection';
import ReviewsDetailSection   from '../components/reviews/ReviewsDetailSection';
import AgencyReviewsSection   from '../components/travel-agencies/AgencyReviewsSection';
import Footer                 from '../components/home/Footer';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      <ReviewsTrustSection />
      <ReviewsQueriesSection />
      <ReviewsDetailSection />
      <AgencyReviewsSection />
      <Footer />
    </div>
  );
}
