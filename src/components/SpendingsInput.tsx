import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCurrency } from "../contexts/CurrencyContext";
import useCurrencyApi from "../hooks/useCurrencyApi";
import type { Rates, Spending } from "../types";
import type { Currency } from "../currencies";

function SpendingsInput({
  spendings,
  setSpendings,
  selectedUserId,
  selectedSpendingCurrency,
  setSelectedSpendingCurrency,
  rates,
  setRates,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  selectedUserId: string | null;
  selectedSpendingCurrency: Currency;
  setSelectedSpendingCurrency: (currency: Currency) => void;
  rates: Rates[];
  setRates: (rates: Rates[]) => void;
}) {
  const { t } = useLanguage();
  const { currencyCode } = useCurrency();
  const [inputValue, setInputValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleAddSpending = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      inputValue === "" ||
      Number(inputValue) <= 0 ||
      selectedUserId === null
    ) {
      alert(t.spending.validSpendingAmount);
      return;
    }

    try {
      const newSpending = {
        id: crypto.randomUUID(),
        amount: Number(inputValue),
        description: description,
        date: new Date().toISOString(),
        currency: selectedSpendingCurrency,
        exchangedAmount: getExchangedAmount(),
        userId: selectedUserId,
      };
      setInputValue("");
      setDescription("");
      setSpendings([...spendings, newSpending]);
    } catch (error) {
      console.error("Error adding spending:", error);
      alert(
        "Exchange rate not available. Please change currency and try again."
      );
    }
  };
  const handleSpendingCurrencyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCurrency = e.target.value as Currency;
    setSelectedSpendingCurrency(newCurrency);

    try {
      await useCurrencyApi(newCurrency, rates, setRates);
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      alert("Failed to fetch exchange rates. Please try again.");
    }
  };
  const getExchangedAmount = (): number => {
    const targetCurrency = currencyCode.toLowerCase() as Currency;

    if (selectedSpendingCurrency === targetCurrency) {
      return Number(inputValue);
    }

    const exchangeRate = rates.find(
      (rate) => rate.base === selectedSpendingCurrency
    )?.exchangeRates[targetCurrency];

    if (!exchangeRate) {
      console.error("[SpendingsInput] Exchange rate not found", {
        from: selectedSpendingCurrency,
        to: targetCurrency,
        availableRates: rates,
      });
      throw new Error("Exchange rate not found");
    }

    return Number(inputValue) * exchangeRate;
  };

  return (
    <>
      {selectedUserId ? (
        <form className="spendings-input" onSubmit={handleAddSpending}>
          <select
            name="currency"
            value={selectedSpendingCurrency}
            onChange={handleSpendingCurrencyChange}
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
            <option value="pln">PLN</option>
          </select>
          <input
            type="number"
            className="spendings-input-amount"
            placeholder={t.spending.amount}
            min="0"
            disabled={selectedUserId === null}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <input
            type="text"
            className="spendings-input-description"
            placeholder={t.spending.description}
            disabled={selectedUserId === null}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">➕</button>
        </form>
      ) : (
        <p>{t.spending.firstAddUser}</p>
      )}
    </>
  );
}

export default SpendingsInput;
