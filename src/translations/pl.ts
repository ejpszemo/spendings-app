import type { Translation } from "./en";

export const pl: Translation = {
  app: {
    title: "Aplikacja do Wydatków",
    removeUserConfirmation: "Czy na pewno chcesz usunąć tego użytkownika? \nWszystkie wydatki przypisane do tego użytkownika zostaną z nim usunięte.",
    clearSpendingsConfirmation: "Czy na pewno chcesz wyczyścić wszystkie dane lokalne? \nTa akcja nie może zostać cofnięta.",
    targetCurrency: "Waluta docelowa:",
    language: "Język:",
    clearData: "Wyczyść dane:",
  },
  user: {
    userName: "imię...",
  },
  spending: {
    amount: "kwota...",
    description: "opis...",
    filterByUser: "Filtruj według użytkownika",
    filterByCurrency: "Filtruj według waluty",
    firstAddUser: "Najpierw dodaj użytkownika",
    nowAddSpending: "Teraz dodaj jakieś wydatki",
    validSpendingAmount: "Wprowadź poprawną kwotę i upewnij się, że użytkownik jest wybrany",
    lastRatesUpdate: (currency: string) => `Ostatnia aktualizacja kursów ${currency}:`,
    expand: "Rozwiń",
    collapse: "Zwiń",
  },
  summary: {
    user: "Użytkownik",
    claims: "Należności",
    count: "Liczba",
    unitSum: "Suma jedn.",
    sum: "Suma",
    division: "Podział",
  },
};

