"use client";

import { UserCheck, Handshake } from 'lucide-react';

const cards = [
  {
    Icon: UserCheck,
    badge: 'Corporate & Leisure',
    title: 'Duty of care',
    rows: [
      { label: 'Monitoring',    value: 'Live ride oversight & instant alerts' },
      { label: 'Communication', value: 'SMS, email, and WhatsApp updates for travellers and coordinators.' },
    ],
  },
  {
    Icon: Handshake,
    badge: 'Agencies, Events, Hospitality',
    title: 'Partnerships that last',
    rows: [
      { label: 'Onboarding', value: 'Fast setup with a dedicated manager' },
      { label: 'Tools',      value: 'White-label vouchers, unified billing, and custom reporting.' },
    ],
  },
];

export default function AboutCommitmentSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#051A18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="grid lg:grid-cols-[1fr_1fr_1fr] gap-8 lg:gap-10 items-start">

          {/* Left text */}
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white/60 uppercase tracking-wider mb-5">
              Our Commitment
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Travel made personal
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              We respond fast, adapt quickly, and stay accountable. Whether it is a last-minute change,
              a VIP guest, or a complex multi-stop journey, our team is ready.
            </p>
            <p className="text-[#00B1C5] text-sm font-medium mb-6">
              Prefer to talk it through? Tell us your route and we will design it together.
            </p>
            <a href="#contact"
              className="inline-flex px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
              Plan with us
            </a>
          </div>

          {/* 2 feature cards */}
          {cards.map(({ Icon, badge, title, rows }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{title}</p>
                  <p className="text-white/40 text-xs uppercase tracking-wide">{badge}</p>
                </div>
              </div>
              <div className="space-y-4">
                {rows.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-white/80 text-sm font-semibold leading-snug">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
