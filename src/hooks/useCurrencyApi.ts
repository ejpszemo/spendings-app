import type { Rates } from "../types";
import type { Currency } from "../currencies";
import { currencies } from "../currencies";

async function convertCurrency(from: string) {
  const res = await fetch(
    `https://vercel-currency-api-for-spendings-a.vercel.app/api/convert?from=${from}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch exchange rates: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

const destructure = (data: any) => {
  const { rates } = data;

  return Object.fromEntries(
    Object.entries(currencies).map(([key, value]) => [key, rates[value]])
  ) as Record<Currency, number>;
};

// Export a function that fetches and returns rates without setting state
export async function fetchCurrencyRates(from: Currency): Promise<Rates> {
  const data = await convertCurrency(from);
  const ratesToSave = destructure(data);
  return {
    base: from,
    exchangeRates: ratesToSave,
    fetchedAt: new Date(),
  };
}

// Keep the original function for backward compatibility
export default async function useCurrencyApi(
  from: string,
  rates: Rates[],
  setRates: (rates: Rates[]) => void
): Promise<void> {
  try {
    const data = await convertCurrency(from);
    const ratesToSave = destructure(data);
    const filtered = rates.filter((rate: Rates) => rate.base !== from);
    setRates([
      ...filtered,
      { base: from, exchangeRates: ratesToSave, fetchedAt: new Date() },
    ]);
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error;
  }
}
