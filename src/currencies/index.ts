export const currencies: Record<string, string> = {
  usd: "USD", // US Dollar
  eur: "EUR", // Euro
  gbp: "GBP", // British Pound
  pln: "PLN", // Polski Złoty
  czk: "CZK", // Czech Koruna
  chf: "CHF", // Swiss Franc
  jpy: "JPY", // Japanese Yen
  cad: "CAD", // Canadian Dollar
  aud: "AUD", // Australian Dollar
  nzd: "NZD", // New Zealand Dollar
  sek: "SEK", // Swedish Krona
  nok: "NOK", // Norwegian Krone
};

export type Currency = keyof typeof currencies;

export const localeMap: Record<Currency, string> = {
  usd: "en-US",
  eur: "de-DE",
  gbp: "en-GB",
  pln: "pl-PL",
  czk: "cs-CZ",
  chf: "de-CH",
  jpy: "ja-JP",
  cad: "en-CA",
  aud: "en-AU",
  nzd: "en-NZ",
  sek: "sv-SE",
  nok: "nb-NO",
};
