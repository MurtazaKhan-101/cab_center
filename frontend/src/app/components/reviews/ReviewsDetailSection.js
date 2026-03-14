"use client";

const features = [
  {
    title: 'Business & travel manager',
    desc: 'Instant invoices, 3-minute median response SLA, guaranteed availability in 75+ countries with dedicated account managers.',
  },
  {
    title: 'Families & leisure',
    desc: 'Child seat requests accepted, flight monitoring included, up to 60 minutes of airport wait included at no extra charge.',
  },
  {
    title: 'Vetted chauffeurs',
    desc: 'Background checks, local driving licences verified, and quarterly service quality audits on every partner driver.',
  },
  {
    title: 'Secure payments',
    desc: 'PCI-DSS compliant, all major cards accepted, corporate invoicing available with automated fraud checks on every transaction.',
  },
];

const whereWeRead = [
  'Google Maps: 4.8/5 on 3,100+ ratings (verified, Jul 2025).',
  'Trustpilot: 4.8/5 on 35,500+ reviews — rating visible on trustpilot.com/review/ksarides.com (periodic check).',
  'Post-ride internal survey: NPS 98 (rolling 90 days).',
];

export default function ReviewsDetailSection() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">

          {/* Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              KSA Rides reviews
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-2">
              Combined ratings show a 4.8/5 average across public reviews. Travellers{' '}
              <span className="text-[#00B1C5] font-medium">highlight punctuality, proactive comms,</span>{' '}
              and knowing the final price before they pay.
            </p>
            <p className="text-gray-400 text-xs mb-8">
              Data refreshed quarterly and verified by our internal QA team.
            </p>

            {/* 4 feature cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(({ title, desc }) => (
                <div key={title} className="border border-gray-200 rounded-2xl p-5 hover:border-[#00B1C5]/40 hover:shadow-sm transition-all">
                  <p className="text-sm font-bold text-[#005F56] mb-2">{title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: where we read reviews */}
          <div className="sticky top-20">
            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
              <p className="font-bold text-gray-800 text-sm mb-4">Where we read reviews</p>
              <ul className="space-y-3">
                {whereWeRead.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                    <span className="mt-1 text-[#00B1C5] font-bold flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-400 text-xs mt-4 pt-4 border-t border-gray-200">
                Data refreshed quarterly and verified by our internal QA team.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
