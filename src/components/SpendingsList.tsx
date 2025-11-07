import { useState, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { formatDate, formatCurrency } from "../utils/formatter";
import { predefinedColors } from "../constants/colors";
import { localeMap, type Currency } from "../currencies";
import type { Spending, User, Rates } from "../types";
import EditIcon from "../assets/icons/edit.svg?react";
import RemoveIcon from "../assets/icons/remove.svg?react";
import SaveIcon from "../assets/icons/save.svg?react";
import ArrowUpIcon from "../assets/icons/arrow_drop_up.svg?react";
import ArrowDownIcon from "../assets/icons/arrow_drop_down.svg?react";

function SpendingsList({
  spendings,
  setSpendings,
  users,
  selectedUserId,
  selectedSpendingCurrency,
  rates,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  users: User[];
  selectedUserId: string | null;
  selectedSpendingCurrency: Currency;
  rates: Rates[];
}) {
  const { t, locale } = useLanguage();
  const { currencyCode, currencyLocale } = useCurrency();
  const [filterByUser, setFilterByUser] = useState<boolean>(false);
  const [filterByCurrency, setFilterByCurrency] = useState<boolean>(false);
  const [editedSpendingId, setEditedSpendingId] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(true);

  const usersDataMemo = useMemo(() => {
    const userMap = new Map<string, { name: string; color: string }>();
    users.forEach((user, index) => {
      userMap.set(user.id, {
        name: user.name,
        color: predefinedColors[index],
      });
    });
    return userMap;
  }, [users]);

  const handleEditSpending = (id: string) => {
    const spending = spendings.find((s) => s.id === id);
    if (spending) {
      setEditedSpendingId(id);
      setEditInputValue(spending.amount.toString());
      setEditDescription(spending.description);
    }
  };

  const handleSaveEditedSpending = (e: React.FormEvent) => {
    e.preventDefault();
    setSpendings(
      spendings.map((spending) =>
        spending.id === editedSpendingId
          ? {
              ...spending,
              amount: Number(editInputValue),
              description: editDescription,
              exchangedAmount: getExchangedAmount(spending.currency),
            }
          : spending
      )
    );
    setEditInputValue("");
    setEditDescription("");
    setEditedSpendingId(null);
  };
  const handleDeleteSpending = (id: string) => {
    const filteredSpendings = spendings.filter(
      (spending) => spending.id !== id
    );
    setSpendings(filteredSpendings);
  };

  const getExchangedAmount = (spendingCurrency: Currency): number => {
    const targetCurrency = currencyCode.toLowerCase() as Currency;

    if (spendingCurrency === targetCurrency) {
      return Number(editInputValue);
    }

    const exchangeRate = rates.find((rate) => rate.base === spendingCurrency)
      ?.exchangeRates[targetCurrency];

    if (!exchangeRate) {
      console.error("[SpendingsList] Exchange rate not found", {
        from: spendingCurrency,
        to: targetCurrency,
        availableRates: rates,
      });
      throw new Error("Exchange rate not found");
    }

    return Number(editInputValue) * exchangeRate;
  };

  return (
    <>
      {spendings.length > 0 && (
        <>
          <div
            className="spendings-list"
            style={
              {
                "--expanded": expanded ? "flex" : "none",
              } as React.CSSProperties
            }
          >
            <div className="spendings-list-filters">
              <label className="spendings-list-filter-label">
                <input
                  type="checkbox"
                  checked={filterByUser}
                  onChange={(e) => setFilterByUser(e.target.checked)}
                />
                <span className="spendings-list-filter-checkmark"></span>
                {t.spending.filterByUser}
              </label>
              <label className="spendings-list-filter-label">
                <input
                  type="checkbox"
                  checked={filterByCurrency}
                  onChange={(e) => setFilterByCurrency(e.target.checked)}
                />
                <span className="spendings-list-filter-checkmark"></span>
                {t.spending.filterByCurrency}
              </label>
            </div>
            <ol>
              {spendings
                .filter((spending) =>
                  filterByUser ? spending.userId === selectedUserId : true
                )
                .filter((spending) =>
                  filterByCurrency
                    ? spending.currency === selectedSpendingCurrency
                    : true
                )
                .map((spending) => {
                  const userData = usersDataMemo.get(spending.userId);
                  return (
                    <li key={spending.id}>
                      <table>
                        <tbody>
                          <tr>
                            <td className="spendings-list-username">
                              {userData?.name}
                            </td>
                            <td>
                              {editedSpendingId &&
                              editedSpendingId === spending.id ? (
                                <>
                                  <form onSubmit={handleSaveEditedSpending}>
                                    <input
                                      type="number"
                                      className="spendings-list-amount-input"
                                      placeholder={t.spending.amount}
                                      min="0"
                                      step="0.01"
                                      value={editInputValue}
                                      onChange={(e) =>
                                        setEditInputValue(e.target.value)
                                      }
                                    />{" "}
                                    <input
                                      type="text"
                                      className="spendings-list-description-input"
                                      placeholder={t.spending.description}
                                      value={editDescription}
                                      onChange={(e) =>
                                        setEditDescription(e.target.value)
                                      }
                                    />
                                    <button // shenanigans to allow actual button to be in its own td, not inside the form
                                      type="submit"
                                      style={{ display: "none" }}
                                    />
                                  </form>
                                </>
                              ) : (
                                <span
                                  className="spendings-list-amount"
                                  title={formatCurrency(
                                    spending.exchangedAmount,
                                    currencyCode,
                                    currencyLocale
                                  )}
                                  tabIndex={0}
                                  style={
                                    {
                                      "--pred-color": userData?.color,
                                    } as React.CSSProperties
                                  }
                                >
                                  {formatCurrency(
                                    spending.amount,
                                    spending.currency,
                                    localeMap[spending.currency]
                                  )}{" "}
                                  {spending.description}
                                </span>
                              )}
                            </td>
                            <td className="spendings-list-button-container">
                              {editedSpendingId &&
                              editedSpendingId === spending.id ? (
                                <button
                                  onClick={handleSaveEditedSpending}
                                  className="spendings-list-mini-button"
                                >
                                  <SaveIcon className="standard-mini-icon" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      handleEditSpending(spending.id)
                                    }
                                    className="spendings-list-mini-button"
                                  >
                                    <EditIcon className="standard-mini-icon" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSpending(spending.id)
                                    }
                                    className="spendings-list-mini-button"
                                  >
                                    <RemoveIcon className="standard-mini-icon" />
                                  </button>
                                </>
                              )}
                            </td>
                            <td className="spendings-list-date">
                              {formatDate(new Date(spending.date), locale)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                  );
                })}
            </ol>
          </div>
          <div className="spendings-list-expand">
            <button onClick={() => setExpanded((prev) => !prev)}>
              {expanded ? (
                <>
                  <ArrowUpIcon className="standard-mini-icon" />{" "}
                  {t.spending.collapse}
                </>
              ) : (
                <>
                  <ArrowDownIcon className="standard-mini-icon" />{" "}
                  {t.spending.expand}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default SpendingsList;
