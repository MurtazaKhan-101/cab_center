"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, Clock, Users, Car, Download, Home, Loader2 } from 'lucide-react';
import { getBookingPublic } from '../../lib/booking';
import { API_BASE_URL, API_ENDPOINTS } from '../../lib/constants';

const BRAND_GRADIENT = 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)';

const VEHICLE_NAMES = {
  economy: 'Economy', standard: 'Standard', first_class: 'First Class',
  standard_van: 'Standard Van', first_class_van: 'First Class Van', minibus: 'Minibus 12 Pax',
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  // Fallback values from URL params (in case the API call takes a moment)
  const urlFrom       = searchParams.get('from')       || '';
  const urlTo         = searchParams.get('to')         || '';
  const urlDate       = searchParams.get('date')       || '';
  const urlTime       = searchParams.get('time')       || '';
  const urlPassengers = searchParams.get('passengers') || '1';
  const urlVehicle    = searchParams.get('vehicle')    || '';
  const urlFare       = searchParams.get('fare')       || '';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(!!bookingId);

  useEffect(() => {
    if (!bookingId) return;

    async function fetchBooking() {
      try {
        const res = await getBookingPublic(bookingId);
        if (res.success && res.booking) {
          setBooking(res.booking);
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  const from       = booking?.pickup       || urlFrom;
  const to         = booking?.drop         || urlTo;
  const date       = booking?.date         || urlDate;
  const time       = booking?.time         || urlTime;
  const passengers = booking?.no_of_passengers || urlPassengers;
  const vehicleType = booking?.vehicle_type || urlVehicle;
  const totalFare  = booking?.total_fare   ?? (urlFare ? parseFloat(urlFare) : 0);
  const bookingRef = booking?._id
    ? `KSA-${booking._id.slice(-6).toUpperCase()}`
    : 'KSA-...';

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#00B1C5] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: BRAND_GRADIENT }}>
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm">Your transfer has been booked successfully. A confirmation email has been sent.</p>
        </div>

        {/* Booking card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Booking reference</p>
              <p className="text-lg font-bold text-[#005F56]">{bookingRef}</p>
            </div>
            <div className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: BRAND_GRADIENT }}>
              Confirmed
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Route */}
            <div className="flex items-start gap-3">
              <div className="mt-1 flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#005F56]" />
                <div className="w-0.5 h-10 bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-[#00B1C5]" />
              </div>
              <div className="flex-1 space-y-4">
                <div><p className="font-semibold text-gray-900">{from}</p><p className="text-xs text-gray-500">Pickup</p></div>
                <div><p className="font-semibold text-gray-900">{to}</p><p className="text-xs text-gray-500">Drop-off</p></div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-2" />

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#00B1C5]" />
                <div><p className="text-xs text-gray-500">Date</p><p className="text-sm font-semibold text-gray-900">{formattedDate}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#00B1C5]" />
                <div><p className="text-xs text-gray-500">Pickup time</p><p className="text-sm font-semibold text-gray-900">{time || '—'}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#00B1C5]" />
                <div><p className="text-xs text-gray-500">Passengers</p><p className="text-sm font-semibold text-gray-900">{passengers}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-[#00B1C5]" />
                <div><p className="text-xs text-gray-500">Vehicle</p><p className="text-sm font-semibold text-gray-900">{VEHICLE_NAMES[vehicleType] || vehicleType || '—'}</p></div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-xl font-bold text-gray-900">SAR {totalFare.toFixed(2)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90" style={{ background: BRAND_GRADIENT }}>
            <Home className="h-4 w-4" /> Back to Home
          </a>
          {bookingId && (
            <a
              href={`${API_BASE_URL}${API_ENDPOINTS.BOOKING_RECEIPT(bookingId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[#005F56] text-[#005F56] text-sm font-bold hover:bg-[#005F56]/5 transition-colors"
            >
              <Download className="h-4 w-4" /> Download Receipt
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#00B1C5] border-t-transparent animate-spin" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
