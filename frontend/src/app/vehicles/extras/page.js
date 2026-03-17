"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users, Briefcase, CheckCircle2, Shield, UserCheck, Plane,
  ArrowRight, RotateCcw, Clock, Search, ChevronLeft, HelpCircle,
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
        <div className="space-y-3">
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

// ─── Extras form ──────────────────────────────────────────────────────────────
function ExtrasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from       = searchParams.get('from')       || '';
  const to         = searchParams.get('to')         || '';
  const date       = searchParams.get('date')       || '';
  const time       = searchParams.get('time')       || '';
  const passengers = searchParams.get('passengers') || '1';
  const vehicle    = searchParams.get('vehicle')    || 'economy';

  const [flightNumber, setFlightNumber] = useState('');
  const [childSeat, setChildSeat] = useState(false);
  const [driverNotes, setDriverNotes] = useState('');

  const buildParams = (extra = {}) => {
    const p = { from, to, date, time, passengers, vehicle, flightNumber, childSeat: childSeat ? '1' : '0', driverNotes, ...extra };
    return new URLSearchParams(p).toString();
  };

  const handleContinue = () => {
    router.push(`/vehicles/passenger?${buildParams()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams({ from, to, date, time, passengers });
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepBar current={1} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* Left column — Extras form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Extras &amp; notes</h1>

            {/* Flight number */}
            <div className="mb-6">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#00B1C5] mb-2">
                Flight number
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={e => setFlightNumber(e.target.value)}
                    placeholder="e.g. LH1868"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Search className="h-4 w-4" />
                  Find flight
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please provide your <span className="underline">flight number</span> (<span className="underline">driver will track your flight and adjust pickup time accordingly</span>)
              </p>
            </div>

            <div className="border-t border-gray-100 my-6" />

            {/* Child / booster seat */}
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={childSeat}
                  onChange={e => setChildSeat(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#00B1C5] focus:ring-[#00B1C5]/30 cursor-pointer"
                />
              </div>
              <span className="text-sm text-gray-800 font-medium">Need a child or booster seat?</span>
            </label>

            <div className="border-t border-gray-100 my-6" />

            {/* Driver notes */}
            <div className="mb-8">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-2">
                Driver notes (Outward)
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              </label>
              <textarea
                value={driverNotes}
                onChange={e => setDriverNotes(e.target.value)}
                placeholder="Luggage info, special requests... No sensitive data—add phone in next step."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all"
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

export default function ExtrasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <ExtrasContent />
    </Suspense>
  );
}
