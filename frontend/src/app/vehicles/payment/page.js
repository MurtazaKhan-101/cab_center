"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users, CheckCircle2, Shield, UserCheck, Plane,
  ArrowRight, RotateCcw, ChevronLeft, Info,
  Lock, Tag, CalendarCheck, Award,
} from 'lucide-react';
import { createBooking } from '../../lib/booking';

const BRAND_GRADIENT = 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)';

const STEPS = ['Vehicle', 'Extras', 'Passenger', 'Payment'];

const VEHICLE_META = {
  economy:         { name: 'Economy',         image: '/images/Standard Class Taxi.svg' },
  standard:        { name: 'Standard',        image: '/images/First Class Transfer.svg' },
  first_class:     { name: 'First Class',     image: '/images/SUV Limo Class.svg' },
  standard_van:    { name: 'Standard Van',    image: '/images/Standard Van Transfer.svg' },
  first_class_van: { name: 'First Class Van', image: '/images/First Class Van Transfer.svg' },
  minibus:         { name: 'Minibus 12 Pax',  image: '/images/Minibus 12 Pax.svg' },
};

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

const COUNTRIES = [
  'Saudi Arabia', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Germany', 'France', 'India', 'Pakistan', 'Egypt', 'Turkey', 'Canada', 'Australia',
];

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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={active ? { background: BRAND_GRADIENT, color: '#fff' } : done ? { background: '#00B1C5', color: '#fff' } : { background: '#F3F4F6', color: '#9CA3AF' }}>
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${active ? 'text-[#005F56]' : done ? 'text-[#00B1C5]' : 'text-gray-400'}`}>{step}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mb-5 rounded" style={{ background: done ? BRAND_GRADIENT : '#E5E7EB' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BookingSummaryPanel({ from, to, date, time, passengers, vehicleType, fare, durationMin }) {
  const meta = VEHICLE_META[vehicleType] || {};
  const price = fare ? parseFloat(fare) : null;
  const formattedDate = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const arrivalTime = time && durationMin
    ? (() => { const [h, m] = time.split(':').map(Number); const arr = new Date(0, 0, 0, h, m + parseInt(durationMin)); return arr.toTimeString().slice(0, 5); })()
    : '—';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-900">Your Booking</h2></div>
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">One way</span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
          <Users className="h-3.5 w-3.5 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">{passengers || 1} Passenger{(parseInt(passengers) || 1) > 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="px-5 py-4 border-b border-gray-100">
        <span className="text-xs font-bold text-[#00B1C5]">Outward · {formattedDate}</span>
        <div className="flex items-start gap-3 mt-3">
          <div className="mt-1.5 flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#005F56]" /><div className="w-0.5 h-8 bg-gray-200" /><div className="w-2.5 h-2.5 rounded-full bg-[#00B1C5]" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between"><p className="font-semibold text-gray-900 text-sm">{from || 'Origin'}</p><span className="text-sm font-bold text-gray-700">{time || '—'}</span></div>
            <div className="flex items-center justify-between"><p className="font-semibold text-gray-900 text-sm">{to || 'Destination'}</p><span className="text-sm font-bold text-gray-700">{arrivalTime}</span></div>
          </div>
        </div>
      </div>
      {meta.image && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Your choice</p>
          <div className="flex items-center gap-3">
            <Image src={meta.image} alt={meta.name} width={60} height={40} className="h-10 w-auto object-contain" />
            <p className="font-bold text-gray-900 text-sm">{meta.name}</p>
          </div>
        </div>
      )}
      {price != null && (
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Total</span><span className="text-lg font-bold text-gray-900">SAR {price.toFixed(2)}</span></div>
        </div>
      )}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {FEATURE_BADGES.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5">
              <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color }} /><span className="text-xs text-gray-700 font-medium">{label}</span>
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
      </div>
    </div>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from         = searchParams.get('from')         || '';
  const to           = searchParams.get('to')           || '';
  const date         = searchParams.get('date')         || '';
  const time         = searchParams.get('time')         || '';
  const passengers   = searchParams.get('passengers')   || '1';
  const vehicle      = searchParams.get('vehicle')      || 'economy';
  const fare         = searchParams.get('fare')         || '';
  const distanceKm   = searchParams.get('distanceKm')   || '';
  const durationMin  = searchParams.get('durationMin')  || '';
  const serviceType  = searchParams.get('serviceType')  || 'transfer';
  const flightNumber = searchParams.get('flightNumber') || '';
  const childSeat    = searchParams.get('childSeat')    === '1';
  const driverNotes  = searchParams.get('driverNotes')  || '';
  const firstName    = searchParams.get('firstName')    || '';
  const lastName     = searchParams.get('lastName')     || '';
  const email        = searchParams.get('email')        || '';
  const phone        = searchParams.get('phone')        || '';
  const meetGreetName = searchParams.get('meetGreetName') || '';
  const duration     = searchParams.get('duration')     || '';
  const isRoundTrip  = searchParams.get('isRoundTrip')  === '1';
  const returnDate   = searchParams.get('returnDate')   || '';
  const returnTime   = searchParams.get('returnTime')   || '';

  const price = fare ? parseFloat(fare) : 0;

  const [billingType, setBillingType] = useState('receipt');
  const [billingFirst, setBillingFirst] = useState(firstName);
  const [billingLast, setBillingLast] = useState(lastName);
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [saveBilling, setSaveBilling] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [joinLoyalty, setJoinLoyalty] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState('');

  const cancelDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const validate = () => {
    const errs = {};
    if (!billingFirst.trim()) errs.billingFirst = 'First name is required';
    if (!billingLast.trim()) errs.billingLast = 'Last name is required';
    if (!address.trim()) errs.address = 'Address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!zip.trim()) errs.zip = 'ZIP / Postal code is required';
    if (!acceptTerms) errs.terms = 'You must accept the terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setIsProcessing(true);
    setApiError('');

    try {
      const bookingData = {
        service_type: serviceType,
        first_name: firstName,
        last_name: lastName,
        contact_number: phone,
        email,
        no_of_passengers: parseInt(passengers) || 1,
        pickup: from,
        drop: to,
        distance_km: distanceKm ? parseFloat(distanceKm) : 0,
        vehicle_type: vehicle,
        date,
        time,
        payment_method: 'card',
        flight_number: flightNumber,
        child_seat: childSeat,
        driver_notes: driverNotes,
        meet_greet_name: meetGreetName,
        is_round_trip: isRoundTrip,
        return_date: isRoundTrip && returnDate ? returnDate : undefined,
        return_time: isRoundTrip && returnTime ? returnTime : undefined,
        duration_hours: duration ? parseInt(duration) : undefined,
      };

      const response = await createBooking(bookingData);

      if (response.success && response.booking) {
        const confirmParams = new URLSearchParams({
          bookingId: response.booking._id,
          from, to, date, time, passengers, vehicle,
          fare: String(response.booking.total_fare),
        });
        router.push(`/vehicles/confirmation?${confirmParams.toString()}`);
      } else {
        setApiError(response.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    router.push(`/vehicles/passenger?${params.toString()}`);
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  const meta = VEHICLE_META[vehicle] || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepBar current={3} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="space-y-5">
            {/* API error */}
            {apiError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">{apiError}</div>
            )}

            {/* Billing address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Billing address</h1>
              <div className="flex items-center gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="billingType" value="receipt" checked={billingType === 'receipt'} onChange={() => setBillingType('receipt')} className="w-4 h-4 accent-[#00B1C5]" />
                  <span className="text-sm font-medium text-gray-700">Tax Receipt</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="billingType" value="invoice" checked={billingType === 'invoice'} onChange={() => setBillingType('invoice')} className="w-4 h-4 accent-[#00B1C5]" />
                  <span className="text-sm font-medium text-gray-700">Tax Invoice</span>
                </label>
              </div>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First name *</label>
                    <input type="text" value={billingFirst} onChange={e => setBillingFirst(e.target.value)} placeholder="First name" className={inputCls('billingFirst')} />
                    {errors.billingFirst && <p className="text-xs text-red-500 mt-1">{errors.billingFirst}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last name *</label>
                    <input type="text" value={billingLast} onChange={e => setBillingLast(e.target.value)} placeholder="Last name" className={inputCls('billingLast')} />
                    {errors.billingLast && <p className="text-xs text-red-500 mt-1">{errors.billingLast}</p>}
                  </div>
                </div>
                {billingType === 'invoice' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company</label>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name" className={inputCls('company')} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address *</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" className={inputCls('address')} />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Province / State</label>
                  <input type="text" value={province} onChange={e => setProvince(e.target.value)} placeholder="Province or state" className={inputCls('province')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" className={inputCls('city')} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">ZIP / Postal code *</label>
                    <input type="text" value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP code" className={inputCls('zip')} />
                    {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all">
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                  <input type="checkbox" checked={saveBilling} onChange={e => setSaveBilling(e.target.checked)} className="w-4 h-4 rounded accent-[#00B1C5]" />
                  <span className="text-sm text-gray-700">Save billing address for future bookings</span>
                </label>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Outward · {meta.name ?? vehicle}</span>
                  <span className="font-semibold text-gray-900">SAR {price.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <span className="text-xl font-bold text-gray-900">SAR {price.toFixed(2)}</span>
                </div>
              </div>
              {!showCoupon ? (
                <button onClick={() => setShowCoupon(true)} className="flex items-center gap-1.5 text-sm text-[#00B1C5] font-semibold hover:underline">
                  <Tag className="h-3.5 w-3.5" /> Have a coupon?
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5]" />
                  <button className="px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all" style={{ background: BRAND_GRADIENT }}>Apply</button>
                </div>
              )}
            </div>

            {/* Info notices */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#00B1C5]/5 border border-[#00B1C5]/20">
                <CheckCircle2 className="h-5 w-5 text-[#00B1C5] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700"><span className="font-semibold">No additional fees.</span> The price you see is the price you pay — all inclusive.</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#00B1C5]/5 border border-[#00B1C5]/20">
                <CalendarCheck className="h-5 w-5 text-[#00B1C5] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700"><span className="font-semibold">Book today, lock the price.</span> Free cancellation before <span className="font-semibold">{cancelDate}</span>.</p>
              </div>
            </div>

            {/* Loyalty */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-[#005F56]/5 to-[#00B1C5]/5 p-5">
              <div className="flex items-center gap-3 mb-2"><Award className="h-5 w-5 text-[#005F56]" /><span className="text-sm font-bold text-gray-900">KSA Rides Rewards</span></div>
              <p className="text-sm text-gray-600 mb-3">Miles you could earn: <span className="font-bold text-[#005F56]">+{Math.round(price * 0.2)} Miles</span></p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={joinLoyalty} onChange={e => setJoinLoyalty(e.target.checked)} className="w-4 h-4 rounded accent-[#00B1C5]" />
                <span className="text-sm text-gray-700">Join KSA Rides Rewards and start earning miles</span>
              </label>
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="w-4 h-4 rounded accent-[#00B1C5] mt-0.5" />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I accept the <a href="/terms" className="text-[#00B1C5] font-semibold hover:underline">Terms &amp; Conditions</a> and <a href="/privacy" className="text-[#00B1C5] font-semibold hover:underline">Booking Conditions</a>.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-2 ml-7">{errors.terms}</p>}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: BRAND_GRADIENT }}
              >
                <Lock className="h-4 w-4" />
                {isProcessing ? 'Processing...' : `Pay SAR ${price.toFixed(2)}`}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="h-3.5 w-3.5" /><span>Your payment is securely encrypted with SSL/TLS</span>
            </div>
          </div>

          <div className="sticky top-20">
            <BookingSummaryPanel
              from={from} to={to} date={date} time={time}
              passengers={passengers} vehicleType={vehicle}
              fare={fare} durationMin={durationMin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
