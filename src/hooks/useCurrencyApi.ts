import type { Rates } from "../types";

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

export default async function useCurrencyApi(
  from: string,
  rates: Rates[],
  setRates: (rates: Rates[]) => void
): Promise<void> {
  try {
    const data = await convertCurrency(from);
    const ratesToSave = destructure(data);
    const filtered = rates.filter((rate: Rates) => rate.base !== from);
    setRates([...filtered, { base: from, exchangeRates: ratesToSave }]);
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error;
  }
}

const destructure = (data: any) => {
  const { rates } = data;
  const { USD, EUR, GBP, PLN } = rates;
  return {
    usd: USD,
    eur: EUR,
    gbp: GBP,
    pln: PLN,
  };
};
