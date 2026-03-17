"use client";

import { Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, Clock, Users, Car, Download, Home } from 'lucide-react';
import { jsPDF } from 'jspdf';

const BRAND_GRADIENT = 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)';
const BRAND_DARK  = [0, 95, 86];   // #005F56
const BRAND_LIGHT = [0, 177, 197]; // #00B1C5

const VEHICLES = [
  { id: 'economy',         name: 'Economy',         passengers: 3, luggage: 3, image: '/images/Standard Class Taxi.svg',       basePrice: 65.55,  discountPrice: null },
  { id: 'standard',        name: 'Standard',        passengers: 3, luggage: 3, image: '/images/First Class Transfer.svg',      basePrice: 96.13,  discountPrice: 87.39 },
  { id: 'first-class',     name: 'First Class',     passengers: 3, luggage: 3, image: '/images/SUV Limo Class.svg',            basePrice: 157.31, discountPrice: null },
  { id: 'standard-van',    name: 'Standard Van',    passengers: 7, luggage: 7, image: '/images/Standard Van Transfer.svg',     basePrice: 102.82, discountPrice: 93.47 },
  { id: 'first-class-van', name: 'First Class Van', passengers: 6, luggage: 6, image: '/images/First Class Van Transfer.svg',  basePrice: 157.68, discountPrice: null },
  { id: 'minibus',         name: 'Minibus 12 Pax',  passengers: 12, luggage: 12, image: '/images/Minibus 12 Pax.svg',          basePrice: 220.00, discountPrice: null },
];

function generateReceiptPDF({ bookingRef, from, to, date, time, passengers, vehicleName, price }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // ── Header bar ──
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, pageW, 38, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('KSA RIDES', pageW / 2, 16, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Booking Receipt', pageW / 2, 26, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`Ref: ${bookingRef}`, pageW / 2, 33, { align: 'center' });

  y = 50;

  // ── Helper: section title ──
  const sectionTitle = (title) => {
    doc.setFillColor(...BRAND_LIGHT);
    doc.rect(margin, y, pageW - margin * 2, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 3, y + 5.8);
    y += 13;
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  // ── Helper: key-value row ──
  const row = (label, value) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), margin + 45, y);
    y += 7;
  };

  // ── Trip Details ──
  sectionTitle('Trip Details');
  row('Pickup', from);
  row('Drop-off', to);
  row('Date', date);
  row('Time', time || '—');
  row('Passengers', passengers);
  y += 4;

  // ── Vehicle ──
  sectionTitle('Vehicle');
  row('Type', vehicleName);
  y += 4;

  // ── Fare ──
  sectionTitle('Fare Summary');
  row('Subtotal', `SAR ${price.toFixed(2)}`);
  row('VAT & Taxes', 'Included');
  y += 3;
  doc.setDrawColor(...BRAND_DARK);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 7;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_DARK);
  doc.text('Total', margin, y);
  doc.text(`SAR ${price.toFixed(2)}`, pageW - margin, y, { align: 'right' });
  y += 12;

  // ── Footer ──
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing KSA Rides!', pageW / 2, y, { align: 'center' });
  y += 5;
  doc.text('For any queries, please contact our support team.', pageW / 2, y, { align: 'center' });

  // ── Bottom brand strip ──
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, doc.internal.pageSize.getHeight() - 10, pageW, 10, 'F');

  doc.save(`KSA-Rides-Receipt-${bookingRef}.pdf`);
}

function ConfirmationContent() {
  const searchParams = useSearchParams();

  const from       = searchParams.get('from')       || 'Origin';
  const to         = searchParams.get('to')         || 'Destination';
  const date       = searchParams.get('date')       || '';
  const time       = searchParams.get('time')       || '';
  const passengers = searchParams.get('passengers') || '1';
  const vehicleId  = searchParams.get('vehicle')    || 'economy';

  const vehicle = VEHICLES.find(v => v.id === vehicleId);
  const price = vehicle ? (vehicle.discountPrice ?? vehicle.basePrice) : 0;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const bookingRefRef = useRef(`KSA-${Date.now().toString(36).toUpperCase().slice(-6)}`);
  const bookingRef = bookingRefRef.current;

  const handleDownloadReceipt = () => {
    generateReceiptPDF({
      bookingRef,
      from,
      to,
      date: formattedDate,
      time: time || '—',
      passengers,
      vehicleName: vehicle?.name ?? '—',
      price,
    });
  };

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
                <div>
                  <p className="font-semibold text-gray-900">{from}</p>
                  <p className="text-xs text-gray-500">Pickup</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{to}</p>
                  <p className="text-xs text-gray-500">Drop-off</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-2" />

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#00B1C5]" />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#00B1C5]" />
                <div>
                  <p className="text-xs text-gray-500">Pickup time</p>
                  <p className="text-sm font-semibold text-gray-900">{time || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#00B1C5]" />
                <div>
                  <p className="text-xs text-gray-500">Passengers</p>
                  <p className="text-sm font-semibold text-gray-900">{passengers}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-[#00B1C5]" />
                <div>
                  <p className="text-xs text-gray-500">Vehicle</p>
                  <p className="text-sm font-semibold text-gray-900">{vehicle?.name ?? '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total paid</span>
            <span className="text-xl font-bold text-gray-900">SAR {price.toFixed(2)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
            style={{ background: BRAND_GRADIENT }}
          >
            <Home className="h-4 w-4" />
            Back to Home
          </a>
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[#005F56] text-[#005F56] text-sm font-bold hover:bg-[#005F56]/5 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </button>
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
