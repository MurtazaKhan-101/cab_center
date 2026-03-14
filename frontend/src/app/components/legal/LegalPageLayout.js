"use client";

import Footer from '../home/Footer';

export default function LegalPageLayout({ title, badge, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-white">

      {/* Page header */}
      <div className="bg-[#EDF4F7] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {badge && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00B1C5]/30 bg-[#00B1C5]/10 text-xs font-bold text-[#005F56] uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B1C5]" />{badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          {lastUpdated && <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="prose prose-gray max-w-none">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
