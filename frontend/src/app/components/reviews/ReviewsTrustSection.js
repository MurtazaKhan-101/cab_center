"use client";

const pills = [
  '"Is KSA Rides reliable?"',
  '"KSA Rides Reddit"',
  '"KSA Rides reviews"',
  '"Problems with KSA Rides"',
];

const stats = [
  {
    label: 'Aggregated reviews',
    value: '4.8 / 5',
    detail: 'Weighted average: Google 4.8/5 (3,100+ ratings), Trustpilot 4.8/5 (35,500+ reviews). Updated Dec 2025.',
  },
  {
    label: 'Completed rides',
    value: '2,800,000+',
    detail: 'Trips booked and completed with verified feedback.',
  },
  {
    label: 'Years in operation',
    value: '5+',
    detail: 'Since 2020, with ops teams across the Middle East, Europe, and the US.',
  },
  {
    label: 'Countries covered',
    value: '100+',
    detail: 'Network of vetted partners in 2100+ cities and key hubs.',
  },
];

export default function ReviewsTrustSection() {
  return (
    <section className="bg-[#051A18] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <p className="text-xs font-bold tracking-widest text-[#00B1C5] uppercase mb-4">Trust &amp; Safety</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Is KSA Rides reliable?
        </h2>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
          Since 2020 we run vetted chauffeurs, flight tracking, insured rides, and human support 24/7.
          Below you get real ratings, volume, and concise answers to the questions people actually search.
        </p>

        {/* Search query pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {pills.map((pill) => (
            <span key={pill}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/70 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B1C5]" />
              {pill}
            </span>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, detail }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-bold text-[#00B1C5] uppercase tracking-wide mb-3">{label}</p>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-3">{value}</p>
              <p className="text-white/40 text-xs leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
