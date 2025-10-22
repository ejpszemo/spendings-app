import { en } from "./en";
import { pl } from "./pl";

export const translations = {
  en,
  pl,
};

export type Language = keyof typeof translations;

export const localeMap: Record<Language, string> = {
  en: "en-US",
  pl: "pl-PL",
};

