"use client";

import { User, Mail } from 'lucide-react';

const specialist = {
  name: 'Andrew Al-Harbi',
  role: 'Head of Corporate Partnerships',
  email: 'andrew@ksarides.com',
};

export default function BusinessContactSection() {
  return (
    <section id="contact" className="py-16 lg:py-20 bg-[#051A18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white/60 uppercase tracking-wider mb-5">
              Corporate Support
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Let's plan your<br />mobility strategy
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4">
              Our corporate specialists partner with travel managers, EAs, and operations teams
              to deliver tailored transfer programs.
            </p>
            <p className="text-[#00B1C5] text-sm font-medium">
              Prefer a scheduled workshop? Request a callback and we will reach out within one business day.
            </p>
          </div>

          {/* Right: contact card */}
          <div className="max-w-sm w-full">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#00B1C5]/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-[#00B1C5]" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{specialist.name}</p>
                  <p className="text-white/40 text-xs uppercase tracking-wide">{specialist.role}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white/30 uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${specialist.email}`}
                  className="text-[#00B1C5] text-sm font-medium hover:underline flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {specialist.email}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
