export const en = {
  app: {
    title: "Spendings App",
    removeUserConfirmation: "Are you sure you want to remove this user? \nAll spendings assigned to this user will be removed as well.",
    clearSpendingsConfirmation: "Are you sure you want to clear all local data? \nThis action cannot be undone.",
    importDataConfirmation: "Are you sure you want to import this data? \nThis will overwrite all current spendings data.",
    targetCurrency: "Target currency:",
    language: "Language:",
    clearData: "Clear data",
    exportData: "Export data",
    importData: "Import data",
  },
  user: {
    userName: "user name...",
  },
  spending: {
    amount: "amount...",
    description: "description...",
    filterByUser: "Filter by user",
    filterByCurrency: "Filter by currency",
    firstAddUser: "First, add a user",
    nowAddSpending: "Now add some spendings",
    validSpendingAmount: "Enter a valid spending amount and make sure user is selected",
    lastRatesUpdate: (currency: string) => `Last ${currency} rates update:`,
    expand: "Expand",
    collapse: "Collapse",
  },
  summary: {
    user: "User",
    claims: "Claims",
    count: "Count",
    unitSum: "Unit Sum",
    sum: "Sum",
    division: "Division",
  },
};

export type Translation = typeof en;

