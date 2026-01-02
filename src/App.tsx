import { useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import useCurrencyApi from "./hooks/useCurrencyApi";
import type { Rates, Spending, User } from "./types";
import type { Theme } from "./themes";
import type { Language } from "./translations";
import type { Currency } from "./currencies";
import UserSelector from "./components/UserSelector";
import SpendingsInput from "./components/SpendingsInput";
// import SpendingsChart from "./components/SpendingsChart";
import SpendingsList from "./components/SpendingsList";
import SummaryTable from "./components/SummaryTable";
import GlobalActions from "./components/GlobalActions";
import "./App.css";

function AppContent({
  spendings,
  setSpendings,
  users,
  setUsers,
  selectedUserId,
  setSelectedUserId,
  selectedSpendingCurrency,
  setSelectedSpendingCurrency,
  rates,
  setRates,
  expanded,
  setExpanded,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  selectedSpendingCurrency: Currency;
  setSelectedSpendingCurrency: (currency: Currency) => void;
  rates: Rates[];
  setRates: (rates: Rates[]) => void;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { t } = useLanguage();
  const noData = users.length <= 0;

  return (
    <div className="app-container">
      <GlobalActions
        spendings={spendings}
        setSpendings={setSpendings}
        users={users}
        setUsers={setUsers}
        rates={rates}
        setRates={setRates}
        setSelectedUserId={setSelectedUserId}
      />
      {noData && (
        <div className="app-title-container">
          <h1>{t.app.title}</h1>
        </div>
      )}
      <UserSelector
        spendings={spendings}
        setSpendings={setSpendings}
        users={users}
        setUsers={setUsers}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
      <SpendingsInput
        spendings={spendings}
        setSpendings={setSpendings}
        selectedUserId={selectedUserId}
        selectedSpendingCurrency={selectedSpendingCurrency}
        setSelectedSpendingCurrency={setSelectedSpendingCurrency}
        rates={rates}
        setRates={setRates}
      />
      <SpendingsList
        spendings={spendings}
        setSpendings={setSpendings}
        users={users}
        selectedUserId={selectedUserId}
        selectedSpendingCurrency={selectedSpendingCurrency}
        rates={rates}
        expanded={expanded}
        setExpanded={setExpanded}
      />
      <SummaryTable spendings={spendings} users={users} />
    </div>
  );
}

function App() {
  const [spendings, setSpendings] = useLocalStorage<Spending[]>(
    "spendingsApp_spendings",
    []
  );
  const [users, setUsers] = useLocalStorage<User[]>("spendingsApp_users", []);
  const [selectedUserId, setSelectedUserId] = useLocalStorage<string | null>(
    "spendingsApp_selectedUserId",
    null
  );
  const [selectedSpendingCurrency, setSelectedSpendingCurrency] =
    useLocalStorage<Currency>("spendingsApp_selectedCurrency", "usd");
  const [theme, setTheme] = useLocalStorage<Theme>(
    "spendingsApp_theme",
    "dark"
  );
  const [language, setLanguage] = useLocalStorage<Language>(
    "spendingsApp_language",
    "en"
  );
  const [currency, setCurrency] = useLocalStorage<Currency>(
    "spendingsApp_currency",
    "usd"
  );
  const [rates, setRates] = useLocalStorage<Rates[]>("spendingsApp_rates", []);
  const [expanded, setExpanded] = useLocalStorage<boolean>(
    "spendingsApp_listExpanded",
    true
  );

  // Fetch initial exchange rates on first app load
  useEffect(() => {
    const fetchInitialRates = async () => {
      // Only fetch if rates are empty (first time loading the app)
      if (rates.length > 0) return;

      // const currencies: Currency[] = ["usd", "eur", "gbp", "pln"];
      const defaultCurrency = "usd" as Currency;

      try {
        // Fetch rates for all currencies
        await useCurrencyApi(defaultCurrency, rates, setRates);
      } catch (error) {
        console.error("Failed to fetch initial exchange rate for USD:", error);
      }
    };

    fetchInitialRates();
  }, []);

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <LanguageProvider language={language} setLanguage={setLanguage}>
        <CurrencyProvider currency={currency} setCurrency={setCurrency}>
          <AppContent
            spendings={spendings}
            setSpendings={setSpendings}
            users={users}
            setUsers={setUsers}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            selectedSpendingCurrency={selectedSpendingCurrency}
            setSelectedSpendingCurrency={setSelectedSpendingCurrency}
            rates={rates}
            setRates={setRates}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
