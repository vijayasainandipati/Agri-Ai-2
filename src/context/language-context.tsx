
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, type TranslationKey } from '@/lib/translations';

const isKnownLanguage = (lang: string): lang is keyof typeof translations => {
  return lang in translations;
};

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  translate: (key: TranslationKey, fallback?: string) => string;
};

// Create the context with a default value that is safe for SSR.
const LanguageContext = createContext<LanguageContextType>({
    language: 'English',
    setLanguage: () => {},
    translate: (key) => translations['English'][key] || key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguage] = useState('English');

  // This effect runs ONLY on the client, after the component has mounted.
  useEffect(() => {
    const storedLanguage = localStorage.getItem('agriai-language');
    if (storedLanguage && isKnownLanguage(storedLanguage)) {
      setLanguage(storedLanguage);
    }
    // Signal that the component is now mounted and client-side logic can run.
    setIsMounted(true);
  }, []);

  const handleSetLanguage = (newLanguage: string) => {
    if (isKnownLanguage(newLanguage)) {
      setLanguage(newLanguage);
      if (typeof window !== 'undefined') {
        localStorage.setItem('agriai-language', newLanguage);
      }
    }
  };
  
  const translate = (key: TranslationKey, fallback?: string): string => {
    // Before mounting, ALWAYS use the default English translation to match the server.
    // This prevents the hydration mismatch.
    if (!isMounted) {
        return translations['English'][key] || fallback || key;
    }
    
    // After mounting, use the stateful language preference.
    const langKey = isKnownLanguage(language) ? language : 'English';
    return translations[langKey]?.[key] || translations['English'][key] || fallback || key;
  };
  
  const value = {
    language,
    setLanguage: handleSetLanguage,
    translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
