"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users, Briefcase, ChevronDown,
  Clock, ArrowRight, RotateCcw, Plus,
  CheckCircle2, Shield, UserCheck, Plane,
  HelpCircle, Loader2,
} from 'lucide-react';
import { getVehicleTypes } from '../lib/vehicle';
import { getSettings } from '../lib/settings';
import { calculateDistance } from '../../lib/maps';

const BRAND_GRADIENT = 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)';

const VEHICLE_META = {
  economy:         { name: 'Economy',         image: '/images/Standard Class Taxi.svg',       badge: { label: 'BEST VALUE',   color: '#00B1C5' }, examples: 'Toyota Camry, Honda Accord or similar' },
  standard:        { name: 'Standard',        image: '/images/First Class Transfer.svg',      badge: { label: 'MOST POPULAR', color: '#E86C1F' }, examples: 'Mercedes E Class, BMW 5 Series or similar' },
  first_class:     { name: 'First Class',     image: '/images/SUV Limo Class.svg',            badge: { label: 'TOP CLASS',    color: '#7B61FF' }, examples: 'Mercedes S Class, BMW 7, Audi A8 or similar' },
  standard_van:    { name: 'Standard Van',    image: '/images/Standard Van Transfer.svg',     badge: null,                                        examples: 'Mercedes Vito, Ford Custom or similar' },
  first_class_van: { name: 'First Class Van', image: '/images/First Class Van Transfer.svg',  badge: { label: 'TOP CLASS',    color: '#7B61FF' }, examples: 'Mercedes V Class, Cadillac Escalade or similar' },
  minibus:         { name: 'Minibus 12 Pax',  image: '/images/Minibus 12 Pax.svg',            badge: null,                                        examples: 'Mercedes Sprinter, Ford Transit or similar' },
};

const STEPS = ['Vehicle', 'Extras', 'Passenger', 'Payment'];

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

