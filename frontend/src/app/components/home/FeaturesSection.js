"use client";

import { Check } from 'lucide-react';

const steps = [
  {
    label: '1',
    isCheck: false,
    title: 'Enter your route and select car',
    description:
      'Enter all the required data in the search field and then choose the desired vehicle.',
  },
  {
    label: '2',
    isCheck: false,
    title: 'Complete booking form',
    description:
      'Enter the details of the lead passenger, add extras if you wish. Proceed to payment and receive your voucher.',
  },
  {
    label: '✓',
    isCheck: true,
    title: 'Meet your driver',
    description:
      'You will receive your driver\'s details 6 hours prior to pickup and he will be waiting for you on-site with a Name Sign.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 lg:py-20 bg-[#EDF4F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <h2 className="text-2xl sm:text-3xl font-bold text-[#005F56] mb-8 lg:mb-12">
          How does it work
        </h2>

        <div className="grid sm:grid-cols-3 gap-6 lg:gap-10">
          {steps.map(({ label, isCheck, title, description }) => (
            <div key={title} className="space-y-4">
              {/* Step circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                style={{
                  background: isCheck
                    ? '#22c55e'
                    : 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)',
                }}
              >
                {isCheck ? <Check className="h-5 w-5" /> : label}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-[#005F56] text-base mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
