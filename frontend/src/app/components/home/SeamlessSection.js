"use client";

import Image from 'next/image';

export default function SeamlessSection() {
  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left: content */}
          <div className="space-y-5 order-2 lg:order-1">
            <div>
              <p className="text-[#00B1C5] font-semibold text-sm tracking-wide mb-2">
                Travel Comfortably, Arrive Confidently
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005F56]">
                Seamless
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Enjoy the luxury of a private chauffeur service tailored exclusively for you.
              Our seamless online booking makes traveling stress-free, allowing you to focus
              on what truly matters. Arrive at your destination feeling refreshed and assured.
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Our professional chauffeurs provide exceptional reliability and personalized
              attention, ensuring a comfortable and smooth journey every time.
            </p>
          </div>

          {/* Right: image */}
          <div className="rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2">
            <Image
              src="/images/main-2.svg"
              alt="Seamless KSA Rides experience"
              width={640}
              height={480}
              className="w-full h-auto object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
