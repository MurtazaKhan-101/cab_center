"use client";

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const reviews = [
  {
    id: 1,
    title: 'The driver was friendly and patient',
    body: 'The driver was friendly and patient. The vehicle was good.',
    author: 'Ebru Barsal Cetiner',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Both drivers were on time and excellent...',
    body: 'Both drivers were on time and excellent communication. Nice cars both ways.',
    author: 'David Passmore',
    time: '2 hours ago',
  },
  {
    id: 3,
    title: 'Driver was reliable and safe',
    body: 'Driver was communicative, friendly and on time. Car was clean and very comfortable.',
    author: 'Jane',
    time: '4 hours ago',
  },
  {
    id: 4,
    title: 'On time pick-up with no confusion...',
    body: 'On time pick-up with no confusion to who was picking us up.',
    author: 'Wanda',
    time: '5 hours ago',
  },
  {
    id: 5,
    title: 'Professional and courteous service',
    body: 'Very professional service from booking to drop-off. Highly recommend KSA Rides.',
    author: 'Mohammed Al-Rashid',
    time: '1 day ago',
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function AgencyReviewsSection() {
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  return (
    <section className="py-14 lg:py-20 bg-[#F4F6F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <span className="text-[#00B1C5]">✦</span> Reviews
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm">
            <span className="text-gray-600 font-medium">Our customers say</span>
            <StarRow />
            <span className="font-bold text-gray-800 uppercase tracking-wide text-xs">Excellent</span>
            <span className="text-gray-500">
              Rated <strong>4.8 / 5</strong> based on <strong>34,195 reviews</strong>
            </span>
            <span className="text-gray-400 font-semibold">✦ Trustpilot</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button onClick={() => scroll(-1)}
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center hover:shadow-lg transition-shadow">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollSnapType: 'x mandatory' }}>
            {reviews.map(({ id, title, body, author, time }) => (
              <div key={id}
                className="flex-none w-72 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between"
                style={{ scrollSnapAlign: 'start' }}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <StarRow />
                    <span className="flex items-center gap-1 text-xs text-[#00B67A] font-semibold">
                      <CheckCircle className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-2">{title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-600">{author}</span>
                  <span className="text-xs text-gray-400">{time}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scroll(1)}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center hover:shadow-lg transition-shadow">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Rated 4.8 / 5 · 34,195 reviews
        </p>
      </div>
    </section>
  );
}
