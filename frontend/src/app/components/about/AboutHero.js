"use client";

import Image from 'next/image';
import { Globe, Headphones, Clock, ArrowRight } from 'lucide-react';

export default function AboutHero() {
  return (
    <section className="bg-[#051A18] text-white">

      {/* ── Hero content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-0">

        {/* Breadcrumb */}
        <p className="text-xs text-white/40 font-semibold tracking-widest uppercase mb-6 flex items-center gap-2">
          <a href="/home" className="hover:text-white/70 transition-colors">Home</a>
          <span>▸</span>
          <span>About Us</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start pb-16">

          {/* Left */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-sm text-white/80">
              <span className="w-2 h-2 rounded-full bg-[#00B1C5]" />
              About KSA Rides
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              About us
            </h1>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-lg">
              We build seamless airport transfers for travellers, travel managers, and partners
              worldwide — powered by technology, local expertise, and a team that never stops caring.
            </p>

            {/* Mini cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white/8 border border-white/15 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Human support</span>
                  <div className="w-8 h-8 rounded-full bg-[#00B1C5]/20 flex items-center justify-center">
                    <Headphones className="h-4 w-4 text-[#00B1C5]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">24/7</p>
                <p className="text-white/50 text-xs">Real people available in every time zone.</p>
              </div>
              <div className="bg-white/8 border border-white/15 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Global reach</span>
                  <div className="w-8 h-8 rounded-full bg-[#00B1C5]/20 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-[#00B1C5]" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">+670</p>
                <p className="text-white/50 text-xs">Airports &amp; cities covered with curated chauffeurs.</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a href="#contact"
                className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
                Talk with us
              </a>
              <a href="#story"
                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#00B1C5] transition-colors">
                Discover our story <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-us.avif"
                alt="KSA Rides Team"
                width={640}
                height={520}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#00B1C5] flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-bold">Average response time</p>
                  <p className="text-white/60 text-xs">Under 3 minutes — because every trip matters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid sm:grid-cols-3 gap-4 py-8">
            {[
              { label: 'TRANSFERS EACH YEAR',      value: '2M+',     sub: 'Riders trust us for their most important journeys.' },
              { label: 'PROFESSIONALS WORLDWIDE',  value: '15,500+', sub: 'Curated chauffeurs, dispatchers, and coordinators.' },
              { label: 'CITIES & AIRPORTS',         value: '670+',    sub: 'Premium coverage across more than 100 countries.' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-xs font-bold text-white/40 tracking-widest uppercase mb-2">{label}</p>
                <p className="text-4xl font-bold text-white mb-1">{value}</p>
                <p className="text-white/50 text-xs leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
