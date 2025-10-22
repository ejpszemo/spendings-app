import { createContext, useContext } from "react";
import { translations, localeMap } from "../translations";
import type { ReactNode } from "react";
import type { Language } from "../translations";
import type { Translation } from "../translations/en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
  locale: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  language,
  setLanguage,
}: {
  children: ReactNode;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const t = translations[language];
  const locale = localeMap[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, locale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
