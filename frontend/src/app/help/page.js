"use client";

import { useState } from 'react';
import HelpHero             from '../components/help/HelpHero';
import HelpCategoriesSection from '../components/help/HelpCategoriesSection';
import Footer               from '../components/home/Footer';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <HelpHero onSearch={setSearchQuery} />
      <HelpCategoriesSection searchQuery={searchQuery} />
      <Footer />
    </div>
  );
}
