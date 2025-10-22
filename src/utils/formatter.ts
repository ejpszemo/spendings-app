export const formatDate = (date: Date, locale: string = "en-US"): string => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(date);
};

export const formatCurrency = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
}).format;