function RouteMapSection({ from, to, distanceKm, durationMin }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 mb-2">
      <div className="relative bg-[#EDF2F0] h-48 sm:h-56 flex items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#005F56" />
              <stop offset="100%" stopColor="#00B1C5" />
            </linearGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 32} x2="800" y2={i * 32} stroke="#C8D8D0" strokeWidth="0.8" />
          ))}
          {[...Array(16)].map((_, i) => (
            <line key={`v${i}`} x1={i * 56} y1="0" x2={i * 56} y2="220" stroke="#C8D8D0" strokeWidth="0.8" />
          ))}
          <path d="M 100,160 C 250,160 300,60 700,60" stroke="url(#routeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="160" r="10" fill="#005F56" /><circle cx="100" cy="160" r="5" fill="#fff" />
          <circle cx="700" cy="60" r="10" fill="#00B1C5" /><circle cx="700" cy="60" r="5" fill="#fff" />
        </svg>
        <div className="absolute bottom-5 left-6 bg-white rounded-xl px-3 py-2 shadow-md flex items-center gap-2 max-w-[45%]">
          <div className="w-3 h-3 rounded-full bg-[#005F56] flex-shrink-0" />
          <p className="text-xs font-semibold text-gray-800 truncate">{from || 'Origin'}</p>
        </div>
        <div className="absolute top-5 right-6 bg-white rounded-xl px-3 py-2 shadow-md flex items-center gap-2 max-w-[45%]">
          <div className="w-3 h-3 rounded-full bg-[#00B1C5] flex-shrink-0" />
          <p className="text-xs font-semibold text-gray-800 truncate">{to || 'Destination'}</p>
        </div>
      </div>
      <div className="bg-white px-4 py-3 flex flex-wrap items-center gap-4 text-sm text-gray-600 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-[#00B1C5]" />
          <span className="text-xs font-medium text-gray-700">All prices include VAT, taxes &amp; tolls</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">
            ~{durationMin ?? '—'} min &nbsp;·&nbsp; ~{distanceKm ?? '—'} km
          </span>
        </div>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, selected, onSelect }) {
  const meta = VEHICLE_META[vehicle.vehicle_type] || {};
  const price = vehicle.calculatedFare;

  return (
    <div
      onClick={() => onSelect(vehicle.vehicle_type)}
      className={`relative flex items-center gap-4 bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all border-2 ${
        selected
          ? 'border-[#00B1C5] shadow-md shadow-[#00B1C5]/10'
          : 'border-gray-200 hover:border-[#00B1C5]/50 hover:shadow-sm'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: BRAND_GRADIENT }}>
          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
        </div>
      )}
      <div className="w-24 sm:w-32 flex-shrink-0">
        <Image src={meta.image || '/images/Standard Class Taxi.svg'} alt={meta.name || vehicle.vehicle_type} width={130} height={80} className="w-full h-16 sm:h-20 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg">{meta.name || vehicle.vehicle_type}</h3>
          {meta.badge && (
            <span className="px-2 py-0.5 rounded-full text-white text-xs font-bold" style={{ backgroundColor: meta.badge.color }}>
              {meta.badge.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-1.5">
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Up to {vehicle.capacity}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {vehicle.luggage_capacity ?? vehicle.capacity}</span>
          <HelpCircle className="h-3.5 w-3.5 text-gray-300 cursor-pointer hover:text-gray-500" />
        </div>
        <p className="text-gray-400 text-xs">{vehicle.description || meta.examples || ''}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-bold text-gray-900 text-lg sm:text-xl">SAR {price?.toFixed(2) ?? '—'}</p>
        <p className="text-xs text-gray-400">Total price</p>
      </div>
    </div>
  );
}

function RoundTripBanner({ onAdd }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 sm:p-5 border border-gray-200">
      <div className="flex flex-col items-center text-gray-700">
        <ArrowRight className="h-4 w-4" /><RotateCcw className="h-4 w-4 mt-0.5" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-gray-900 text-sm">Round trip? Travel smarter.</p>
        <p className="text-gray-500 text-xs mt-0.5">Add a return ride now to save time and money.</p>
      </div>
      <button onClick={onAdd} className="w-9 h-9 rounded-xl border-2 border-[#00B1C5] flex items-center justify-center text-[#00B1C5] hover:bg-[#00B1C5]/10 transition-colors flex-shrink-0">
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}

const FEATURE_BADGES = [
  { icon: CheckCircle2, label: 'Free cancellation', color: '#00B1C5' },
  { icon: ArrowRight,   label: 'Door-to-door service', color: '#005F56' },
  { icon: UserCheck,    label: 'Meet & Greet', color: '#005F56' },
  { icon: Plane,        label: 'Flight tracking', color: '#005F56' },
  { icon: Shield,       label: 'Licensed chauffeurs', color: '#005F56' },
];

const PAYMENT_ICONS = [
  { src: '/images/visa.svg', alt: 'Visa' },
  { src: '/images/mastercard.svg', alt: 'Mastercard' },
  { src: '/images/american-express.svg', alt: 'Amex' },
  { src: '/images/paypal.svg', alt: 'PayPal' },
];

function BookingSummaryPanel({ from, to, date, time, passengers, selectedVehicle, vehicles, distanceKm, durationMin }) {
  const vehicle = vehicles.find(v => v.vehicle_type === selectedVehicle);
  const meta = VEHICLE_META[selectedVehicle] || {};
  const price = vehicle?.calculatedFare;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const arrivalTime = time && durationMin
    ? (() => {
        const [h, m] = time.split(':').map(Number);
        const arr = new Date(0, 0, 0, h, m + durationMin);
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
        <p className="text-xs text-gray-400 mt-3">~{durationMin ?? '—'} min &nbsp;·&nbsp; ~{distanceKm ?? '—'} Km</p>
      </div>
      <div className="px-5 py-3 border-b border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#00B1C5]/40 text-[#005F56] font-semibold text-sm hover:border-[#00B1C5] hover:bg-[#00B1C5]/5 transition-all">
          <RotateCcw className="h-4 w-4" /> Add return
        </button>
      </div>
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

function StickyBottomBar({ selectedVehicle, vehicles, onContinue }) {
  const vehicle = vehicles.find(v => v.vehicle_type === selectedVehicle);
  const meta = VEHICLE_META[selectedVehicle] || {};
  const price = vehicle?.calculatedFare;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Your choice:{' '}
            <span className="font-bold text-gray-900">{meta.name ?? 'None selected'}</span>
          </span>
          {price != null && (
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

function VehiclesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from       = searchParams.get('from')       || '';
  const to         = searchParams.get('to')         || '';
  const date       = searchParams.get('date')       || '';
  const time       = searchParams.get('time')       || '';
  const passengers = searchParams.get('passengers') || '1';
  const serviceType = searchParams.get('serviceType') || 'transfer';
  const duration   = searchParams.get('duration')   || '';
  const returnDate = searchParams.get('returnDate') || '';
  const returnTime = searchParams.get('returnTime') || '';
  const isRoundTrip = searchParams.get('isRoundTrip') === '1';

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationMin, setDurationMin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [typesRes, settingsRes] = await Promise.all([
          getVehicleTypes(),
          getSettings(),
        ]);

        let dist = null;
        let dur = null;

        if (from && to) {
          try {
            const routeInfo = await calculateDistance(from, to);
            dist = routeInfo.distance_km;
            dur = routeInfo.duration_min;
          } catch (e) {
            console.warn('Distance calculation failed, fares will show per-km rates:', e.message);
          }
        }

        if (cancelled) return;

        const baseFare = settingsRes?.settings?.base_fare ?? settingsRes?.base_fare ?? 50;
        const vTypes = (typesRes?.vehicleTypes || []).map(v => ({
          ...v,
          calculatedFare: dist != null
            ? Math.round((baseFare + v.fare_per_km * dist) * 100) / 100
            : null,
        }));

        setVehicles(vTypes);
        setDistanceKm(dist);
        setDurationMin(dur);
        if (vTypes.length > 0) setSelectedVehicle(vTypes[0].vehicle_type);
      } catch (err) {
        console.error('Failed to load vehicle data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [from, to]);

  const handleContinue = () => {
    const vehicle = vehicles.find(v => v.vehicle_type === selectedVehicle);
    const params = new URLSearchParams({
      from, to, date, time, passengers,
      vehicle: selectedVehicle,
      serviceType,
      distanceKm: String(distanceKm ?? ''),
      durationMin: String(durationMin ?? ''),
      fare: String(vehicle?.calculatedFare ?? ''),
    });
    if (duration) params.set('duration', duration);
    if (isRoundTrip) {
      params.set('isRoundTrip', '1');
      params.set('returnDate', returnDate);
      params.set('returnTime', returnTime);
    }
    router.push(`/vehicles/extras?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#00B1C5] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <BookingStepBar current={0} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="space-y-3">
            <RouteMapSection from={from} to={to} distanceKm={distanceKm} durationMin={durationMin} />
            <div className="space-y-3">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.vehicle_type}
                  vehicle={v}
                  selected={selectedVehicle === v.vehicle_type}
                  onSelect={setSelectedVehicle}
                />
              ))}
              {vehicles.length === 0 && (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                  <p className="text-gray-500">No vehicles available. Please contact support or try again later.</p>
                </div>
              )}
            </div>
            {!isRoundTrip && <RoundTripBanner onAdd={() => {}} />}
          </div>
          <div className="sticky top-20">
            <BookingSummaryPanel
              from={from} to={to} date={date} time={time}
              passengers={parseInt(passengers)}
              selectedVehicle={selectedVehicle}
              vehicles={vehicles}
              distanceKm={distanceKm}
              durationMin={durationMin}
            />
          </div>
        </div>
      </div>
      <StickyBottomBar selectedVehicle={selectedVehicle} vehicles={vehicles} onContinue={handleContinue} />
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
