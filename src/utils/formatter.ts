export const formatDate = (
  date: Date,
  locale: string = "en-US",
  dateStyle: "full" | "long" | "medium" | "short" = "medium",
  showTime: boolean = false,
  timeStyle: "full" | "long" | "medium" | "short" = "medium"
): string => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: dateStyle,
    timeStyle: showTime ? timeStyle : undefined,
  }).format(date);
};

export const formatCurrency = (
  amount: number,
  code: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(amount);
};

export function timeAgo(timestamp: Date | string): string {
  if (timestamp === null) return "never";

  const now = new Date();
  const past = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const diffMs = now.getTime() - past.getTime();

  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}
