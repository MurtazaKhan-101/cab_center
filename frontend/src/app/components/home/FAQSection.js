"use client";

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';

export default function FAQSection() {
  const { t, isInitialized } = useTranslation();
  const [openItem, setOpenItem] = useState(null);

  // Prevent content flash during initialization
  if (!isInitialized) {
    return <section className="bg-ui-cards-gradient py-20" />; // Loading state
  }

  // Prevent content flash during initialization
  if (!isInitialized) {
    return <section className="bg-ui-cards-gradient py-20" />; // Loading state
  }

  const faqs = [
    {
      id: 1,
      question: t('faq.how_to_book_question'),
      answer: t('faq.how_to_book_answer')
    },
    {
      id: 2,
      question: t('faq.drivers_verified_question'),
      answer: t('faq.drivers_verified_answer')
    },
    {
      id: 3,
      question: t('faq.pricing_question'),
      answer: t('faq.pricing_answer')
    }
  ];

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-ui-cards-gradient overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            {t('faq.top_questions')}
          </h2>
        </div>

        {/* FAQ Items - Rounded Cards */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between group"
              >
                <h3 className="text-lg md:text-xl font-medium text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    {openItem === faq.id ? (
                      <Minus className="h-4 w-4 text-white" />
                    ) : (
                      <Plus className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </button>
              
              {openItem === faq.id && (
                <div className="px-8 pb-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-white/90 leading-relaxed text-base md:text-lg">
                      {faq.answer}
                    </p>
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