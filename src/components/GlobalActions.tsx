import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { currencies } from "../currencies";
import { exportToJSON, importFromJSON, getTimestamp } from "../utils/exporter";
import { fetchCurrencyRates } from "../hooks/useCurrencyApi";
import type { Theme } from "../themes";
import type { Language } from "../translations";
import type { Currency } from "../currencies";
import type { Rates, Spending, User } from "../types";
import ExportIcon from "../assets/icons/export.svg?react";
import ImportIcon from "../assets/icons/import.svg?react";
import ClearIcon from "../assets/icons/clear.svg?react";
import SaveIcon from "../assets/icons/save.svg?react";
import CancelIcon from "../assets/icons/cancel.svg?react";
import CopyIcon from "../assets/icons/copy.svg?react";
import TokenIcon from "../assets/icons/token.svg?react";
import CheckIcon from "../assets/icons/checkmark.svg?react";

function GlobalActions({
  spendings,
  setSpendings,
  users,
  setUsers,
  rates,
  setRates,
  setSelectedUserId,
  userToken,
  setUserToken,
  setDirty,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  rates: Rates[];
  setRates: (rates: Rates[]) => void;
  setSelectedUserId: (userId: string | null) => void;
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  setDirty: (dirty: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [addingUserToken, setAddingUserToken] = useState<boolean>(false);
  const [editUserToken, setEditUserToken] = useState<string>("");

  type TokenActionState = "idle" | "copied" | "saved";
  const [actionState, setActionState] = useState<TokenActionState>("idle");

  const tokenButtonContent: Record<TokenActionState, React.ReactNode> = {
    idle: (
      <>
        <TokenIcon className="standard-mini-icon" />
        {t.app.getToken}
      </>
    ),
    copied: (
      <>
        <CheckIcon className="standard-mini-icon" />
        <p>{t.app.tokenCopied}</p>
      </>
    ),
    saved: (
      <>
        <CheckIcon className="standard-mini-icon" />
        <p>{t.app.tokenSaved}</p>
      </>
    ),
  };

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

  const handleExportData = () => {
    const dataToExport = {
      users,
      spendings,
    };
    exportToJSON(dataToExport, `spendings_export_${getTimestamp()}.json`);
  };

  const handleImportData = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const importedData = await importFromJSON(event);

    if (importedData) {
      if (confirm(t.app.importDataConfirmation)) {
        const { users, spendings } = importedData;

        // Update users first
        if (users) {
          setUsers(users);
          setSelectedUserId(users[0]?.id);
        }

        // Handle spendings with exchange rate recalculation
        if (spendings) {
          try {
            // Get all unique currencies from imported spendings
            const uniqueCurrencies = Array.from(
              new Set(spendings.map((s: Spending) => s.currency))
            ) as Currency[];

            // Find currencies we don't have rates for yet
            const missingCurrencies = uniqueCurrencies.filter(
              (curr) => !rates.find((rate) => rate.base === curr)
            );

            // Fetch all missing rates in parallel
            const newRates = await Promise.all(
              missingCurrencies.map((curr) => fetchCurrencyRates(curr))
            );

            // Merge with existing rates
            const allRates = [...rates, ...newRates];

            // Recalculate exchangedAmounts using the complete rate set
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

            // Update state with new rates and corrected spendings
            if (newRates.length > 0) {
              setRates(allRates);
            }
            setSpendings(updatedSpendings);
          } catch (error) {
            console.error(
              "Failed to fetch exchange rates for imported spendings:",
              error
            );
            // Still import the spendings, even if some exchange rates fail
            setSpendings(spendings);
            alert(
              "Imported data successfully, but some exchange rates may be unavailable. You can update them manually."
            );
          }
        }
      }
    }

    // Reset the input value so the same file can be imported again
    event.target.value = "";

    setDirty(true);
  };

  const handleEditUserToken = () => {
    setEditUserToken(userToken ?? "");
    setAddingUserToken(true);
  };
  const saveUserToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUserToken !== "") {
      setUserToken(editUserToken);
    }
    setActionState("saved");
    setAddingUserToken(false);
  };
  const copyUserToken = () => {
    navigator.clipboard.writeText(editUserToken);
    setActionState("copied");
    setAddingUserToken(false);
  };

  useEffect(() => {
    if (actionState === "idle") return;

    const timer = setTimeout(() => {
      setActionState("idle");
    }, 1500);

    return () => clearTimeout(timer);
  }, [actionState]);

  return (
    <div className="global-actions-container">
      <div className="global-actions-data-ops">
        <button
          className="global-actions-mini-long-button"
          onClick={handleExportData}
        >
          <ExportIcon className="standard-mini-icon" /> {t.app.exportData}
        </button>
        <label htmlFor="file-upload" className="global-actions-input-label">
          <input
            id="file-upload"
            className="file-upload-input"
            type="file"
            accept=".json"
            onChange={handleImportData}
          />
          <ImportIcon className="standard-mini-icon" /> {t.app.importData}
        </label>
        {addingUserToken ? (
          <form className="global-actions-token-ops" onSubmit={saveUserToken}>
            <input
              type="text"
              value={editUserToken}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => setEditUserToken(e.target.value)}
            />
            <button
              className="global-actions-mini-button"
              type="button"
              disabled={!editUserToken}
              onClick={copyUserToken}
            >
              <CopyIcon className="standard-mini-icon" />
            </button>
            <button className="global-actions-mini-button" type="submit">
              <SaveIcon className="standard-mini-icon" />
            </button>
            <button
              className="global-actions-mini-button"
              type="button"
              onClick={() => setAddingUserToken(false)}
            >
              <CancelIcon className="standard-mini-icon" />
            </button>
          </form>
        ) : (
          <button
            className="global-actions-mini-long-button"
            onClick={handleEditUserToken}
          >
            {tokenButtonContent[actionState]}
          </button>
        )}
        <button
          className="global-actions-mini-long-button"
          onClick={handleClearSpendings}
        >
          <ClearIcon className="standard-mini-icon" /> {t.app.clearData}
        </button>
      </div>
      <div className="global-actions-contexts">
        <div className="global-actions-contexts-selector">
          <label className="global-actions-mini-text">{t.app.theme}</label>
          <select
            name="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
          >
            <option value="light">{t.app.light}</option>
            <option value="dark">{t.app.dark}</option>
          </select>
        </div>
        <div className="global-actions-contexts-selector">
          <label className="global-actions-mini-text">{t.app.language}</label>
          <select
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            <option value="en">English</option>
            <option value="pl">Polski</option>
          </select>
        </div>
        <div className="global-actions-contexts-selector">
          <label className="global-actions-mini-text">
            {t.app.targetCurrency}
          </label>
          <select
            name="currency"
            value={currency}
            onChange={handleCurrencyChange}
          >
            {Object.entries(currencies).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default GlobalActions;
