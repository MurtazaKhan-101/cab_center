"use client";

import { useState } from 'react';
import { Globe, BarChart2, Shield } from 'lucide-react';

const COMPANY_SIZES = [
  '1–10 employees', '11–50 employees', '51–200 employees',
  '201–500 employees', '500+ employees',
];

const sideStats = [
  { value: '300+',  label: 'Enterprise Clients' },
  { value: '100+',  label: 'Countries' },
  { value: '99.3%', label: 'Trip Success' },
];

const sideFeatures = [
  { Icon: Globe,      title: 'Global Coverage',            sub: 'Consistent service across 2100+ cities' },
  { Icon: BarChart2,  title: 'Centralised Dashboard',      sub: 'Visibility, billing, and compliance in one place' },
  { Icon: Shield,     title: 'Duty of Care Compliance',    sub: 'Real-time tracking for every executive journey' },
];

export default function BusinessSignUpSection() {
  const [form, setForm] = useState({
    companyName: '', firstName: '', lastName: '',
    email: '', phone: '', companySize: COMPANY_SIZES[0], terms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = 'Required';
    if (!form.firstName.trim())   e.firstName   = 'Required';
    if (!form.lastName.trim())    e.lastName    = 'Required';
    if (!form.email.trim())       e.email       = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim())       e.phone       = 'Required';
    if (!form.terms)              e.terms       = 'You must accept the terms';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitted(true);
  };

  return (
    <section id="demo" className="py-16 lg:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Request a Corporate Demo
        </h2>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">

          {/* LEFT: Form */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#EDF4F7] rounded-2xl">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-[#005F56] mb-2">Demo request submitted!</h3>
              <p className="text-gray-500 text-sm">Our corporate team will review your details and reach out within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-7 space-y-5">

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Company Name <span className="text-[#00B1C5]">*</span>
                </label>
                <input
                  type="text" placeholder="Company Name" value={form.companyName}
                  onChange={e => update('companyName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.companyName ? 'border-red-400' : 'border-gray-200 focus:border-[#00B1C5]'}`}
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>

              {/* Name row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    First Name <span className="text-[#00B1C5]">*</span>
                  </label>
                  <input
                    type="text" placeholder="First Name" value={form.firstName}
                    onChange={e => update('firstName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.firstName ? 'border-red-400' : 'border-gray-200 focus:border-[#00B1C5]'}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Name <span className="text-[#00B1C5]">*</span>
                  </label>
                  <input
                    type="text" placeholder="Last Name" value={form.lastName}
                    onChange={e => update('lastName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.lastName ? 'border-red-400' : 'border-gray-200 focus:border-[#00B1C5]'}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Work Email <span className="text-[#00B1C5]">*</span>
                </label>
                <input
                  type="email" placeholder="name@company.com" value={form.email}
                  onChange={e => update('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#00B1C5]'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone <span className="text-[#00B1C5]">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 whitespace-nowrap">
                    🇸🇦 +966
                  </div>
                  <input
                    type="tel" placeholder="5X XXX XXXX" value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-[#00B1C5]'}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Company Size <span className="text-[#00B1C5]">*</span>
                </label>
                <select
                  value={form.companySize}
                  onChange={e => update('companySize', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00B1C5] text-sm outline-none bg-white text-gray-700"
                >
                  {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox" checked={form.terms}
                    onChange={e => update('terms', e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#005F56] cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    I accept the{' '}
                    <a href="#" className="text-[#00B1C5] hover:underline font-semibold">
                      Terms &amp; Conditions
                    </a>{' '}
                    <span className="text-[#00B1C5]">*</span>
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}
              >
                REQUEST DEMO
              </button>
            </form>
          )}

          {/* RIGHT: dark card */}
          <div className="bg-[#051A18] rounded-2xl p-7 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00B1C5]/30 bg-[#00B1C5]/10 text-xs font-semibold text-[#00B1C5] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B1C5]" />
              Corporate Program
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Why choose KSA Rides for Business?</h3>
            <p className="text-white/50 text-xs leading-relaxed mb-6">
              Centralised Management — Our enterprise platform lets your team book, modify,
              and track every executive transfer in real-time with full spend visibility.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {sideStats.map(({ value, label }) => (
                <div key={label} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{value}</p>
                  <p className="text-xs text-white/40 uppercase tracking-wide leading-tight mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            <div className="space-y-3">
              {sideFeatures.map(({ Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{title}</p>
                    <p className="text-xs text-white/40">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
