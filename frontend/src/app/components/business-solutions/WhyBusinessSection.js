"use client";

import { BarChart2, Lock, Globe, Zap, User } from 'lucide-react';

const features = [
  {
    Icon: BarChart2,
    title: 'Live fleet visibility',
    badge: null,
    description:
      'Monitor every journey with real-time status, ETA updates, and passenger notifications to keep your team informed.',
  },
  {
    Icon: Lock,
    title: 'Policy & payment controls',
    badge: null,
    description:
      'Define cost centres, approvals, and invoice preferences tailored to your finance workflows and compliance requirements.',
  },
  {
    Icon: Globe,
    title: 'Global executive coverage',
    badge: null,
    description:
      'Premium vehicles and multilingual drivers in 2100+ cities across 100+ countries — wherever business takes you.',
  },
  {
    Icon: Zap,
    title: 'API & integrations',
    badge: 'Coming Soon',
    description:
      'Connect KSA Rides with your OBTs, expense tools, and HR systems with our upcoming API and white-label solutions.',
  },
];

const steps = [
  { n: '1', title: 'Apply for a corporate account', desc: 'Share your travel requirements to unlock corporate rates.' },
  { n: '2', title: 'Launch your dashboard',         desc: 'Configure policies, payment preferences, and custom vouchers.' },
  { n: '3', title: 'Move executives with confidence', desc: 'Book premium rides in seconds and track every milestone.' },
];

export default function WhyBusinessSection() {
  return (
    <section id="benefits" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Sub-label */}
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          Create your corporate account and manage rides at scale.
        </p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">

          {/* LEFT */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by leading businesses worldwide
            </h2>

            <p className="text-gray-700 mb-2">
              <strong>Streamlined booking &amp; centralised oversight</strong>{' '}
              <span className="text-[#00B1C5]">
                Schedule, modify, and track executive rides in real-time while keeping spend under control.
              </span>
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Your corporate dashboard delivers consolidated billing, ride visibility, and policy compliance
              — all backed by a global chauffeur network.
            </p>

            {/* Feature cards 2×2 */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(({ Icon, title, badge, description }) => (
                <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 text-sm leading-snug">{title}</h3>
                    {badge && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
                </div>
              ))}
            </div>

            {/* Tools box */}
            <div className="mt-8">
              <a href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity mb-6"
                style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
                Request a demo
              </a>

              <div className="max-w-lg bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">Tools designed for travel and mobility teams</h4>
                <ul className="space-y-2">
                  {[
                    'Consolidated invoicing and cost allocation dashboards.',
                    'Guest ride booking and branded itineraries in a few clicks.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#00B1C5] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: dark card */}
          <div className="sticky top-20">
            <div className="bg-[#051A18] rounded-2xl p-7 text-white">

              {/* Partner insight */}
              <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">Partner Insight</p>
              <blockquote className="text-white/90 text-sm leading-relaxed mb-6 italic">
                "KSA Rides transformed our ground travel program. Their platform is efficient, the team is
                proactive, and our executives consistently receive top-tier service."
              </blockquote>

              {/* Avatar */}
              <div className="flex items-center gap-3 mb-7 pb-7 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Mike Lauren</p>
                  <p className="text-xs text-white/40 uppercase tracking-wide">Corporate Travel Manager</p>
                </div>
              </div>

              {/* 3 numbered steps */}
              <div className="space-y-4">
                {steps.map(({ n, title, desc }) => (
                  <div key={n} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                      {n}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{title}</p>
                      <p className="text-xs text-[#00B1C5] mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
