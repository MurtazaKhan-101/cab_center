"use client";

import { useLanguage } from "../../../lib/i18n";

export default function LanguageSwitcher({ compact = false }) {
  const { language, changeLanguage } = useLanguage();

  if (compact) {
    // Compact version for mobile header
    return (
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 border border-white/20">
        <button
          onClick={() => changeLanguage('ar')}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
            language === 'ar'
              ? 'bg-[#00188F] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          عربي
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
            language === 'en'
              ? 'bg-[#00188F] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  // Regular version for desktop and non-compact usage
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          language === 'ar'
            ? 'bg-[#00188F] text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        عربي
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          language === 'en'
            ? 'bg-[#00188F] text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}