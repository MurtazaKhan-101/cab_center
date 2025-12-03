'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Import translations
const enTranslations = require('../locales/en.json');
const arTranslations = require('../locales/ar.json');

const translations = {
  en: enTranslations,
  ar: arTranslations
};

// Create the context
const LanguageContext = createContext();

// Helper function to get nested translation values
const getNestedTranslation = (obj, path) => {
  return path.split('.').reduce((current, key) => current && current[key], obj);
};

// Language provider component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar'); // Default to Arabic
  const [currentTranslations, setCurrentTranslations] = useState(translations.ar);

  useEffect(() => {
    // Load language from localStorage on component mount
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(savedLanguage);
    setCurrentTranslations(translations[savedLanguage]);
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      setCurrentTranslations(translations[lang]);
      localStorage.setItem('language', lang);
      
      // Update document direction and language
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const t = (key, variables = {}) => {
    let translation = getNestedTranslation(currentTranslations, key);
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key; // Return the key if translation is not found
    }

    // Replace variables in the translation
    if (variables && typeof translation === 'string') {
      Object.keys(variables).forEach(variable => {
        const regex = new RegExp(`{${variable}}`, 'g');
        translation = translation.replace(regex, variables[variable]);
      });
    }

    return translation;
  };

  const isRTL = () => language === 'ar';

  const value = {
    language,
    changeLanguage,
    t,
    isRTL,
    translations: currentTranslations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Export default language
export const defaultLanguage = 'ar';
export const supportedLanguages = ['en', 'ar'];

// Helper hook for translation
export function useTranslation() {
  const { t, language, isRTL } = useLanguage();
  return { t, language, isRTL };
}