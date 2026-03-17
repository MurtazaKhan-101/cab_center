"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users, Briefcase, ChevronDown,
  Clock, ArrowRight, RotateCcw, Plus,
  CheckCircle2, Shield, UserCheck, Plane,
  HelpCircle,
} from 'lucide-react';

const BRAND_GRADIENT = 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)';

// ─── Vehicle catalogue ────────────────────────────────────────────────────────
const VEHICLES = [
  {
    id: 'economy',
    name: 'Economy',
    badge: { label: 'BEST VALUE', color: '#00B1C5' },
    passengers: 3,
    luggage: 3,
    examples: 'Toyota Camry, Honda Accord or similar',
    image: '/images/Standard Class Taxi.svg',
    basePrice: 65.55,
    discountPrice: null,
  },
  {
    id: 'standard',
    name: 'Standard',
    badge: { label: 'MOST POPULAR', color: '#E86C1F' },
    passengers: 3,
    luggage: 3,
    examples: 'Mercedes E Class, BMW 5 Series or similar',
    image: '/images/First Class Transfer.svg',
    basePrice: 96.13,
    discountPrice: 87.39,
  },
  {
    id: 'first-class',
    name: 'First Class',
    badge: { label: 'TOP CLASS', color: '#7B61FF' },
    passengers: 3,
    luggage: 3,
    examples: 'Mercedes S Class, BMW 7, Audi A8 or similar',
    image: '/images/SUV Limo Class.svg',
    basePrice: 157.31,
    discountPrice: null,
  },
  {
    id: 'standard-van',
    name: 'Standard Van',
    badge: null,
    passengers: 7,
    luggage: 7,
    examples: 'Mercedes Vito, Ford Custom, Chevrolet Suburban or similar',
    image: '/images/Standard Van Transfer.svg',
    basePrice: 102.82,
    discountPrice: 93.47,
  },
  {
    id: 'first-class-van',
    name: 'First Class Van',
    badge: { label: 'TOP CLASS', color: '#7B61FF' },
    passengers: 6,
    luggage: 6,
    examples: 'Mercedes V Class, Cadillac Escalade or similar',
    image: '/images/First Class Van Transfer.svg',
    basePrice: 157.68,
    discountPrice: null,
  },
  {
    id: 'minibus',
    name: 'Minibus 12 Pax',
    badge: null,
    passengers: 12,
    luggage: 12,
    examples: 'Mercedes Sprinter, Ford Transit or similar',
    image: '/images/Minibus 12 Pax.svg',
    basePrice: 220.00,
    discountPrice: null,
  },
];

const STEPS = ['Vehicle', 'Extras', 'Passenger', 'Payment', 'Passport'];



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

// ─── Route map placeholder ────────────────────────────────────────────────────
function RouteMapSection({ from, to, date, time, passengers }) {
  const formatted = date
    ? new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 mb-2">
      {/* Map visual placeholder */}
      <div className="relative bg-[#EDF2F0] h-48 sm:h-56 flex items-center justify-center overflow-hidden">
        {/* Route line SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#005F56" />
              <stop offset="100%" stopColor="#00B1C5" />
            </linearGradient>
          </defs>
          {/* Background grid */}
          {[...Array(8)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 32} x2="800" y2={i * 32} stroke="#C8D8D0" strokeWidth="0.8" />
          ))}
          {[...Array(16)].map((_, i) => (
            <line key={`v${i}`} x1={i * 56} y1="0" x2={i * 56} y2="220" stroke="#C8D8D0" strokeWidth="0.8" />
          ))}
          {/* Route curve */}
          <path d="M 100,160 C 250,160 300,60 700,60"
            stroke="url(#routeGrad)" strokeWidth="4" fill="none" strokeLinecap="round"
            strokeDasharray="0" />
          {/* Origin marker */}
          <circle cx="100" cy="160" r="10" fill="#005F56" />
          <circle cx="100" cy="160" r="5" fill="#fff" />
          {/* Destination marker */}
          <circle cx="700" cy="60" r="10" fill="#00B1C5" />
          <circle cx="700" cy="60" r="5" fill="#fff" />
        </svg>

        {/* Origin label */}
        <div className="absolute bottom-5 left-6 bg-white rounded-xl px-3 py-2 shadow-md flex items-center gap-2 max-w-[45%]">
          <div className="w-3 h-3 rounded-full bg-[#005F56] flex-shrink-0" />
          <p className="text-xs font-semibold text-gray-800 truncate">{from || 'Origin'}</p>
        </div>
        {/* Destination label */}
        <div className="absolute top-5 right-6 bg-white rounded-xl px-3 py-2 shadow-md flex items-center gap-2 max-w-[45%]">
          <div className="w-3 h-3 rounded-full bg-[#00B1C5] flex-shrink-0" />
          <p className="text-xs font-semibold text-gray-800 truncate">{to || 'Destination'}</p>
        </div>
      </div>

      {/* Route info bar */}
      <div className="bg-white px-4 py-3 flex flex-wrap items-center gap-4 text-sm text-gray-600 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-[#00B1C5]" />
          <span className="text-xs font-medium text-gray-700">All prices include VAT, taxes &amp; tolls</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">~17 min &nbsp;·&nbsp; ~20 km</span>
        </div>
      </div>
    </div>
  );
}

