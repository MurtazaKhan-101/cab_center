"use client";

import { ArrowRight, Globe } from 'lucide-react';
import Image from 'next/image';
import { useTranslation, useLanguage } from '../../../lib/i18n';

export default function HeroSection() {
  const { t, isInitialized } = useTranslation();
  const { language, changeLanguage, isRTL } = useLanguage();

  const handleBookNow = () => {
    // Handle booking logic here
    window.location.href = '/auth/login';
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'ar' : 'en');
  };

  // Prevent content flash during initialization
  if (!isInitialized) {
    return <div className="min-h-screen bg-ui-cards-gradient" />; // Loading state
  }

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
        <nav className="relative z-20 p-4 sm:p-6 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="relative w-8 h-8">
                  {/* <Image
                      src="/images/cab-center.svg"
                      alt="CabCenter Logo"
                      fill
                      className="object-contain"
                  /> */}
                  <h1 className="text-white font-bold text-lg sm:text-xl lg:text-2xl whitespace-nowrap">{t('herosection.cab_center')}</h1>
              </div>
            </div>

            {/* Navigation Links - Mobile Optimized */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-6">
              {/* Language Switch */}
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center px-2.5 py-2 sm:px-3 sm:py-2.5 lg:px-4 bg-white/90 backdrop-blur-sm rounded-lg lg:rounded-xl border border-primary/20 hover:bg-white hover:border-primary/40 hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-primary font-medium min-w-0"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-medium ml-1 sm:ml-2 hidden xs:inline">{language.toUpperCase()}</span>
              </button>

              {/* Login Button */}
              <a 
                href="/auth/login" 
                className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 bg-white/90 text-primary border-2 border-primary/30 rounded-lg lg:rounded-xl transform hover:scale-105 transition-all duration-300 font-semibold backdrop-blur-sm text-sm sm:text-sm lg:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">{t('herosection.login')}</span>
                <span className="sm:hidden">{language === 'ar' ? 'دخول' : 'Login'}</span>
              </a>
              
              {/* Signup Button */}
              <a 
                href="/auth/signup" 
                className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 bg-buttons-gradient text-white rounded-lg lg:rounded-xl hover:bg-primary/90 hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold shadow-lg text-sm sm:text-sm lg:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">{t('herosection.signup')}</span>
                <span className="sm:hidden">{language === 'ar' ? 'تسجيل' : 'Sign Up'}</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-8 lg:pt-16">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center min-h-[75vh] sm:min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {t('herosection.hero_title')}
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-accent leading-relaxed max-w-2xl">
                  {t('herosection.hero_description')}
                </p>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="group bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 font-semibold text-base sm:text-lg shadow-2xl flex items-center space-x-3 w-fit"
              >
                <span>{t('herosection.book_now')}</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Content - Image */}
            <div className="flex justify-center lg:justify-end mt-8 sm:mt-0">
              <div className="relative">
                <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
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