import type { Currency } from "../currencies";

export interface Spending {
  id: string;
  amount: number;
  description: string;
  date: string;
  currency: Currency;
  exchangedAmount: number;
  userId: string;
}

export interface User {
  id: string;
  name: string;
}

export interface Rates {
  base: Currency;
  exchangeRates: Record<Currency, number>;
}
