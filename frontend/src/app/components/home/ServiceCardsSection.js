"use client";

import Link from 'next/link';
import { Globe, Users, Clock, Car } from 'lucide-react';

const services = [
  {
    Icon: Globe,
    title: 'Global',
    description:
      'Wherever your journey leads, KSA Rides ensures your comfort along the way.',
    href: '/about',
  },
  {
    Icon: Users,
    title: 'Professional drivers',
    description: 'Professional Drivers, Timely Rides, Relaxed Travel.',
    href: '/about',
  },
  {
    Icon: Clock,
    title: 'Chauffeur by the hour',
    description:
      'Hire an hourly chauffeur for your business or leisure needs.',
    href: '/hourly-service',
  },
  {
    Icon: Car,
    title: 'City rides',
    description:
      'Explore the city anytime, anywhere—even long distances.',
    href: '/city-rides',
  },
];

export default function ServiceCardsSection() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {services.map(({ Icon, title, description, href }) => (
            <div
              key={title}
              className="bg-[#EDF4F7] rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-800 pr-2">{title}</h3>
                  <div className="p-2 rounded-lg bg-white flex-shrink-0 shadow-sm">
                    <Icon className="h-5 w-5 text-[#005F56]" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
              <div className="mt-6">
                <Link
                  href={href}
                  className="inline-block px-5 py-2 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  style={{
                    background:
                      'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)',
                  }}
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
