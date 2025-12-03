"use client";

import Image from 'next/image';
import { useTranslation } from '../../../lib/i18n';

export default function Footer() {
  const { t } = useTranslation();
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const footerLinks = [
    { name: t('footer.home'), href: '#home' },
    { name: t('footer.faq'), href: '#faq' },
    { name: t('footer.why_us'), href: '#features' },
    { name: t('footer.how_to_book'), href: '#steps' }
  ];

  return (
    <footer className="bg-ui-cards-gradient text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Main Footer Content */}
        <div className="text-center space-y-8">
          {/* Logo Section */}
          <div className="flex justify-center items-center space-x-3">
            <div className="w-24 h-24  rounded-lg flex items-center justify-center p-2">
              {/* <Image
                 src="/images/cab-center.svg"
                  alt="CabCenter Logo"
                  width={64}
                  height={64}
                  className="w-64 h-64"
             /> */}
             <h1 className="text-white font-bold text-2xl">{t('footer.cab_center')}</h1>
            </div>
          
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center items-center gap-8">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href.substring(1))}
                className="text-white hover:text-accent transition-colors duration-200 font-medium text-lg"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-accent text-sm">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}