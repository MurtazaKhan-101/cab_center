"use client";

import Image from 'next/image';
import { Globe, Headphones, Clock, ArrowRight } from 'lucide-react';

const stats = [
  { value: '300+',  label: 'ENTERPRISE CLIENTS',  sub: 'Global organisations manage travel with KSA Rides.' },
  { value: '99.3%', label: 'TRIP SUCCESS RATE',   sub: 'Delivering reliable rides for executives and guests.' },
  { value: '4.9/5', label: 'SATISFACTION SCORE',  sub: 'Consistently rated by travel managers and passengers.' },
];

export default function BusinessSolutionsHero() {
  return (
    <section className="bg-[#051A18] text-white">

      {/* ── Hero content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-0">

        {/* Breadcrumb */}
        <p className="text-xs text-white/40 font-semibold tracking-widest uppercase mb-6 flex items-center gap-2">
          <a href="/home" className="hover:text-white/70 transition-colors">Home</a>
          <span>▸</span>
          <span>Business Solutions</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start pb-16">

          {/* Left */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-sm text-white/80">
              <span className="w-2 h-2 rounded-full bg-[#00B1C5]" />
              Corporate Travel Solutions
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Business<br />Solutions
            </h1>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-lg">
              Centralize every executive transfer, control spend, and unlock
              premium service levels through a single secure dashboard.
            </p>

            {/* Mini feature cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white/8 border border-white/15 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Dedicated Account Support</span>
                  <div className="w-8 h-8 rounded-full bg-[#00B1C5]/20 flex items-center justify-center">
                    <Headphones className="h-4 w-4 text-[#00B1C5]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">24/7</p>
                <p className="text-white/50 text-xs">Corporate specialists on call for your travellers and guests.</p>
              </div>
              <div className="bg-white/8 border border-white/15 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Global Operations</span>
                  <div className="w-8 h-8 rounded-full bg-[#00B1C5]/20 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-[#00B1C5]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">100+</p>
                <p className="text-white/50 text-xs">countries — consistent chauffeur standards wherever business takes you.</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a href="#contact"
                className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
                Speak with our team
              </a>
              <a href="#benefits"
                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#00B1C5] transition-colors">
                Explore the platform <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/business-hero.avif"
                alt="KSA Rides Business Solutions – Executive in car"
                width={640}
                height={520}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#00B1C5] flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-bold">Average response time</p>
                  <p className="text-white/60 text-xs">Under 3 minutes — because every itinerary matters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {stats.map(({ value, label, sub }) => (
              <div key={label} className="py-6 sm:px-8 first:pl-0 last:pr-0">
                <p className="text-xs font-bold text-white/40 tracking-widest uppercase mb-1">{label}</p>
                <p className="text-4xl font-bold text-white mb-1">{value}</p>
                <p className="text-white/50 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
