"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "../../../lib/i18n";

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'AR' },
];

export default function LanguageSwitcher({ compact = false }) {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-colors text-sm font-medium"
      >
        <Globe className="h-4 w-4 flex-shrink-0" />
        <span>{compact ? current.short : current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => { changeLanguage(code); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                language === code
                  ? 'bg-[#008B7E] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}