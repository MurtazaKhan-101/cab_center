"use client";

import { User, Mail, Phone } from 'lucide-react';

const specialists = [
  {
    name: 'Ahmad Al-Zahrani',
    role: 'Senior Agency Specialist',
    email: 'ahmad@ksarides.com',
    phone: '+966 11 000 0001',
  },
  {
    name: 'Sara Al-Otaibi',
    role: 'Senior Agency Specialist',
    email: 'sara@ksarides.com',
    phone: '+966 11 000 0002',
  },
];

export default function LetsConnectSection() {
  return (
    <section id="connect" className="py-16 lg:py-20 bg-[#051A18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white/60 uppercase tracking-wider mb-5">
              Agency Support
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Let's Connect
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4">
              Our travel agency specialists are here to help you every step of the way.
            </p>
            <p className="text-[#00B1C5] text-sm font-medium">
              Prefer a scheduled meeting? Request a callback and we will be in touch within one business day.
            </p>
          </div>

          {/* Right: specialist cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {specialists.map(({ name, role, email, phone }) => (
              <div key={name}
                className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#00B1C5]/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#00B1C5]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{name}</p>
                    <p className="text-white/40 text-xs uppercase tracking-wide">{role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-wide mb-0.5">Email</p>
                    <a href={`mailto:${email}`}
                      className="text-[#00B1C5] text-sm font-medium hover:underline">
                      {email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-wide mb-0.5">Phone Number</p>
                    <a href={`tel:${phone}`}
                      className="text-white font-bold text-sm hover:text-[#00B1C5] transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
