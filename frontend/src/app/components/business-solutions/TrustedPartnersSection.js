"use client";

const partners = [
  'Square', 'NVIDIA', 'Riot Games', 'Accenture',
  'Global Business Travel', 'Deutsche Bank', 'McKinsey', 'Deloitte',
];

export default function TrustedPartnersSection() {
  return (
    <section className="bg-[#051A18] py-16 lg:py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-3">
              Trusted Partners
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Selected by enterprise teams
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Finance, tech, energy, and travel brands rely on KSA Rides for executive ground moves worldwide.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00B1C5]/30 bg-[#00B1C5]/10 text-xs font-bold text-[#00B1C5] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B1C5]" />
              Duty of Care Ready
            </span>
          </div>
        </div>

        {/* Logo marquee */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 py-6">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#051A18]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#051A18]/80 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((name, i) => (
              <span
                key={i}
                className="inline-block text-white/40 font-bold text-sm sm:text-base tracking-wide hover:text-white/80 transition-colors cursor-default select-none px-2"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
