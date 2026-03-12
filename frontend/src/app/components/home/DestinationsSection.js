"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Globe, Building2, Mountain, Plane } from 'lucide-react';

const filters = [
  { label: 'Countries+', Icon: Globe },
  { label: 'Cities+',    Icon: Building2 },
  { label: 'Ski destinations+', Icon: Mountain },
];

const destinations = [
  {
    city: 'Sharm el Sheikh',
    airport: 'Sharm el Sheikh Airport',
    image: '/images/Aerial view of Sharm el Sheikh airport.svg',
  },
  {
    city: 'Heraklion',
    airport: 'Crete Heraklion Airport',
    image: '/images/Aerial view of Heraklion airport.svg',
  },
  {
    city: 'London',
    airport: 'London Gatwick Airport',
    image: '/images/Aerial view of London airport.svg',
  },
  {
    city: 'Atlanta',
    airport: 'Atlanta International Airport',
    image: '/images/Aerial view of Atlanta airport.svg',
  },
  {
    city: 'Trieste',
    airport: 'Trieste Airport',
    image: '/images/Aerial view of Trieste airport.svg',
  },
  {
    city: 'Vilnius',
    airport: 'Vilnius Airport',
    image: '/images/Aerial view of Vilnius airport.svg',
  },
];

export default function DestinationsSection() {
  const [activeFilter, setActiveFilter] = useState('Countries+');

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#005F56]">Destinations</h2>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  activeFilter === label
                    ? 'border-[#005F56] text-[#005F56] bg-[#005F56]/5'
                    : 'border-gray-300 text-gray-600 hover:border-[#00B1C5] hover:text-[#005F56]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 font-medium mb-1">
          Book a private transfer at over 1500 airports, stations and ports worldwide
        </p>
        <p className="text-gray-500 text-sm mb-8 max-w-3xl">
          Travel in comfort, safety, and convenience with professional drivers and hassle-free pickups.
          Reserve your transfer today and enjoy a stress-free journey from start to finish!
        </p>

        {/* 2×3 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map(({ city, airport, image }) => (
            <a
              key={city}
              href="#"
              className="relative rounded-2xl overflow-hidden h-52 sm:h-56 group cursor-pointer block"
            >
              <Image
                src={image}
                alt={city}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight">{city}</h3>
                <p className="flex items-center gap-1.5 text-white/80 text-xs mt-0.5">
                  <Plane className="h-3 w-3 flex-shrink-0" />
                  {airport}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
