import { createContext, useContext } from "react";
import { localeMap, currencies } from "../currencies";
import type { ReactNode } from "react";
import type { Currency } from "../currencies";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencyCode: string;
  currencyLocale: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({
  children,
  currency,
  setCurrency,
}: {
  children: ReactNode;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}) {
  const currencyCode = currencies[currency];
  const currencyLocale = localeMap[currency];

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, currencyCode, currencyLocale }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
