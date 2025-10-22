import { useLocalStorage } from "./hooks/useLocalStorage";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import type { Spending, User } from "./types";
import type { Language } from "./translations";
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
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="app-container">
      <GlobalActions />
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
      />
      {/* <SpendingsChart /> */}
      <SpendingsList
        spendings={spendings}
        setSpendings={setSpendings}
        users={users}
        selectedUserId={selectedUserId}
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
  const [language, setLanguage] = useLocalStorage<Language>(
    "spendingsApp_language",
    "en"
  );

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <AppContent
        spendings={spendings}
        setSpendings={setSpendings}
        users={users}
        setUsers={setUsers}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
    </LanguageProvider>
  );
}

export default App;
