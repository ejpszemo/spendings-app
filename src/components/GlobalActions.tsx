import { useLanguage } from "../contexts/LanguageContext";
import { useCurrency } from "../contexts/CurrencyContext";
import type { Language } from "../translations";
import type { Currency } from "../currencies";
import type { Rates, Spending } from "../types";

function GlobalActions({
  spendings,
  setSpendings,
  rates,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  rates: Rates[];
}) {
  const { t, language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCurrency = e.target.value as Currency;
    setCurrency(newCurrency);

    try {
      const updatedSpendings = spendings.map((spending) => {
        try {
          return {
            ...spending,
            exchangedAmount: getExchangeAmount(spending, newCurrency),
          };
        } catch (error) {
          console.error(
            `Failed to exchange amount for spending ${spending.id}:`,
            error
          );
          // Return spending with 0 as fallback
          return {
            ...spending,
            exchangedAmount: 0,
          };
        }
      });

      setSpendings(updatedSpendings);
    } catch (error) {
      console.error("Failed to update currency:", error);
      alert("Failed to update currency. Please try again.");
    }
  };
  const getExchangeAmount = (
    spending: Spending,
    newCurrency: Currency
  ): number => {
    if (spending.currency === newCurrency) {
      return spending.amount;
    }
    const exchangeRate = rates.find((rate) => rate.base === spending.currency)
      ?.exchangeRates[newCurrency];
    if (!exchangeRate) {
      console.error("[GlobalActions] Exchange rate not found", {
        from: spending.currency,
        to: newCurrency,
        availableRates: rates,
      });
      throw new Error("Exchange rate not found");
    }

    return Number(spending.amount) * exchangeRate;
  };

  const handleClearSpendings = () => {
    const removeItemsByPrefix = (prefix: string) => {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });
    };

    if (confirm(t.app.clearSpendingsConfirmation)) {
      removeItemsByPrefix("spendingsApp_");
      window.location.reload();
    }
  };

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
      <select name="currency" value={currency} onChange={handleCurrencyChange}>
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
        <option value="gbp">GBP</option>
        <option value="pln">PLN</option>
      </select>
      <button
        className="global-actions-mini-button"
        onClick={handleClearSpendings}
      >
        🚫
      </button>
    </div>
  );
}

export default GlobalActions;
