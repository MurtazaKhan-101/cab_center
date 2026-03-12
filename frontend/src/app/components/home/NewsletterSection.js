"use client";

import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-3xl mx-auto rounded-2xl p-8 sm:p-10 text-white text-center"
        style={{ background: 'linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)' }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Subscribe to our Newsletter
        </h2>
        <p className="text-white/80 text-sm mb-7">
          Get the latest updates and offers directly in your inbox.
        </p>

        {submitted ? (
          <p className="text-white font-semibold text-lg py-3">
            ✓ Thank you for subscribing!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-[#005F56] font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-white/50 text-xs mt-5 max-w-md mx-auto">
          By subscribing to the newsletter, you agree to our privacy policy.
          We will never sell or share your data with third parties.
        </p>
      </div>
    </section>
  );
}
