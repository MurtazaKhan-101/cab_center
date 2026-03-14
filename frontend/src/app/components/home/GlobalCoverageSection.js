"use client";

import Image from 'next/image';

const stats = [
  { label: 'Countries', value: '100+' },
  { label: 'Cities',    value: '2100+' },
  { label: 'Airports',  value: '670+' },
  { label: 'Routes',    value: '∞' },
];

export default function GlobalCoverageSection() {
  return (
    <section className="py-12 lg:py-20 bg-[#EDF4F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left: image */}
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/main-1.svg"
              alt="KSA Rides global coverage"
              width={640}
              height={480}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right: content */}
          <div className="space-y-5">
            <div>
              <p className="text-[#00B1C5] font-semibold text-sm tracking-wide mb-2">
                Your Personal Chauffeur, At Your Fingertips
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005F56]">
                Global Coverage
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Book your private chauffeur in seconds and enjoy a premium travel experience
              tailored to your schedule. Reliable, comfortable, and stress-free transportation
              is now easier than ever. Arrive at your destination refreshed, relaxed, and
              always on time.
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Whether you're traveling for business, leisure, or anything in between, our
              professional chauffeurs provide exceptional service to ensure your journey is
              smooth and effortless. Simply book online, and leave the rest to us.
            </p>

            {/* Logo mark */}
            <div>
              <Image
                src="/images/logo KSA Rides.png"
                alt="KSA Rides"
                width={100}
                height={32}
                className="h-8 w-auto object-contain opacity-50"
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-4 border-t border-gray-200">
              {stats.map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#00B1C5]">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
