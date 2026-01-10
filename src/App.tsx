import { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { syncData, getData } from "./hooks/useSyncApi";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import useCurrencyApi, { fetchCurrencyRates } from "./hooks/useCurrencyApi";
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
  dirty,
  setDirty,
  userToken,
  setUserToken,
  lastSyncAt,
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
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  lastSyncAt: Date | null;
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
        userToken={userToken}
        setUserToken={setUserToken}
        setDirty={setDirty}
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
        dirty={dirty}
        setDirty={setDirty}
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
        dirty={dirty}
        setDirty={setDirty}
        lastSyncAt={lastSyncAt}
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
  const [userToken, setUserToken] = useLocalStorage<string | null>(
    "spendingsApp_userToken",
    null
  );
  const [lastSyncAt, setLastSyncAt] = useLocalStorage<Date | null>(
    "spendingsApp_lastSyncAt",
    null
  );

  const [dirty, setDirty] = useState(false);

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

  // Set user token on first app load
  useEffect(() => {
    if (userToken) return;
    setUserToken(crypto.randomUUID());
  }, [userToken, setUserToken]);

  // Sync data when dirty
  useEffect(() => {
    if (!dirty || !userToken) return;
    if (users.length <= 0 || spendings.length <= 0) return;

    const timeout = setTimeout(() => {
      console.log("POST message triggered");
      syncData(userToken, users, spendings);
      setLastSyncAt(new Date());
      setDirty(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [dirty]);

  // GET data from backend
  useEffect(() => {
    if (!userToken) return;

    getData(userToken).then(({ users, spendings }) => {
      console.log("GET message triggered");
      setFetchedData(users, spendings);
    });
  }, [userToken]);

  const setFetchedData = async (users: User[], spendings: Spending[]) => {
    if (users) {
      setUsers(users);
      const selectedUserExists = selectedUserId
        ? users.some((user) => user.id === selectedUserId)
        : false;
      if (!selectedUserExists) {
        setSelectedUserId(users[0]?.id);
      }
    }

    // it is copy/paste of GlobalActions/handleImportData, should clean this up later
    if (spendings) {
      try {
        const uniqueCurrencies = Array.from(
          new Set(spendings.map((s: Spending) => s.currency))
        ) as Currency[];
        const missingCurrencies = uniqueCurrencies.filter(
          (curr) => !rates.find((rate) => rate.base === curr)
        );
        const newRates = await Promise.all(
          missingCurrencies.map((curr) => fetchCurrencyRates(curr))
        );
        const allRates = [...rates, ...newRates];
        const updatedSpendings = spendings.map((spending: Spending) => {
          try {
            if (spending.currency === currency) {
              return { ...spending, exchangedAmount: spending.amount };
            }

            const spendingRate = allRates.find(
              (r) => r.base === spending.currency
            );
            const exchangeRate = spendingRate?.exchangeRates[currency];

            if (!exchangeRate) {
              console.warn(
                `No exchange rate found for ${spending.currency} to ${currency}`
              );
              return { ...spending, exchangedAmount: 0 };
            }

            return {
              ...spending,
              exchangedAmount: spending.amount * exchangeRate,
            };
          } catch (error) {
            console.error(
              `Error calculating exchange for spending ${spending.id}:`,
              error
            );
            return { ...spending, exchangedAmount: 0 };
          }
        });

        if (newRates.length > 0) {
          setRates(allRates);
        }
        setSpendings(updatedSpendings);
      } catch (error) {
        console.error(
          "Failed to fetch exchange rates for fetched spendings:",
          error
        );
        setSpendings(spendings);
        alert(
          "Fetched data successfully, but some exchange rates may be unavailable. You can update them manually."
        );
      }
    }
  };

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
            dirty={dirty}
            setDirty={setDirty}
            userToken={userToken}
            setUserToken={setUserToken}
            lastSyncAt={lastSyncAt}
          />
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
