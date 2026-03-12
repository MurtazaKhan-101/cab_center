"use client";

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'How do I book an airport transfer?',
    answer:
      'Simply enter your pickup airport and drop-off address in the search widget, choose your date, time and number of passengers, then click "See prices". Select your preferred vehicle class, fill in passenger details and flight number, and complete payment. You\'ll receive an instant confirmation with a voucher PDF by email.',
  },
  {
    id: 2,
    question: 'What happens if my flight is delayed?',
    answer:
      'We monitor your flight in real time. If a delay is detected, your driver is automatically notified and their dispatch time is adjusted to match your actual landing time. You will also receive an SMS and email update. There is no extra charge for flight delays.',
  },
  {
    id: 3,
    question: 'What vehicle categories are available?',
    answer:
      'We offer Standard Class (up to 3 pax), First Class Sedan (up to 3 pax), SUV (up to 6 pax), Van Standard (up to 7 pax), Van First Class (up to 6 pax), and Minibus for up to 12 passengers. All vehicles are licensed and maintained to the highest standards.',
  },
  {
    id: 4,
    question: 'Are the prices fixed? Are there any hidden fees?',
    answer:
      'Yes, all prices are fixed and shown in full before you pay. There are no hidden fees, no surge pricing, and no extra charges for traffic or waiting time within the included free waiting window. The price you see is the price you pay.',
  },
  {
    id: 5,
    question: "When will I receive my driver's details?",
    answer:
      'Driver details — including name, phone number, vehicle make, model, and plate — are sent to you by email and SMS 6 hours before your scheduled pickup time. Your driver will be waiting with a name board at the arrival hall.',
  },
  {
    id: 6,
    question: 'What is the cancellation policy?',
    answer:
      'Free cancellation is available up to 24 hours before pickup. Cancellations made within 24 hours may incur a partial charge depending on how close to the pickup time they are made. No-shows (driver waited the full free waiting period with no contact) are non-refundable.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <section id="faq" className="py-12 lg:py-20 bg-[#EDF4F7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#005F56]">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Everything you need to know about KSA Rides
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map(({ id, question, answer }) => (
            <div
              key={id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggle(id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
              >
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-snug">
                  {question}
                </h3>
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-colors"
                  style={
                    openId === id
                      ? { background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }
                      : { background: '#EDF4F7' }
                  }
                >
                  {openId === id
                    ? <Minus className="h-4 w-4 text-white" />
                    : <Plus className="h-4 w-4 text-[#005F56]" />
                  }
                </div>
              </button>

              {openId === id && (
                <div className="px-6 pb-5">
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
