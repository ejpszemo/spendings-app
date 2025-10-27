export const formatDate = (date: Date, locale: string = "en-US"): string => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(date);
};

export const formatCurrency = (amount: number, code: string = "USD", locale: string = "en-US"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(amount);
};
