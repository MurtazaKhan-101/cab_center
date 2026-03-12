"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  MapPin, Calendar, Clock, Search, Plus, Minus,
  ChevronDown, Plane, Timer,
} from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';

const DURATION_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 10, 12];

/**
 * HeroSection — reusable across homepage, city-rides, and hourly-service.
 *
 * Props:
 *   title        – JSX or string for the hero heading
 *   heroImage    – path to the right-side image
 *   heroImageAlt – alt text for the image
 *   defaultTab   – 'transfer' | 'hourly'  (locks the default active tab)
 */
export default function HeroSection({
  title,
  heroImage = '/images/hero.svg',
  heroImageAlt = 'KSA Rides – Professional transfers',
  defaultTab = 'transfer',
}) {
  const { isInitialized } = useTranslation();

  const [serviceType, setServiceType] = useState(defaultTab);
  const [from, setFrom]               = useState('');
  const [to, setTo]                   = useState('');
  const [pickupDate, setPickupDate]   = useState('');
  const [pickupTime, setPickupTime]   = useState('');
  const [passengers, setPassengers]   = useState(2);
  const [duration, setDuration]       = useState(2);
  const [showReturn, setShowReturn]   = useState(false);
  const [returnDate, setReturnDate]   = useState('');
  const [returnTime, setReturnTime]   = useState('');

  const handleSeePrice = () => {
    const params = new URLSearchParams({
      from,
      to,
      date: pickupDate,
      time: pickupTime,
      passengers: String(passengers),
    });
    window.location.href = `/vehicles?${params.toString()}`;
  };

  /* Default heading if none passed */
  const heading = title ?? (
    <>Your Reliable Worldwid Airport Transfers</>
  );

  if (!isInitialized) return <div className="min-h-screen bg-white" />;

  return (
    <section id="home" className="relative bg-white overflow-hidden">

      {/* ── Hero content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: heading + search widget */}
          <div className="space-y-7">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#005F56] leading-tight">
              {heading}
            </h1>

            {/* ── Search widget card ── */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {[
                  { id: 'transfer', Icon: Plane,  label: 'Transfer' },
                  { id: 'hourly',   Icon: Timer,   label: 'By the Hour' },
                ].map(({ id, Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setServiceType(id)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all ${
                      serviceType === id ? 'text-white' : 'text-gray-500 hover:text-[#005F56] bg-white'
                    }`}
                    style={serviceType === id
                      ? { background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }
                      : {}
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-3">

                {/* From */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors">
                  <MapPin className="h-5 w-5 text-[#00B1C5] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 font-medium mb-0.5">From</div>
                    <input
                      type="text"
                      placeholder="Address, airport, hotel, ..."
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* To — transfer only */}
                {serviceType === 'transfer' && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors">
                    <MapPin className="h-5 w-5 text-[#005F56] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 font-medium mb-0.5">To</div>
                      <input
                        type="text"
                        placeholder="Address, airport, hotel, ..."
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Date & Time row */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors cursor-pointer">
                    <Calendar className="h-4 w-4 text-[#00B1C5] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400 font-medium">Pickup date</div>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-transparent text-gray-700 text-xs outline-none cursor-pointer"
                      />
                    </div>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors cursor-pointer">
                    <Clock className="h-4 w-4 text-[#00B1C5] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400 font-medium">Pickup time</div>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-transparent text-gray-700 text-xs outline-none cursor-pointer"
                      />
                    </div>
                  </label>
                </div>

                {/* Duration dropdown — hourly only */}
                {serviceType === 'hourly' && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors">
                    <Timer className="h-4 w-4 text-[#005F56] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 font-medium mb-0.5">Duration</div>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full bg-transparent text-gray-700 text-sm outline-none cursor-pointer"
                      >
                        {DURATION_OPTIONS.map((h) => (
                          <option key={h} value={h}>{h} Hours</option>
                        ))}
                      </select>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 pointer-events-none" />
                  </div>
                )}

                {/* ADD RETURN — transfer only */}
                {serviceType === 'transfer' && !showReturn && (
                  <button
                    onClick={() => setShowReturn(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[#005F56] hover:border-[#00B1C5] hover:text-[#00B1C5] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    ADD RETURN
                  </button>
                )}

                {/* Return date/time — transfer + showReturn */}
                {serviceType === 'transfer' && showReturn && (
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors cursor-pointer">
                      <Calendar className="h-4 w-4 text-[#005F56] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 font-medium">Return date</div>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full bg-transparent text-gray-700 text-xs outline-none cursor-pointer"
                        />
                      </div>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors cursor-pointer">
                      <Clock className="h-4 w-4 text-[#005F56] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 font-medium">Return time</div>
                        <input
                          type="time"
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="w-full bg-transparent text-gray-700 text-xs outline-none cursor-pointer"
                        />
                      </div>
                    </label>
                  </div>
                )}

                {/* Passengers */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-0.5">Passengers</div>
                    <span className="text-sm font-bold text-gray-700">{passengers}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPassengers(p => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00B1C5] transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setPassengers(p => p + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00B1C5] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* See prices CTA */}
                <button
                  onClick={handleSeePrice}
                  className="w-full py-3.5 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                  style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}
                >
                  <Search className="h-4 w-4" />
                  See prices
                </button>
              </div>
            </div>

            {/* Trustpilot */}
            <div className="flex items-center gap-3 text-sm flex-wrap">
              <span className="font-bold text-gray-800 tracking-widest text-xs uppercase">Excellent</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 font-medium">Trustpilot</span>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="hidden lg:flex justify-end items-start pt-2">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                width={600}
                height={520}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
