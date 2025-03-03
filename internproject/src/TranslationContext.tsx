import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import translationsEn from './assets/en.json';
import translationsJa from './assets/ja.json';
import { Language } from './assets/model/model';

type TranslationContextType = {
  language: Language;
  translations: any;
  toggleLanguage: () => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<any>(translationsEn);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
      setTranslations(storedLanguage === "ja" ? translationsJa : translationsEn);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage: Language = language === "en" ? "ja" : "en";
    setLanguage(newLanguage);
    setTranslations(newLanguage === "ja" ? translationsJa : translationsEn);

    localStorage.setItem("language", newLanguage);
  };

  return (
    <TranslationContext.Provider value={{ language, translations, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
