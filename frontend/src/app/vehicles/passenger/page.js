"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users, CheckCircle2, Shield, UserCheck, Plane,
  ArrowRight, RotateCcw, ChevronLeft, ChevronDown, Info,
  Mail, MessageSquare, Smartphone, Bell,
} from 'lucide-react';

const BRAND_GRADIENT = 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)';

const STEPS = ['Vehicle', 'Extras', 'Passenger', 'Payment', 'Passport'];

const VEHICLES = [
  { id: 'economy',         name: 'Economy',         passengers: 3, luggage: 3, image: '/images/Standard Class Taxi.svg',       basePrice: 65.55,  discountPrice: null },
  { id: 'standard',        name: 'Standard',        passengers: 3, luggage: 3, image: '/images/First Class Transfer.svg',      basePrice: 96.13,  discountPrice: 87.39 },
  { id: 'first-class',     name: 'First Class',     passengers: 3, luggage: 3, image: '/images/SUV Limo Class.svg',            basePrice: 157.31, discountPrice: null },
  { id: 'standard-van',    name: 'Standard Van',    passengers: 7, luggage: 7, image: '/images/Standard Van Transfer.svg',     basePrice: 102.82, discountPrice: 93.47 },
  { id: 'first-class-van', name: 'First Class Van', passengers: 6, luggage: 6, image: '/images/First Class Van Transfer.svg',  basePrice: 157.68, discountPrice: null },
  { id: 'minibus',         name: 'Minibus 12 Pax',  passengers: 12, luggage: 12, image: '/images/Minibus 12 Pax.svg',          basePrice: 220.00, discountPrice: null },
];

const FEATURE_BADGES = [
  { icon: CheckCircle2, label: 'Free cancellation', color: '#00B1C5' },
  { icon: ArrowRight,   label: 'Door-to-door service', color: '#005F56' },
  { icon: UserCheck,    label: 'Meet & Greet', color: '#005F56' },
  { icon: Plane,        label: 'Flight tracking', color: '#005F56' },
  { icon: Shield,       label: 'Licensed chauffeurs', color: '#005F56' },
];

const PAYMENT_ICONS = [
  { src: '/images/visa.svg',             alt: 'Visa' },
  { src: '/images/mastercard.svg',       alt: 'Mastercard' },
  { src: '/images/american-express.svg', alt: 'Amex' },
  { src: '/images/paypal.svg',           alt: 'PayPal' },
];

const COUNTRY_CODES = [
  { code: '+966', flag: '🇸🇦', label: 'KSA' },
  { code: '+971', flag: '🇦🇪', label: 'UAE' },
  { code: '+44',  flag: '🇬🇧', label: 'UK' },
  { code: '+1',   flag: '🇺🇸', label: 'USA' },
  { code: '+49',  flag: '🇩🇪', label: 'DE' },
  { code: '+33',  flag: '🇫🇷', label: 'FR' },
  { code: '+91',  flag: '🇮🇳', label: 'IN' },
  { code: '+92',  flag: '🇵🇰', label: 'PK' },
  { code: '+20',  flag: '🇪🇬', label: 'EG' },
];

