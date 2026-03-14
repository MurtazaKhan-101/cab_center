"use client";

import { useState } from 'react';
import {
  Send, BookOpen, Gauge, UserCog,
  CreditCard, UserX, HelpCircle, ChevronRight,
} from 'lucide-react';

const ALL_CATEGORIES = [
  {
    Icon: Send,
    title: 'Getting started',
    authors: 'By Ahmad and 2 others',
    articles: 39,
    href: '#getting-started',
  },
  {
    Icon: BookOpen,
    title: 'Managing bookings',
    authors: 'By Sara and 2 others',
    articles: 11,
    href: '#managing-bookings',
  },
  {
    Icon: Gauge,
    title: 'During travel',
    authors: 'By Sara',
    articles: 6,
    href: '#during-travel',
  },
  {
    Icon: UserCog,
    title: 'Account',
    authors: 'By Ahmad and 2 others',
    articles: 8,
    href: '#account',
  },
  {
    Icon: CreditCard,
    title: 'Payment / Refund',
    authors: 'By Sara and 1 other',
    articles: 10,
    href: '#payment-refund',
  },
  {
    Icon: UserX,
    title: 'Amending or cancelling your booking',
    authors: 'By Sara',
    articles: 3,
    href: '#amend-cancel',
  },
  {
    Icon: HelpCircle,
    title: 'Extra',
    authors: 'By Sara',
    articles: 1,
    href: '#extra',
  },
];

export default function HelpCategoriesSection({ searchQuery = '' }) {
  const filtered = searchQuery.trim()
    ? ALL_CATEGORIES.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ALL_CATEGORIES;

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">

        {searchQuery && (
          <p className="text-sm text-gray-500 mb-6">
            Showing results for <span className="font-semibold text-gray-800">"{searchQuery}"</span>
            {' '}— {filtered.length} {filtered.length === 1 ? 'category' : 'categories'} found
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No categories found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(({ Icon, title, authors, articles, href }) => (
              <a
                key={title}
                href={href}
                className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:border-[#00B1C5]/40 hover:shadow-md transition-all group"
              >
                {/* Icon box */}
                <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-[#EDF4F7] flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="h-6 w-6 text-gray-500 group-hover:text-[#005F56] transition-colors" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#005F56] transition-colors">
                    {title}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {authors}
                    <span className="mx-1.5">·</span>
                    <span className="text-[#00B1C5] font-medium">
                      {articles} {articles === 1 ? 'article' : 'articles'}
                    </span>
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#00B1C5] flex-shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        )}

        {/* Bottom help strip */}
        <div className="mt-12 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
          <div>
            <p className="font-bold text-white text-base">Can't find what you're looking for?</p>
            <p className="text-white/70 text-sm mt-0.5">Our support team is available 24/7 to help.</p>
          </div>
          <a
            href="mailto:support@ksarides.com"
            className="flex-shrink-0 px-5 py-2.5 bg-white text-[#005F56] font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
