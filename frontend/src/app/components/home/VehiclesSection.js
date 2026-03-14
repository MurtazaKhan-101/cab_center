"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Users, Briefcase } from 'lucide-react';

const vehicles = [
  {
    name: 'Standard Class',
    passengers: 3,
    luggage: 3,
    examples: 'Toyota Camry, Honda Accord or similar',
    image: '/images/Standard Class Taxi.svg',
  },
  {
    name: 'First Class',
    passengers: 3,
    luggage: 3,
    examples: 'Mercedes S Class, BMW 7, Audi A8, Cadillac Escalade or similar',
    image: '/images/First Class Transfer.svg',
  },
  {
    name: 'SUV',
    passengers: 6,
    luggage: 6,
    examples: 'Cadillac Escalade, Chevrolet Suburban or similar',
    image: '/images/SUV Limo Class.svg',
  },
  {
    name: 'Van Standard',
    passengers: 7,
    luggage: 7,
    examples: 'Mercedes Vito, Ford Custom, Chevrolet Suburban or similar',
    image: '/images/Standard Van Transfer.svg',
  },
  {
    name: 'Van First Class',
    passengers: 6,
    luggage: 6,
    examples: 'Mercedes V Class, Cadillac Escalade or similar',
    image: '/images/First Class Van Transfer.svg',
  },
  {
    name: 'Minibus (12 Pax)',
    passengers: 12,
    luggage: 12,
    examples: 'Mercedes Sprinter, Ford Transit or similar',
    image: '/images/Minibus 12 Pax.svg',
  },
];

export default function VehiclesSection() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <section className="py-12 lg:py-20 bg-white overflow-hidden">

      {/* Header — constrained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Maximum comfort and safety for your trip
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Licensed vehicles, professional drivers
          </p>
        </div>
      </div>

      {/* Carousel — full width with peek on edges */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-6 sm:px-12"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {vehicles.map(({ name, passengers, luggage, examples, image }) => (
            <div
              key={name}
              className="flex-none w-56 sm:w-64 bg-gray-100 rounded-2xl p-5 flex flex-col"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="h-36 flex items-center justify-center mb-4">
                <Image
                  src={image}
                  alt={name}
                  width={220}
                  height={144}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-2">{name}</h3>
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <Users className="h-3.5 w-3.5 text-gray-500" />
                  {passengers}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <Briefcase className="h-3.5 w-3.5 text-gray-500" />
                  {luggage}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{examples}</p>
            </div>
          ))}
        </div>

        {/* Navigation arrows — bottom right */}
        <div className="flex justify-end gap-2 mt-4 px-6 sm:px-12">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors shadow-md"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors shadow-md"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Reviews row — constrained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mt-10 py-5 border-t border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
            <span className="text-gray-600 font-medium">Our customers say</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold text-gray-800 uppercase tracking-wide text-xs">Excellent</span>
              <span className="text-gray-500">Rated <strong>4.8 / 5</strong> based on <strong>34,188 reviews</strong></span>
            </div>
            <span className="text-gray-400 font-semibold text-sm">✦ Trustpilot</span>
          </div>
        </div>
      </div>

    </section>
  );
}
