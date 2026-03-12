"use client";

import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, MessageCircle } from 'lucide-react';

const BRAND_GRADIENT = 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)';

const topAirports = [
  'London Heathrow Airport', 'Rome Airport', 'Barcelona Airport',
  'New York JFK Airport', 'Dubai Airport', 'Lisbon Airport',
  'Los Angeles Airport', 'Milan Malpensa Airport', 'Amsterdam Airport',
  'Naples Airport', 'Málaga Airport',
];

const services = [
  { label: 'Airport Transfers',      href: '/home' },
  { label: 'City rides',             href: '/city-rides' },
  { label: 'Hourly Service',         href: '/hourly-service' },
  { label: '✈ For Travel Agencies',  href: '/travel-agencies' },
  { label: '💼 Business Solutions',  href: '/business-solutions' },
  { label: '↩ Partner/Driver login', href: '/auth/login' },
];

const companyLinks = [
  { label: 'About us',           href: '/about' },
  { label: 'Help Centre',        href: '/help' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy',     href: '/privacy' },
  { label: 'Cookie Policy',      href: '/cookie-policy' },
  { label: 'KSA Rides Reviews',  href: '/reviews' },
];

const supportNumbers = [
  { region: 'KSA - 24/7', numbers: ['+966 11 000 0000', '+966 55 000 0000'] },
  { region: 'UAE - 24/7', numbers: ['+971 4 000 0000'] },
  { region: 'UK - 24/7', numbers: ['+44 20 0000 0000'] },
  { region: 'USA - 24/7', numbers: ['+1 929 000 0000'] },
];

const paymentIcons = [
  { src: '/images/visa.svg',             alt: 'Visa' },
  { src: '/images/mastercard.svg',       alt: 'Mastercard' },
  { src: '/images/american-express.svg', alt: 'American Express' },
  { src: '/images/paypal.svg',           alt: 'PayPal' },
];

export default function Footer() {
  return (
    <footer style={{ background: BRAND_GRADIENT }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-6">

        {/* Top row: logo + language + social */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-white/20">
          <Image
            src="/images/logo KSA Rides.png"
            alt="KSA Rides"
            width={240}
            height={72}
            className="h-20 w-auto object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <div className="flex items-center gap-4">
            {/* Social icons */}
            <a href="#" aria-label="Facebook" className="text-white/70 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="X / Twitter" className="text-white/70 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-white/20">

          {/* 24/7 Support */}
          <div>
            <h3 className="font-bold text-base mb-5 text-white tracking-wide uppercase">24/7 Support</h3>
            <div className="space-y-4">
              {supportNumbers.map(({ region, numbers }) => (
                <div key={region}>
                  <p className="text-white/50 text-xs font-bold mb-1 uppercase tracking-widest">{region}</p>
                  {numbers.map((n) => (
                    <p key={n} className="text-white text-sm font-medium hover:text-[#00B1C5] transition-colors cursor-pointer">{n}</p>
                  ))}
                </div>
              ))}
              <div>
                <p className="text-white/50 text-xs font-bold mb-1 flex items-center gap-1 uppercase tracking-widest">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp - 24/7
                </p>
                <p className="text-white text-sm font-medium">+966 50 000 0000</p>
              </div>
              <div>
                <p className="text-white/50 text-xs font-bold mb-1 flex items-center gap-1 uppercase tracking-widest">
                  <Mail className="h-3.5 w-3.5" /> General Inquiries
                </p>
                <p className="text-white text-sm font-medium">info@ksarides.com</p>
              </div>
            </div>
          </div>

          {/* Top Airports */}
          <div>
            <h3 className="font-bold text-base mb-5 text-white tracking-wide uppercase">Top Airports</h3>
            <ul className="space-y-2.5">
              {topAirports.map((airport) => (
                <li key={airport}>
                  <a href="#" className="text-white/75 hover:text-white text-sm transition-colors">
                    {airport}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* KSA Rides Services */}
          <div>
            <h3 className="font-bold text-base mb-5 text-white tracking-wide uppercase">KSA Rides Services</h3>
            <ul className="space-y-2.5">
              {services.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/75 hover:text-white text-sm transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-base mb-5 text-white tracking-wide uppercase">Company</h3>
            <ul className="space-y-2.5 mb-6">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/75 hover:text-white text-sm transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Trustpilot badge */}
            <div className="mt-5 pt-5 border-t border-white/15">
              <p className="text-white font-bold text-sm mb-2">✦ Trustpilot</p>
              <div className="flex gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 text-sm font-medium">TrustScore 4.8 | 34,188 reviews</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 text-sm text-white/70">
          <p className="font-medium">© {new Date().getFullYear()} KSA Rides™ | All rights reserved</p>

          {/* Payment logos */}
          <div className="flex flex-wrap items-center gap-3">
            {paymentIcons.map(({ src, alt }) => (
              <div key={alt} className="px-2 py-1 bg-white rounded flex items-center justify-center">
                <Image src={src} alt={alt} width={40} height={24} className="h-5 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
