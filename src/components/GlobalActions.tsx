import { useLanguage } from "../contexts/LanguageContext";
import { useCurrency } from "../contexts/CurrencyContext";
import type { Language } from "../translations";
import type { Currency } from "../currencies";

function GlobalActions() {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="global-actions">
      <select
        name="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
      >
        <option value="en">English</option>
        <option value="pl">Polski</option>
      </select>
      <select
        name="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
      >
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
        <option value="gbp">GBP</option>
        <option value="pln">PLN</option>
      </select>
    </div>
  );
}

export default GlobalActions;
