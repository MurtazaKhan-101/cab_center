"use client";

import LegalPageLayout from '../components/legal/LegalPageLayout';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const CookieTable = ({ rows }) => (
  <div className="overflow-x-auto mt-3">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-[#EDF4F7]">
          <th className="text-left p-3 border border-gray-200 font-bold text-gray-700">Cookie Name</th>
          <th className="text-left p-3 border border-gray-200 font-bold text-gray-700">Purpose</th>
          <th className="text-left p-3 border border-gray-200 font-bold text-gray-700">Duration</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="p-3 border border-gray-200 font-mono text-[#005F56]">{row[0]}</td>
            <td className="p-3 border border-gray-200 text-gray-600">{row[1]}</td>
            <td className="p-3 border border-gray-200 text-gray-500">{row[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" badge="Legal" lastUpdated="January 1, 2025">

      <div className="bg-[#EDF4F7] border border-[#00B1C5]/20 rounded-xl p-5 mb-10 text-sm text-gray-700 leading-relaxed">
        This Cookie Policy explains how KSA Rides uses cookies and similar technologies when you visit our website. It tells you what cookies are, why we use them, and how you can control them.
      </div>

      <Section title="1. What Are Cookies?">
        <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies cannot run programs or deliver viruses to your device.</p>
      </Section>

      <Section title="2. How We Use Cookies">
        <p>KSA Rides uses cookies to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Keep you signed in to your account across sessions</li>
          <li>Remember your language and currency preferences</li>
          <li>Understand how visitors use our website (analytics)</li>
          <li>Improve website performance and loading times</li>
          <li>Display relevant content and prevent repeated messages</li>
          <li>Support fraud prevention and security monitoring</li>
        </ul>
      </Section>

      <Section title="3. Types of Cookies We Use">
        <p><strong className="text-gray-800">Strictly Necessary Cookies</strong> — essential for the website to function. These cannot be disabled.</p>
        <CookieTable rows={[
          ['session_id', 'Maintains your login session', 'Session'],
          ['csrf_token', 'Prevents cross-site request forgery attacks', 'Session'],
          ['booking_cart', 'Preserves your booking details during checkout', '1 hour'],
        ]} />

        <p className="mt-6"><strong className="text-gray-800">Performance & Analytics Cookies</strong> — help us understand site usage.</p>
        <CookieTable rows={[
          ['_ga', 'Google Analytics — tracks visitor sessions', '2 years'],
          ['_gid', 'Google Analytics — distinguishes users', '24 hours'],
          ['_gat', 'Google Analytics — throttles request rate', '1 minute'],
        ]} />

        <p className="mt-6"><strong className="text-gray-800">Functional Cookies</strong> — remember your preferences.</p>
        <CookieTable rows={[
          ['language_pref', 'Stores selected language (EN/AR)', '1 year'],
          ['currency_pref', 'Stores selected display currency', '1 year'],
          ['cookie_consent', 'Records your cookie preferences', '1 year'],
        ]} />
      </Section>

      <Section title="4. Third-Party Cookies">
        <p>Some cookies are placed by third-party services that appear on our pages. These include:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Google Analytics</strong> — website traffic and behaviour analysis</li>
          <li><strong>Stripe / Payment processors</strong> — secure payment handling and fraud prevention</li>
          <li><strong>Intercom / Live chat</strong> — customer support widget</li>
        </ul>
        <p>These third parties have their own privacy policies and we have no control over how they use the data they collect.</p>
      </Section>

      <Section title="5. Managing Cookies">
        <p>You can control and manage cookies in several ways:</p>
        <p><strong>Browser settings:</strong> Most browsers allow you to refuse or delete cookies via their settings menu. Disabling strictly necessary cookies may affect the functionality of the KSA Rides website.</p>
        <p><strong>Our consent banner:</strong> When you first visit our site, you can choose which non-essential cookie categories to accept or reject via our cookie consent banner.</p>
        <p><strong>Opt-out tools:</strong> You can opt out of Google Analytics tracking by visiting <span className="text-[#00B1C5]">tools.google.com/dlpage/gaoptout</span>.</p>
      </Section>

      <Section title="6. Do Not Track">
        <p>Some browsers include a "Do Not Track" feature. KSA Rides currently does not respond to Do Not Track signals, but we respect your cookie preferences set through our consent banner.</p>
      </Section>

      <Section title="7. Updates to This Policy">
        <p>We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. We will notify you of significant changes by updating the "Last updated" date at the top of this page.</p>
      </Section>

      <Section title="8. Contact Us">
        <p>For questions about our use of cookies:</p>
        <p className="font-semibold text-gray-800">Email: privacy@ksarides.com<br />Phone: +966 11 000 0000</p>
      </Section>

    </LegalPageLayout>
  );
}
