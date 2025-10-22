import { useLanguage } from "../contexts/LanguageContext";

function GlobalActions() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="global-actions">
      <select
        name="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "pl")}
      >
        <option value="en">English</option>
        <option value="pl">Polski</option>
      </select>
      <select name="currency">
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
        <option value="gbp">GBP</option>
        <option value="pln">PLN</option>
      </select>
    </div>
  );
}

export default GlobalActions;
