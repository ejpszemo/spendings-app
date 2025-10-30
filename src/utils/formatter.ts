export const formatDate = (date: Date, locale: string = "en-US", dateStyle: "full" | "long" | "medium" | "short" = "medium", showTime: boolean = false, timeStyle: "full" | "long" | "medium" | "short" = "medium"): string => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: dateStyle,
    timeStyle: showTime ? timeStyle : undefined,
  }).format(date);
};

export const formatCurrency = (amount: number, code: string = "USD", locale: string = "en-US"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(amount);
};
