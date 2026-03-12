"use client";

import LegalPageLayout from '../components/legal/LegalPageLayout';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" badge="Legal" lastUpdated="January 1, 2025">

      <div className="bg-[#EDF4F7] border border-[#00B1C5]/20 rounded-xl p-5 mb-10 text-sm text-gray-700 leading-relaxed">
        Please read these Terms &amp; Conditions carefully before using KSA Rides services. By booking a transfer or using our platform, you agree to be bound by these terms.
      </div>

      <Section title="1. About KSA Rides">
        <p>KSA Rides ("Company", "we", "us", or "our") is a private ground transportation marketplace connecting passengers with professional chauffeurs for airport transfers, city rides, and hourly chauffeur services. Our registered office is located in the Kingdom of Saudi Arabia.</p>
        <p>These Terms govern your use of the KSA Rides website at ksarides.com and any related services we provide.</p>
      </Section>

      <Section title="2. Booking & Confirmation">
        <p>All bookings are subject to availability and confirmation. A booking is only confirmed once you receive a written confirmation email from KSA Rides.</p>
        <p>You are responsible for providing accurate passenger details, flight information, pickup address, and contact information. KSA Rides is not liable for service failures resulting from incorrect information provided at the time of booking.</p>
        <p>We reserve the right to decline bookings at our discretion without providing a reason.</p>
      </Section>

      <Section title="3. Pricing & Payment">
        <p>All prices displayed are fixed and inclusive of applicable taxes unless stated otherwise. No surge pricing or meter-based charges apply. The price you see at booking is the price you pay.</p>
        <p>Payment is required in full at the time of booking or upon completion of the ride, depending on the payment method selected. We accept major credit cards, debit cards, and corporate invoicing.</p>
        <p>For airport transfers, waiting time beyond the complimentary grace period (60 minutes for international flights, 30 minutes for domestic) may incur additional charges.</p>
      </Section>

      <Section title="4. Cancellations & Refunds">
        <p><strong>Free cancellation:</strong> Cancellations made more than 24 hours before the scheduled pickup receive a full refund.</p>
        <p><strong>Late cancellations:</strong> Cancellations within 24 hours of pickup are subject to a cancellation fee of up to 50% of the booking value.</p>
        <p><strong>No-shows:</strong> If the passenger fails to present at the pickup point within the grace period without prior notice, the full booking amount is charged.</p>
        <p>Refunds, where applicable, are processed within 5–10 business days to the original payment method.</p>
      </Section>

      <Section title="5. Flight Monitoring & Delays">
        <p>KSA Rides monitors flight status for all airport transfer bookings. In the event of a flight delay, we will automatically adjust the pickup time at no additional cost to the passenger, provided the flight number was supplied at booking.</p>
        <p>KSA Rides is not responsible for delays caused by third-party airlines, immigration, customs, or acts beyond our control.</p>
      </Section>

      <Section title="6. Passenger Conduct">
        <p>Passengers must not behave in a manner that is threatening, abusive, or disruptive to drivers or other passengers. KSA Rides reserves the right to cancel a ride in progress and charge the full fare in cases of misconduct.</p>
        <p>Smoking, alcohol consumption, and carrying illegal substances in vehicles are strictly prohibited. The customer will be liable for any damage to the vehicle caused by misconduct.</p>
      </Section>

      <Section title="7. Liability">
        <p>KSA Rides acts as an intermediary between passengers and transport service providers. We take reasonable steps to vet all partner drivers and vehicles; however, we cannot guarantee the absolute safety of any journey.</p>
        <p>Our liability for any single incident is limited to the value of the booking in question. We are not liable for indirect, consequential, or incidental damages including missed flights, meetings, or events.</p>
      </Section>

      <Section title="8. Intellectual Property">
        <p>All content on the KSA Rides platform, including text, graphics, logos, and software, is the property of KSA Rides and protected by applicable intellectual property laws. You may not reproduce or distribute any content without prior written permission.</p>
      </Section>

      <Section title="9. Governing Law">
        <p>These Terms are governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia. Any disputes arising shall be subject to the exclusive jurisdiction of the Saudi Arabian courts.</p>
      </Section>

      <Section title="10. Changes to These Terms">
        <p>KSA Rides may update these Terms at any time. We will notify users of material changes via email or a prominent notice on our website. Continued use of our services following any change constitutes acceptance of the new Terms.</p>
      </Section>

      <Section title="11. Contact Us">
        <p>For questions regarding these Terms, please contact our legal team:</p>
        <p className="font-semibold text-gray-800">Email: legal@ksarides.com<br />Phone: +966 11 000 0000<br />Address: KSA Rides, Riyadh, Kingdom of Saudi Arabia</p>
      </Section>

    </LegalPageLayout>
  );
}