// ─── Vehicle card ─────────────────────────────────────────────────────────────
function VehicleCard({ vehicle, selected, onSelect }) {
  const price = vehicle.discountPrice ?? vehicle.basePrice;

  return (
    <div
      onClick={() => onSelect(vehicle.id)}
      className={`relative flex items-center gap-4 bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all border-2 ${
        selected
          ? 'border-[#00B1C5] shadow-md shadow-[#00B1C5]/10'
          : 'border-gray-200 hover:border-[#00B1C5]/50 hover:shadow-sm'
      }`}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: BRAND_GRADIENT }}>
          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      {/* Vehicle image */}
      <div className="w-24 sm:w-32 flex-shrink-0">
        <Image src={vehicle.image} alt={vehicle.name} width={130} height={80}
          className="w-full h-16 sm:h-20 object-contain" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg">{vehicle.name}</h3>
          {vehicle.badge && (
            <span className="px-2 py-0.5 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: vehicle.badge.color }}>
              {vehicle.badge.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-1.5">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> Up to {vehicle.passengers}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" /> {vehicle.luggage}
          </span>
          <HelpCircle className="h-3.5 w-3.5 text-gray-300 cursor-pointer hover:text-gray-500" />
        </div>

        <p className="text-gray-400 text-xs">{vehicle.examples}</p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        {vehicle.discountPrice && (
          <p className="text-sm text-gray-400 line-through">SAR {vehicle.basePrice.toFixed(2)}</p>
        )}
        <p className="font-bold text-gray-900 text-lg sm:text-xl">
          SAR {price.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400">Total price</p>
      </div>
    </div>
  );
}

// ─── Round trip banner ────────────────────────────────────────────────────────
function RoundTripBanner({ onAdd }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 sm:p-5 border border-gray-200">
      <div className="flex flex-col items-center text-gray-700">
        <ArrowRight className="h-4 w-4" />
        <RotateCcw className="h-4 w-4 mt-0.5" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-gray-900 text-sm">Round trip? Travel smarter.</p>
        <p className="text-gray-500 text-xs mt-0.5">Add a return ride now to save time and money.</p>
      </div>
      <button
        onClick={onAdd}
        className="w-9 h-9 rounded-xl border-2 border-[#00B1C5] flex items-center justify-center text-[#00B1C5] hover:bg-[#00B1C5]/10 transition-colors flex-shrink-0"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}

// ─── Booking summary panel ────────────────────────────────────────────────────
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

      {/* Trip type + pax */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">One way</span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
          <Users className="h-3.5 w-3.5 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">{passengers || 1} Passenger{(passengers || 1) > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Route */}
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
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{from || 'Origin'}</p>
                  <span className="text-sm font-bold text-gray-700">{time || '—'}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{to || 'Destination'}</p>
                  <span className="text-sm font-bold text-gray-700">{arrivalTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">~17 min &nbsp;·&nbsp; ~20 Km / 13 Mi</p>
      </div>

      {/* Add return */}
      <div className="px-5 py-3 border-b border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#00B1C5]/40 text-[#005F56] font-semibold text-sm hover:border-[#00B1C5] hover:bg-[#00B1C5]/5 transition-all">
          <RotateCcw className="h-4 w-4" /> Add return
        </button>
      </div>

      {/* Price details */}
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

      {/* Feature badges */}
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

      {/* Payment icons */}
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

// ─── Sticky bottom bar ────────────────────────────────────────────────────────
function StickyBottomBar({ selectedVehicle, onContinue }) {
  const vehicle = VEHICLES.find(v => v.id === selectedVehicle);
  const price = vehicle ? (vehicle.discountPrice ?? vehicle.basePrice) : null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Your choice:{' '}
            <span className="font-bold text-gray-900">{vehicle?.name ?? 'None selected'}</span>
          </span>
          {price && (
            <span className="text-sm font-bold text-[#005F56] ml-2">SAR {price.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={onContinue}
          disabled={!selectedVehicle}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: selectedVehicle ? BRAND_GRADIENT : '#9CA3AF' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function VehiclesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from       = searchParams.get('from')       || '';
  const to         = searchParams.get('to')         || '';
  const date       = searchParams.get('date')       || '';
  const time       = searchParams.get('time')       || '';
  const passengers = searchParams.get('passengers') || '1';

  const [selectedVehicle, setSelectedVehicle] = useState('economy');

  const handleContinue = () => {
    const params = new URLSearchParams({ from, to, date, time, passengers, vehicle: selectedVehicle });
    router.push(`/vehicles/extras?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <BookingStepBar current={0} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* Left column */}
          <div className="space-y-3">
            <RouteMapSection from={from} to={to} date={date} time={time} passengers={passengers} />

            {/* Vehicle list */}
            <div className="space-y-3">
              {VEHICLES.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  selected={selectedVehicle === v.id}
                  onSelect={setSelectedVehicle}
                />
              ))}
            </div>

            <RoundTripBanner onAdd={() => {}} />
          </div>

          {/* Right column: booking summary */}
          <div className="sticky top-20">
            <BookingSummaryPanel
              from={from} to={to} date={date} time={time}
              passengers={parseInt(passengers)}
              selectedVehicle={selectedVehicle}
            />
          </div>
        </div>
      </div>

      <StickyBottomBar selectedVehicle={selectedVehicle} onContinue={handleContinue} />
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <VehiclesContent />
    </Suspense>
  );
}
