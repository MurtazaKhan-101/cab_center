"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

export default function HelpHero({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <section className="relative bg-[#051A18] text-white">

      {/* ── Banner ── */}
      <div className="relative h-64 sm:h-72 lg:h-80 flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/help-banner.jpg"
          alt="KSA Rides Help Center"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay with brand tint */}
        <div className="absolute inset-0 bg-[#051A18]/70" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Hello, how can we help you today?
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for articles..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm font-medium outline-none shadow-xl focus:ring-2 focus:ring-[#00B1C5]/40"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
