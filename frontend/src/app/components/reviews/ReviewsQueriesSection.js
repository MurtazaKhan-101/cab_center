"use client";

const queries = [
  {
    q: 'Is KSA Rides reliable?',
    a: '99% on-time rides across 2.8M+ trips, insured coverage, humans on-shift worldwide around the clock.',
  },
  {
    q: 'KSA Rides Reddit',
    a: 'Secondary chauffeurs pre-assigned at hubs, delay alerts, SMS/WhatsApp updates in real time. Community feedback consistently highlights punctuality.',
  },
  {
    q: 'KSA Rides reviews',
    a: 'Google 4.8/5, Trustpilot 4.8/5 — refreshed quarterly from source. Travellers highlight clear pricing, no surprises, and proactive comms.',
  },
  {
    q: 'Problems with KSA Rides',
    a: 'Fixes shipped: clearer wait times, faster chat, automatic backups, upfront pricing with receipts. Issues logged, reviewed, and resolved transparently.',
  },
];

const trustStack = [
  'Live ratings synced quarterly from Google and Trustpilot.',
  'Ride volume and on-time % pulled from internal QA dashboards.',
  'Issue response SLAs matched to real support telemetry (median response 3 minutes).',
  'Backup chauffeur coverage at major hubs with proactive swap notifications.',
];

export default function ReviewsQueriesSection() {
  return (
    <section className="bg-[#030F0E] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">

          {/* Left */}
          <div>
            <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">Search Intent Matched</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              We answer the exact queries customers type
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Every question below maps to live customer searches so search engines and people find the same clear, verifiable answers.
            </p>

            {/* 2×2 query cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {queries.map(({ q, a }) => (
                <div key={q} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-sm font-bold text-[#00B1C5] mb-2">{q}</p>
                  <p className="text-white/60 text-xs leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: trust stack card */}
          <div className="sticky top-20">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="font-bold text-white text-base mb-5">Trust stack in one view</p>
              <ul className="space-y-4">
                {trustStack.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60 leading-relaxed">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-[#00B1C5] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/50 text-xs font-bold uppercase tracking-widest">
                  Updated Quarterly
                </span>
                <span className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/50 text-xs font-bold uppercase tracking-widest">
                  Verified Sources
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
