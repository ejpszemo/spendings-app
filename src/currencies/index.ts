export const currencies: Record<string, string> = {
  usd: "USD",
  eur: "EUR",
  gbp: "GBP",
  pln: "PLN",
};

export type Currency = keyof typeof currencies;

export const localeMap: Record<Currency, string> = {
  usd: "en-US",
  eur: "de-DE",
  gbp: "en-GB",
  pln: "pl-PL",
};
