"use client";

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function AgencyCtaBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/agency-booking-cta.avif"
          alt="KSA Rides – Elevate your transfers"
          fill
          className="object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#051A18]/80" />
      </div>

      {/* Content */}
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28 text-center text-white">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B1C5]/40 bg-[#00B1C5]/10 text-sm text-[#00B1C5] font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00B1C5]" />
          Elevate your transfers
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
          Unlock better margins &amp; service quality<br className="hidden sm:block" /> for your travel customers
        </h2>

        <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
          Access a curated global network of professional drivers, instant confirmations,
          transparent pricing and tools built for agencies and corporate teams — not just consumers.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <a
            href="#signup"
            className="px-7 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}
          >
            Start now
          </a>
          <a
            href="#connect"
            className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-white text-sm border border-white/30 hover:border-white/60 transition-colors"
          >
            Talk to our team <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50 font-semibold tracking-widest uppercase">
          {['Instant Confirmations', 'Secure Payments', 'Multi-Language Support'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B1C5]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
