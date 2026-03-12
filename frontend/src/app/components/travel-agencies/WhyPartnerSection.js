"use client";

import { Globe, Percent, Headphones, Zap, User, ArrowRight } from 'lucide-react';

const features = [
  {
    Icon: Zap,
    title: 'Integration & API',
    badge: 'Coming Soon',
    description:
      'Soon you will connect KSA Rides with your existing travel tools through our flexible API or work directly from our intuitive dashboard.',
  },
  {
    Icon: Globe,
    title: 'Global Coverage',
    badge: null,
    description:
      'No matter your client\'s destination, KSA Rides ensures reliable and high-quality transfers across hundreds of cities worldwide.',
  },
  {
    Icon: Percent,
    title: 'Competitive Rates & Transparent Pricing',
    badge: null,
    description:
      'Benefit from exclusive agency rates and clear pricing with no hidden fees, helping you provide value-added services to your clients.',
  },
  {
    Icon: Headphones,
    title: 'Dedicated Support 24/7',
    badge: null,
    description:
      'Enjoy peace of mind with our round-the-clock customer support team, ready to assist with any needs or issues that may arise.',
  },
];

const steps = [
  { n: '1', title: 'Apply online in minutes',     desc: 'Share a few details about your agency to unlock premium rates.' },
  { n: '2', title: 'Activate your dashboard',     desc: 'Set payment preferences and customise vouchers for your agency.' },
  { n: '3', title: 'Book and impress clients',    desc: 'Confirm rides in seconds and share live status updates with travellers.' },
];

export default function WhyPartnerSection() {
  return (
    <section id="benefits" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Sub-label */}
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          Create your agency account and start making bookings with us!
        </p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">

          {/* LEFT */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Partner with KSA Rides?
            </h2>

            <p className="text-gray-600 mb-2">
              <strong>Effortless Booking & Management</strong> — Our user-friendly platform simplifies
              bookings, allowing your agency to efficiently schedule, modify, and oversee all transfer
              services in real-time.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              As a member of our program, you will have access to our platform at ksarides.com, where
              you can easily book airport transfers for your clients. With our extensive network of
              trusted and reliable transfer companies, you can ensure a smooth and hassle-free travel
              experience for your clients.
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
          </div>

          {/* RIGHT: dark card */}
          <div className="sticky top-20">
            <div className="bg-[#051A18] rounded-2xl p-7 text-white">

              {/* Partner insight */}
              <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">Partner Insight</p>
              <blockquote className="text-white/90 text-sm leading-relaxed mb-6 italic">
                "Since partnering with KSA Rides, managing our clients' transfers has never been
                easier. Their platform is intuitive, the support is exceptional, and our clients
                frequently compliment the punctuality and professionalism of their drivers.
                KSA Rides has truly enhanced our service offering."
              </blockquote>

              {/* Avatar */}
              <div className="flex items-center gap-3 mb-7 pb-7 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Elena R.</p>
                  <p className="text-xs text-white/40 uppercase tracking-wide">Director, Voyager Travel Boutique</p>
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
                      <p className="text-xs text-white/50 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Tools box */}
        <div className="mt-12">
          <a href="#signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity mb-4"
            style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
            Join Now!
          </a>
          <p className="text-gray-500 text-sm mb-6">
            Ready to simplify your transfers?{' '}
            <a href="#signup" className="text-[#00B1C5] hover:underline">
              Join countless agencies that elevate their clients' journeys with KSA Rides.
            </a>
          </p>

          <div className="max-w-lg bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h4 className="font-bold text-gray-800 mb-4">Tools built for travel professionals</h4>
            <ul className="space-y-2">
              {[
                'Instant access to wholesale rates, vouchers, and live ride tracking.',
                'API and white-label solutions for your workflows (coming soon).',
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
    </section>
  );
}
