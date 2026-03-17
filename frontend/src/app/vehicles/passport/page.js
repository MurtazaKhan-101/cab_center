"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle2, ChevronLeft, X, Loader2,
  User, FileText, Calendar, Globe, AlertCircle,
  Shield, Camera,
} from 'lucide-react';
import { submitBookingToSheets } from '../../lib/googleSheets';

const BRAND_GRADIENT = 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)';

const STEPS = ['Vehicle', 'Extras', 'Passenger', 'Payment', 'Passport'];

const NATIONALITIES = [
  'Saudi Arabia', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Germany', 'France', 'India', 'Pakistan', 'Egypt', 'Turkey', 'Canada',
  'Australia', 'Jordan', 'Kuwait', 'Bahrain', 'Qatar', 'Oman', 'Lebanon',
  'Iraq', 'Morocco', 'Tunisia', 'Algeria', 'Sudan', 'Yemen', 'Syria',
  'Philippines', 'Indonesia', 'Bangladesh', 'Sri Lanka', 'Nepal',
  'China', 'Japan', 'South Korea', 'Malaysia', 'Thailand',
  'Brazil', 'Mexico', 'South Africa', 'Nigeria', 'Kenya',
  'Italy', 'Spain', 'Netherlands', 'Belgium', 'Sweden', 'Norway',
  'Poland', 'Switzerland', 'Austria', 'Russia', 'Ukraine',
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

function PassportUploadBox({ label, file, onFileChange, onRemove, error }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type.startsWith('image/') || dropped.type === 'application/pdf')) {
      onFileChange(dropped);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer hover:border-[#00B1C5] hover:bg-[#00B1C5]/5 ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        >
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => e.target.files[0] && onFileChange(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Camera className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              <span className="text-[#00B1C5] font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">JPG, PNG or PDF (max 5 MB)</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

function PassportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Booking params forwarded from previous steps
  const from         = searchParams.get('from')         || '';
  const to           = searchParams.get('to')           || '';
  const date         = searchParams.get('date')         || '';
  const time         = searchParams.get('time')         || '';
  const passengers   = searchParams.get('passengers')   || '1';
  const vehicle      = searchParams.get('vehicle')      || 'economy';
  const flightNumber = searchParams.get('flightNumber') || '';
  const childSeat    = searchParams.get('childSeat')    || '0';
  const driverNotes  = searchParams.get('driverNotes')  || '';
  const firstName    = searchParams.get('firstName')    || '';
  const lastName     = searchParams.get('lastName')     || '';
  const email        = searchParams.get('email')        || '';
  const phone        = searchParams.get('phone')        || '';

  const [fullName, setFullName]           = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [nationality, setNationality]     = useState('');
  const [expiryDate, setExpiryDate]       = useState('');
  const [dateOfBirth, setDateOfBirth]     = useState('');
  const [passportFront, setPassportFront] = useState(null);
  const [passportBack, setPassportBack]   = useState(null);
  const [errors, setErrors]               = useState({});
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState('');

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name as on passport is required';
    if (!passportNumber.trim()) errs.passportNumber = 'Passport number is required';
    if (!nationality) errs.nationality = 'Nationality is required';
    if (!expiryDate) errs.expiryDate = 'Passport expiry date is required';
    if (expiryDate && new Date(expiryDate) <= new Date()) errs.expiryDate = 'Passport must not be expired';
    if (!dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!passportFront) errs.passportFront = 'Please upload the passport photo page';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitBookingToSheets({
        from, to, date, time, passengers, vehicle,
        flightNumber, childSeat, driverNotes,
        firstName, lastName, email, phone,
        passportFullName: fullName,
        passportNumber,
        nationality,
        dateOfBirth,
        passportExpiry: expiryDate,
        passportFrontFile: passportFront,
        passportBackFile: passportBack,
      });
    } catch (err) {
      console.error('Google Sheets submission error:', err);
      setSubmitError('Failed to save your information. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    router.push(`/vehicles/confirmation?${params.toString()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams(Object.fromEntries(searchParams.entries()));
    router.push(`/vehicles/payment?${params.toString()}`);
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B1C5]/30 focus:border-[#00B1C5] transition-all ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  const minExpiryDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepBar current={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Passport Information</h1>
          <p className="text-sm text-gray-500">Required for international transfers. Your data is securely encrypted.</p>
        </div>

        {/* Security notice */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#00B1C5]/5 border border-[#00B1C5]/20 mb-6">
          <Shield className="h-5 w-5 text-[#00B1C5] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Your information is secure</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Passport data is encrypted and only used for identity verification. We comply with international data protection regulations.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5 mb-6">

          {/* Full name */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
              <User className="h-3.5 w-3.5" /> Full name (as on passport) *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. MOHAMMED ALI KHAN"
              className={inputCls('fullName')}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Passport number & Nationality */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <FileText className="h-3.5 w-3.5" /> Passport number *
              </label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                placeholder="e.g. A12345678"
                className={inputCls('passportNumber')}
              />
              {errors.passportNumber && <p className="text-xs text-red-500 mt-1">{errors.passportNumber}</p>}
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <Globe className="h-3.5 w-3.5" /> Nationality *
              </label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className={inputCls('nationality')}
              >
                <option value="">Select nationality</option>
                {NATIONALITIES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {errors.nationality && <p className="text-xs text-red-500 mt-1">{errors.nationality}</p>}
            </div>
          </div>

          {/* Date of birth & Expiry */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <Calendar className="h-3.5 w-3.5" /> Date of birth *
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={inputCls('dateOfBirth')}
              />
              {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                <Calendar className="h-3.5 w-3.5" /> Passport expiry date *
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={minExpiryDate}
                className={inputCls('expiryDate')}
              />
              {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
            </div>
          </div>

          {/* Passport uploads */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-bold text-gray-900 mb-1">Passport Document Upload</p>
            <p className="text-xs text-gray-500 mb-4">Upload a clear photo or scan of your passport's information page.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <PassportUploadBox
                label="Passport photo page *"
                file={passportFront}
                onFileChange={setPassportFront}
                onRemove={() => setPassportFront(null)}
                error={errors.passportFront}
              />
              <PassportUploadBox
                label="Additional page (optional)"
                file={passportBack}
                onFileChange={setPassportBack}
                onRemove={() => setPassportBack(null)}
              />
            </div>
          </div>
        </div>

        {/* Important notice */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-6">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Please ensure accuracy</p>
            <p className="text-xs text-gray-600 mt-0.5">
              Your passport details must match your travel documents exactly. Incorrect information may result in service delays.
            </p>
          </div>
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-70"
            style={{ background: BRAND_GRADIENT }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Continue to Confirmation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PassportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <PassportContent />
    </Suspense>
  );
}
