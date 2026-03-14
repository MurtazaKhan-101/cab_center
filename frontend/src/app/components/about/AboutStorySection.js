"use client";

import { Shield, Headphones, Cpu, Leaf } from 'lucide-react';

const features = [
  {
    Icon: Shield,
    title: 'Safety first',
    description: 'Driver vetting, flight monitoring, and live status checks keep every itinerary on track.',
  },
  {
    Icon: Headphones,
    title: 'People at the center',
    description: '24/7 multilingual support teams solve issues before they become problems.',
  },
  {
    Icon: Cpu,
    title: 'Technology built for travel',
    description: 'API-ready infrastructure, live flight data, and transparent pricing keep operations smooth.',
  },
  {
    Icon: Leaf,
    title: 'Responsible choices',
    description: 'From efficient routing to greener fleet options, we keep sustainability in focus.',
  },
];

const operationSteps = [
  { n: '1', title: 'Smart planning',       desc: 'Flight tracking, buffer times, and route checks before every pickup.' },
  { n: '2', title: 'Live coordination',    desc: 'Chauffeurs, dispatchers, and support teams stay synced in real time.' },
  { n: '3', title: 'Follow-up & feedback', desc: 'We confirm safe drop-offs, gather feedback, and refine every route.' },
];

export default function AboutStorySection() {
  return (
    <section id="story" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6">
          Ground travel made human, reliable, and simple.
        </p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">

          {/* LEFT */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The story behind KSA Rides
            </h2>

            <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-4">
              <strong>We started with one promise</strong>{' '}
              <span className="text-[#00B1C5]">deliver the same level of care everywhere.</span>{' '}
              From seamless booking to thoughtful follow-up, our team and partners work together
              so every pickup feels effortless.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Technology keeps us fast, but people keep us attentive. We blend automated dispatching,
              live tracking, and proactive alerts with multilingual experts who monitor every leg of the ride.
            </p>

            {/* 4 feature cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(({ Icon, title, description }) => (
                <div key={title} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-2">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: dark card */}
          <div className="sticky top-20">
            <div className="bg-[#051A18] rounded-2xl p-7 text-white">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white/60 uppercase tracking-widest mb-6">
                How We Operate
              </span>

              <blockquote className="text-white/90 text-base sm:text-lg leading-relaxed mb-8 font-medium">
                "Every itinerary is watched by humans and guided by data. We obsess over timing,
                clarity, and comfort — so travellers simply enjoy the ride."
              </blockquote>

              <div className="space-y-5">
                {operationSteps.map(({ n, title, desc }) => (
                  <div key={n} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                      {n}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{title}</p>
                      <p className="text-xs text-[#00B1C5] mt-0.5 leading-relaxed">{desc}</p>
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
