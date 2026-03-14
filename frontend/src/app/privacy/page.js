"use client";

import LegalPageLayout from '../components/legal/LegalPageLayout';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" badge="Legal" lastUpdated="January 1, 2025">

      <div className="bg-[#EDF4F7] border border-[#00B1C5]/20 rounded-xl p-5 mb-10 text-sm text-gray-700 leading-relaxed">
        Your privacy matters to us. This policy explains how KSA Rides collects, uses, and protects your personal information when you use our services.
      </div>

      <Section title="1. Who We Are">
        <p>KSA Rides is the data controller responsible for your personal information. We are committed to processing your data lawfully, fairly, and transparently in accordance with applicable data protection regulations in the Kingdom of Saudi Arabia and any other relevant jurisdictions.</p>
      </Section>

      <Section title="2. Information We Collect">
        <p><strong>Information you provide:</strong> Name, email address, phone number, payment details, pickup/drop-off addresses, flight numbers, and any other information you submit when booking or contacting us.</p>
        <p><strong>Information collected automatically:</strong> IP address, browser type, device identifiers, pages visited, time spent, and referral sources when you use our website.</p>
        <p><strong>Location data:</strong> If you allow location access, we collect real-time GPS coordinates to improve pickup accuracy and route planning.</p>
        <p><strong>Communications:</strong> Records of your interactions with our customer support team, including chat transcripts and call recordings for quality purposes.</p>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use your personal data to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Process and manage your bookings</li>
          <li>Communicate booking confirmations, driver details, and ride updates</li>
          <li>Monitor flight status and notify you or your driver of changes</li>
          <li>Process payments and prevent fraud</li>
          <li>Provide customer support</li>
          <li>Improve our services and platform through analytics</li>
          <li>Send service-related communications and, with your consent, marketing messages</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>
      </Section>

      <Section title="4. Sharing Your Information">
        <p>We share your personal data with:</p>
        <p><strong>Partner drivers and operators:</strong> Your name, phone number, and pickup details are shared with the assigned chauffeur to complete your transfer.</p>
        <p><strong>Payment processors:</strong> Secure third-party payment gateways process your card details. We do not store full card numbers.</p>
        <p><strong>Technology providers:</strong> We use vetted third-party services for hosting, analytics, and communications.</p>
        <p><strong>Legal authorities:</strong> We disclose information when required by law or to protect the safety and rights of our users.</p>
        <p>We do not sell your personal data to third parties.</p>
      </Section>

      <Section title="5. Data Retention">
        <p>We retain your personal data for as long as necessary to provide our services and fulfil the purposes outlined in this policy. Booking records are retained for up to 7 years for accounting and legal compliance purposes. You may request deletion of your account and associated data by contacting us.</p>
      </Section>

      <Section title="6. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate or incomplete data</li>
          <li>Request deletion of your data ("right to be forgotten")</li>
          <li>Object to or restrict certain processing activities</li>
          <li>Withdraw consent for marketing communications at any time</li>
          <li>Receive your data in a portable format</li>
        </ul>
        <p>To exercise any of these rights, contact us at privacy@ksarides.com.</p>
      </Section>

      <Section title="7. Security">
        <p>We implement industry-standard security measures including TLS encryption, access controls, and regular security audits to protect your personal data from unauthorised access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.</p>
      </Section>

      <Section title="8. Cookies">
        <p>We use cookies and similar tracking technologies to enhance your experience on our website. Please review our <a href="/cookie-policy" className="text-[#00B1C5] hover:underline font-semibold">Cookie Policy</a> for full details on what we collect and how to manage your preferences.</p>
      </Section>

      <Section title="9. International Transfers">
        <p>Your data may be processed outside the Kingdom of Saudi Arabia where our service providers operate. We ensure appropriate safeguards are in place for all international transfers of personal data.</p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>We may update this Privacy Policy periodically. We will notify you of significant changes via email or website notice. Please review this page regularly for the latest version.</p>
      </Section>

      <Section title="11. Contact Us">
        <p>For privacy-related queries or to exercise your rights:</p>
        <p className="font-semibold text-gray-800">Email: privacy@ksarides.com<br />Phone: +966 11 000 0000<br />Address: KSA Rides Data Protection, Riyadh, Kingdom of Saudi Arabia</p>
      </Section>

    </LegalPageLayout>
  );
}
