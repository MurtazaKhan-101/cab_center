"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Users, CheckCircle2, Shield, UserCheck, Plane,
  ArrowRight, RotateCcw, ChevronLeft, ChevronDown, Info,
  CreditCard, Lock, Tag, CalendarCheck, Award,
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

const COUNTRIES = [
  'Saudi Arabia', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Germany', 'France', 'India', 'Pakistan', 'Egypt', 'Turkey', 'Canada', 'Australia',
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

// ─── Booking summary panel (simplified for payment) ───────────────────────────
function BookingSummaryPanel({ from, to, date, time, passengers, selectedVehicle }) {
  const vehicle = VEHICLES.find(v => v.id === selectedVehicle);

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

// ─── Payment form ─────────────────────────────────────────────────────────────
function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from       = searchParams.get('from')       || '';
  const to         = searchParams.get('to')         || '';
  const date       = searchParams.get('date')       || '';
  const time       = searchParams.get('time')       || '';
  const passengers = searchParams.get('passengers') || '1';
  const vehicle    = searchParams.get('vehicle')    || 'economy';

  const selectedVehicle = VEHICLES.find(v => v.id === vehicle);
  const price = selectedVehicle ? (selectedVehicle.discountPrice ?? selectedVehicle.basePrice) : 0;

  // Find next upgrade vehicle
  const vehicleIdx = VEHICLES.findIndex(v => v.id === vehicle);
  const upgradeVehicle = vehicleIdx >= 0 && vehicleIdx < VEHICLES.length - 1 ? VEHICLES[vehicleIdx + 1] : null;
  const upgradePrice = upgradeVehicle ? (upgradeVehicle.discountPrice ?? upgradeVehicle.basePrice) : 0;
  const upgradeDiff = upgradePrice - price;

  // Billing address state
  const [billingType, setBillingType] = useState('receipt');
  const [billingFirst, setBillingFirst] = useState('');
  const [billingLast, setBillingLast] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [saveBilling, setSaveBilling] = useState(false);

  // Coupon
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Terms
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [joinLoyalty, setJoinLoyalty] = useState(false);

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Free cancellation date (48h from now)
  const cancelDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

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

  const handlePay = () => {
    if (!validate()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
      router.push(`/vehicles/passport?${params.toString()}`);
    }, 2000);
  };

  const handleBack = () => {
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    router.push(`/vehicles/passenger?${params.toString()}`);
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepBar current={3} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* Left column */}
          <div className="space-y-5">

            {/* Billing address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Billing address</h1>

              {/* Tax receipt / Tax invoice radio */}
              <div className="flex items-center gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="billingType" value="receipt"
                    checked={billingType === 'receipt'}
                    onChange={() => setBillingType('receipt')}
                    className="w-4 h-4 text-[#00B1C5] accent-[#00B1C5]"
                  />
                  <span className="text-sm font-medium text-gray-700">Tax Receipt</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="billingType" value="invoice"
                    checked={billingType === 'invoice'}
                    onChange={() => setBillingType('invoice')}
                    className="w-4 h-4 text-[#00B1C5] accent-[#00B1C5]"
                  />
                  <span className="text-sm font-medium text-gray-700">Tax Invoice</span>
                </label>
              </div>

              <div className="space-y-4">
                {/* First / Last name */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First name *</label>
                    <input
                      type="text" value={billingFirst}
                      onChange={e => setBillingFirst(e.target.value)}
                      placeholder="First name"
                      className={inputCls('billingFirst')}
                    />
                    {errors.billingFirst && <p className="text-xs text-red-500 mt-1">{errors.billingFirst}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last name *</label>
                    <input
                      type="text" value={billingLast}
                      onChange={e => setBillingLast(e.target.value)}
                      placeholder="Last name"
                      className={inputCls('billingLast')}
                    />
                    {errors.billingLast && <p className="text-xs text-red-500 mt-1">{errors.billingLast}</p>}
                  </div>
                </div>

                {/* Company */}
                {billingType === 'invoice' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company</label>
                    <input
                      type="text" value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="Company name"
                      className={inputCls('company')}
                    />
                  </div>
                )}

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address *</label>
                  <input
                    type="text" value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street address"
                    className={inputCls('address')}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                {/* Province / State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Province / State</label>
                  <input
                    type="text" value={province}
                    onChange={e => setProvince(e.target.value)}
                    placeholder="Province or state"
                    className={inputCls('province')}
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                  <input
                    type="text" value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City"
                    className={inputCls('city')}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>

                {/* ZIP + Country row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">ZIP / Postal code *</label>
                    <input
                      type="text" value={zip}
                      onChange={e => setZip(e.target.value)}
                      placeholder="ZIP code"
                      className={inputCls('zip')}
                    />
                    {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save billing address */}
                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox" checked={saveBilling}
                    onChange={e => setSaveBilling(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#00B1C5]"
                  />
                  <span className="text-sm text-gray-700">Save billing address for future bookings</span>
                </label>
              </div>
            </div>

            {/* Upgrade banner */}
            {upgradeVehicle && (
              <div className="rounded-2xl border-2 border-[#00B1C5]/30 bg-gradient-to-r from-[#005F56]/5 to-[#00B1C5]/5 p-5 flex items-center gap-4">
                <Image
                  src={upgradeVehicle.image} alt={upgradeVehicle.name}
                  width={80} height={50} className="h-12 w-auto object-contain flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">A Small Upgrade. A Big Difference.</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Upgrade to <span className="font-semibold text-[#005F56]">{upgradeVehicle.name}</span> for just{' '}
                    <span className="font-bold text-[#005F56]">+SAR {upgradeDiff.toFixed(2)}</span> more.
                  </p>
                </div>
                <button
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-all"
                  style={{ background: BRAND_GRADIENT }}
                >
                  Upgrade
                </button>
              </div>
            )}

            {/* Price breakdown */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Outward · {selectedVehicle?.name ?? 'Vehicle'}</span>
                  <span className="font-semibold text-gray-900">SAR {price.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <span className="text-xl font-bold text-gray-900">SAR {price.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              {!showCoupon ? (
                <button
                  onClick={() => setShowCoupon(true)}
                  className="flex items-center gap-1.5 text-sm text-[#00B1C5] font-semibold hover:underline"
                >
                  <Tag className="h-3.5 w-3.5" /> Have a coupon?
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text" value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5]"
                  />
                  <button
                    className="px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Info notices */}
            <div className="space-y-3">
              {/* No additional fees */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#00B1C5]/5 border border-[#00B1C5]/20">
                <CheckCircle2 className="h-5 w-5 text-[#00B1C5] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">No additional fees.</span> The price you see is the price you pay — all inclusive.
                </p>
              </div>

              {/* Free cancellation */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#00B1C5]/5 border border-[#00B1C5]/20">
                <CalendarCheck className="h-5 w-5 text-[#00B1C5] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Book today, lock the price.</span> You can cancel for free before{' '}
                  <span className="font-semibold">{cancelDate}</span> and get a full refund.
                </p>
              </div>
            </div>

            {/* KSA Rides loyalty */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-[#005F56]/5 to-[#00B1C5]/5 p-5">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-[#005F56]" />
                <span className="text-sm font-bold text-gray-900">KSA Rides Rewards</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Miles you could earn with this ride: <span className="font-bold text-[#005F56]">+{Math.round(price * 0.2)} Miles</span>
              </p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox" checked={joinLoyalty}
                  onChange={e => setJoinLoyalty(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#00B1C5]"
                />
                <span className="text-sm text-gray-700">Join KSA Rides Rewards and start earning miles</span>
              </label>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox" checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#00B1C5] mt-0.5"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I accept the{' '}
                  <a href="/terms" className="text-[#00B1C5] font-semibold hover:underline">Terms &amp; Conditions</a>{' '}
                  and <a href="/privacy" className="text-[#00B1C5] font-semibold hover:underline">Booking Conditions</a>.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-2 ml-7">{errors.terms}</p>}
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
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: BRAND_GRADIENT }}
              >
                <Lock className="h-4 w-4" />
                {isProcessing ? 'Processing...' : `Pay SAR ${price.toFixed(2)}`}
              </button>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Your payment is securely encrypted with SSL/TLS</span>
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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