// ─── Step bar ─────────────────────────────────────────────────────────────────
function BookingStepBar({ current = 0 }) {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={
                      active
                        ? { background: BRAND_GRADIENT, color: '#fff' }
                        : done
                        ? { background: '#00B1C5', color: '#fff' }
                        : { background: '#F3F4F6', color: '#9CA3AF' }
                    }
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${active ? 'text-[#005F56]' : done ? 'text-[#00B1C5]' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mb-5 rounded"
                    style={{ background: done ? BRAND_GRADIENT : '#E5E7EB' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Booking summary panel ────────────────────────────────────────────────────
function BookingSummaryPanel({ from, to, date, time, passengers, selectedVehicle }) {
  const vehicle = VEHICLES.find(v => v.id === selectedVehicle);
  const price = vehicle ? (vehicle.discountPrice ?? vehicle.basePrice) : null;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const arrivalTime = time
    ? (() => {
        const [h, m] = time.split(':').map(Number);
        const arr = new Date(0, 0, 0, h, m + 17);
        return arr.toTimeString().slice(0, 5);
      })()
    : '—';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Your Booking</h2>
      </div>

      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">One way</span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
          <Users className="h-3.5 w-3.5 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">{passengers || 1} Passenger{(passengers || 1) > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#00B1C5]">Outward · {formattedDate}</span>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <span>Edit</span>
          </button>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1.5 flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#005F56]" />
            <div className="w-0.5 h-8 bg-gray-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#00B1C5]" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{from || 'Origin'}</p>
              <span className="text-sm font-bold text-gray-700">{time || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{to || 'Destination'}</p>
              <span className="text-sm font-bold text-gray-700">{arrivalTime}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">~17 min · ~20 Km / 13 Mi</p>
      </div>

      <div className="px-5 py-3 border-b border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#00B1C5]/40 text-[#005F56] font-semibold text-sm hover:border-[#00B1C5] hover:bg-[#00B1C5]/5 transition-all">
          <RotateCcw className="h-4 w-4" /> Add return
        </button>
      </div>

      {vehicle && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Your choice</p>
          <div className="flex items-center gap-3">
            <Image src={vehicle.image} alt={vehicle.name} width={60} height={40} className="h-10 w-auto object-contain" />
            <div>
              <p className="font-bold text-gray-900 text-sm">{vehicle.name}</p>
              <p className="text-xs text-gray-500">Up to {vehicle.passengers} · {vehicle.luggage} medium bags</p>
            </div>
          </div>
        </div>
      )}

      {vehicle && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-bold text-gray-900 text-sm mb-3">Price details</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-lg font-bold text-gray-900">SAR {price?.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Outward</span>
            <span className="text-sm text-gray-600">SAR {price?.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {FEATURE_BADGES.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5">
              <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color }} />
              <span className="text-xs text-gray-700 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 flex flex-wrap items-center gap-2">
        {PAYMENT_ICONS.map(({ src, alt }) => (
          <div key={alt} className="px-2 py-1 bg-gray-100 rounded-lg flex items-center justify-center">
            <Image src={src} alt={alt} width={36} height={22} className="h-4 w-auto object-contain" />
          </div>
        ))}
        <span className="text-xs text-gray-400 font-medium">Apple Pay</span>
        <span className="text-xs text-gray-400 font-medium">G Pay</span>
      </div>
    </div>
  );
}

// ─── Passenger form ───────────────────────────────────────────────────────────
function PassengerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from         = searchParams.get('from')         || '';
  const to           = searchParams.get('to')           || '';
  const date         = searchParams.get('date')         || '';
  const time         = searchParams.get('time')         || '';
  const passengers   = searchParams.get('passengers')   || '1';
  const vehicle      = searchParams.get('vehicle')      || 'economy';
  const flightNumber = searchParams.get('flightNumber') || '';
  const childSeat    = searchParams.get('childSeat')    || '0';
  const driverNotes  = searchParams.get('driverNotes')  || '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [phone, setPhone] = useState('');
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [meetGreetName, setMeetGreetName] = useState('');
  const [errors, setErrors] = useState({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];

  const validate = () => {
    const errs = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    const params = new URLSearchParams({
      from, to, date, time, passengers, vehicle,
      flightNumber, childSeat, driverNotes,
      firstName, lastName, email, phone: `${countryCode}${phone}`,
    });
    router.push(`/vehicles/payment?${params.toString()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams({ from, to, date, time, passengers, vehicle });
    router.push(`/vehicles/extras?${params.toString()}`);
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepBar current={2} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* Left column — Passenger form */}
          <div className="space-y-5">
            {/* Lead passenger section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Lead passenger</h1>

              <div className="space-y-5">
                {/* Name row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                      First name *
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First name"
                      className={inputCls('firstName')}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                      Last name *
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Last name"
                      className={inputCls('lastName')}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                    Email address *
                    <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                    className={inputCls('email')}
                  />
                  <p className="text-xs text-gray-400 mt-1.5">We&apos;ll send your booking voucher here.</p>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Mobile number */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                    Mobile number *
                    <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                  </label>
                  <div className="flex">
                    {/* Country code selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-1.5 px-3 py-3 border border-gray-200 border-r-0 rounded-l-xl text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors min-w-[100px]"
                      >
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span className="font-medium">· {selectedCountry.code}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-auto" />
                      </button>
                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-56 overflow-y-auto">
                          {COUNTRY_CODES.map(c => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => { setCountryCode(c.code); setShowCountryDropdown(false); }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                c.code === countryCode ? 'bg-[#00B1C5]/5 text-[#005F56] font-semibold' : 'text-gray-700'
                              }`}
                            >
                              <span className="text-base">{c.flag}</span>
                              <span>{c.label}</span>
                              <span className="text-gray-400 ml-auto">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="5XX XXX XXXX"
                      className={`flex-1 px-4 py-3 border border-gray-200 rounded-r-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all ${
                        errors.phone ? 'border-red-400' : ''
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Please provide a contact number so our driver can reach the passenger if needed.</p>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Notifications section */}
            <div className="space-y-3">
              {/* Email & App notifications */}
              <button
                type="button"
                onClick={() => setEmailNotify(!emailNotify)}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  emailNotify ? 'border-[#00B1C5] bg-[#00B1C5]/5' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  emailNotify ? 'bg-[#00B1C5]' : 'border-2 border-gray-300 bg-white'
                }`}>
                  {emailNotify && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="h-4 w-4 text-[#005F56]" />
                    <span className="text-sm font-bold text-gray-900">Email &amp; App notifications</span>
                    <span className="ml-auto text-xs font-bold text-[#00B1C5] bg-[#00B1C5]/10 px-2.5 py-0.5 rounded-full">Free</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Live ride tracking, driver info and status alerts via email and the KSA Rides app.
                  </p>
                </div>
              </button>

              {/* SMS / WhatsApp notifications */}
              <button
                type="button"
                onClick={() => setSmsNotify(!smsNotify)}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  smsNotify ? 'border-[#00B1C5] bg-[#00B1C5]/5' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  smsNotify ? 'bg-[#00B1C5]' : 'border-2 border-gray-300 bg-white'
                }`}>
                  {smsNotify && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-[#005F56]" />
                    <span className="text-sm font-bold text-gray-900">SMS / WhatsApp notifications</span>
                    <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">SAR 1.49</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Receive booking updates, driver details and ride status via SMS or WhatsApp message.
                  </p>
                </div>
              </button>
            </div>

            {/* Meet & Greet */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Meet &amp; Greet</h2>
              <p className="text-sm text-gray-500 mb-4">Meet &amp; Greet with a sign — enter the name to display.</p>
              <input
                type="text"
                value={meetGreetName}
                onChange={e => setMeetGreetName(e.target.value)}
                placeholder="e.g. Mr. Smith"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all"
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                style={{ background: BRAND_GRADIENT }}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Right column — Booking summary */}
          <div className="sticky top-20">
            <BookingSummaryPanel
              from={from} to={to} date={date} time={time}
              passengers={parseInt(passengers)}
              selectedVehicle={vehicle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PassengerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <PassengerContent />
    </Suspense>
  );
}
