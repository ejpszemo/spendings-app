import type { Translation } from "./en";

export const pl: Translation = {
  app: {
    title: "Aplikacja do Wydatków",
    removeUserConfirmation:
      "Czy na pewno chcesz usunąć tego użytkownika? \nWszystkie wydatki przypisane do tego użytkownika zostaną z nim usunięte.",
    clearSpendingsConfirmation:
      "Czy na pewno chcesz wyczyścić wszystkie dane lokalne? \nTa akcja nie może zostać cofnięta.",
    importDataConfirmation:
      "Czy na pewno chcesz zaimportować te dane? \nSpowoduje to nadpisanie wszystkich obecnych danych wydatków.",
    targetCurrency: "Waluta docelowa:",
    language: "Język:",
    clearData: "Wyczyść dane",
    exportData: "Eksportuj dane",
    importData: "Importuj dane",
    getToken: "Pobierz token",
    tokenCopied: "Skopiowano!",
    tokenSaved: "Zapisano!",
    theme: "Motyw",
    light: "Jasny",
    dark: "Ciemny",
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
    validSpendingAmount: "Wprowadź poprawną kwotę",
    lastRatesUpdate: (currency: string) =>
      `Ostatnia aktualizacja kursów ${currency}:`,
    expand: "Rozwiń",
    collapse: "Zwiń",
    search: "szukaj...",
    remove: "Czy na pewno chcesz usunąć ten wydatek?",
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
