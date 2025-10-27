import { useLocalStorage } from "./hooks/useLocalStorage";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import type { Rates, Spending, User } from "./types";
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
}) {
  const { t } = useLanguage();

  return (
    <div className="app-container">
      <GlobalActions
        spendings={spendings}
        setSpendings={setSpendings}
        rates={rates}
      />
      <h1>{t.app.title}</h1>
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
      {/* <SpendingsChart /> */}
      <SpendingsList
        spendings={spendings}
        setSpendings={setSpendings}
        users={users}
        selectedUserId={selectedUserId}
        selectedSpendingCurrency={selectedSpendingCurrency}
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
  const [language, setLanguage] = useLocalStorage<Language>(
    "spendingsApp_language",
    "en"
  );
  const [currency, setCurrency] = useLocalStorage<Currency>(
    "spendingsApp_currency",
    "usd"
  );
  const [rates, setRates] = useLocalStorage<Rates[]>("spendingsApp_rates", []);

  return (
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
        />
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
