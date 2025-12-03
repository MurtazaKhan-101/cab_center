"use client";

import { ArrowRight, Globe } from 'lucide-react';
import Image from 'next/image';
import { useTranslation, useLanguage } from '../../../lib/i18n';

export default function HeroSection() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const handleBookNow = () => {
    // Handle booking logic here
    window.location.href = '/auth/login';
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Main Hero Content with curved background */}
      <div className="relative bg-ui-cards-gradient lg:bg-transparent pb-24">
        {/* Desktop Background SVG */}
        <div className="hidden bg-white lg:block absolute inset-0 w-full h-full z-0">
          <Image
            src="/images/background.svg"
            alt={t('herosection.hero_background')}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Top Navigation */}
        <nav className="relative z-20 flex justify-between items-center p-6 lg:px-12">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
                {/* <Image
                    src="/images/cab-center.svg"
                    alt="CabCenter Logo"
                    fill
                    className="object-contain"
                /> */}
                <h1 className="text-white font-bold text-2xl">{t('herosection.cab_center')}</h1>
                </div>

          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4 lg:space-x-6">
        
            
            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-primary/20 hover:bg-white hover:border-primary/40 hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-primary font-medium"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            <a 
              href="/auth/login" 
              className="px-6 py-2.5 bg-white/90 text-primary border-2 border-primary/30 rounded-xl  transform hover:scale-105 transition-all duration-300 font-semibold backdrop-blur-sm"
            >
              {t('herosection.login')}
            </a>
            
            {/* Signup Button */}
            <a 
              href="/auth/signup" 
              className="px-6 py-2.5 bg-buttons-gradient  text-white rounded-xl hover:bg-primary/90 hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
            >
              {t('herosection.signup')}
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-8 lg:pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {t('herosection.hero_title')}
                </h1>
                <p className="text-xl lg:text-2xl text-accent leading-relaxed max-w-2xl">
                  {t('herosection.hero_description')}
                </p>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="group bg-white text-primary px-8 py-4 rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 font-semibold text-lg shadow-2xl flex items-center space-x-3"
              >
                <span>{t('herosection.book_now')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Content - Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                  <Image
                    src="/images/arabic.svg"
                    alt={t('herosection.hero_image_alt')}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}