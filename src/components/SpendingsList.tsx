import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { formatDate, formatCurrency, timeAgo } from "../utils/formatter";
import { predefinedColors } from "../constants/colors";
import { localeMap, type Currency } from "../currencies";
import type { Spending, User, Rates } from "../types";
import EditIcon from "../assets/icons/edit.svg?react";
import RemoveIcon from "../assets/icons/remove.svg?react";
import SaveIcon from "../assets/icons/save.svg?react";
import CancelIcon from "../assets/icons/cancel.svg?react";
import ArrowUpIcon from "../assets/icons/arrow_drop_up.svg?react";
import ArrowDownIcon from "../assets/icons/arrow_drop_down.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";
import ClearInputIcon from "../assets/icons/clear_input.svg?react";

function SpendingsList({
  spendings,
  setSpendings,
  users,
  selectedUserId,
  selectedSpendingCurrency,
  rates,
  expanded,
  setExpanded,
  dirty,
  setDirty,
  lastSyncAt,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  users: User[];
  selectedUserId: string | null;
  selectedSpendingCurrency: Currency;
  rates: Rates[];
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
  lastSyncAt: Date | null;
}) {
  const { t, locale } = useLanguage();
  const { currencyCode, currencyLocale } = useCurrency();
  const [filterByUser, setFilterByUser] = useState<boolean>(false);
  const [filterByCurrency, setFilterByCurrency] = useState<boolean>(false);
  const [editedSpendingId, setEditedSpendingId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<string>("");
  const [editInputValue, setEditInputValue] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [timestamp, setTimestamp] = useState<string>(() =>
    lastSyncAt ? timeAgo(lastSyncAt) : ""
  );

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
      setEditUser(spending.userId);
      setEditInputValue(spending.amount.toString());
      setEditDescription(spending.description);
      setEditDate(spending.date);
    }
  };

  const handleSaveEditedSpending = (e: React.FormEvent) => {
    e.preventDefault();
    setSpendings(
      spendings.map((spending) =>
        spending.id === editedSpendingId
          ? {
              ...spending,
              userId: editUser,
              amount: Number(editInputValue),
              description: editDescription,
              date: editDate,
              exchangedAmount: getExchangedAmount(spending.currency),
            }
          : spending
      )
    );
    setEditUser("");
    setEditInputValue("");
    setEditDescription("");
    setEditDate("");
    setEditedSpendingId(null);
  };

  const handleCancelEditedSpending = (e: React.FormEvent) => {
    e.preventDefault();
    setEditUser("");
    setEditInputValue("");
    setEditDescription("");
    setEditDate("");
    setEditedSpendingId(null);
  };

  const handleDeleteSpending = (id: string) => {
    if (!confirm(t.spending.remove)) return;

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

  const spendingsSortedByDate = useMemo(() => {
    return [...spendings].sort((a, b) => a.date.localeCompare(b.date));
  }, [spendings]);

  const searchResults = spendingsSortedByDate.filter((spending) => {
    if (searchValue === "") return spendingsSortedByDate;
    return spending.description
      .toLowerCase()
      .includes(searchValue.toLowerCase());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSyncAt) {
        setTimestamp(timeAgo(lastSyncAt));
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [lastSyncAt]);

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
            <div className="spendings-list-search-bar">
              <SearchIcon className="standard-icon" />
              <input
                type="text"
                className="spendings-list-search-input"
                placeholder={t.spending.search}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button onClick={() => setSearchValue("")}>
                <ClearInputIcon className="standard-icon" />
              </button>
            </div>
            <div>
              <span className="spendings-list-sync-timestamp">
                last sync: {timestamp}
              </span>
            </div>
            <ol>
              {searchResults // replaced plain 'spendings' here for search bar feature
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
                            {editedSpendingId &&
                            editedSpendingId === spending.id ? (
                              <>
                                <td>
                                  <form onSubmit={handleSaveEditedSpending}>
                                    <select
                                      name="users"
                                      className="spendings-list-user-selector"
                                      value={editUser}
                                      onChange={(e) =>
                                        setEditUser(e.target.value)
                                      }
                                    >
                                      {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                          {user.name}
                                        </option>
                                      ))}
                                    </select>{" "}
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
                                    />{" "}
                                    <input
                                      type="date"
                                      className="spendings-list-datepicker"
                                      value={editDate}
                                      onChange={(e) =>
                                        setEditDate(e.target.value)
                                      }
                                    />
                                    <button // shenanigans to allow actual button to be in its own td, not inside the form
                                      type="submit"
                                      style={{ display: "none" }}
                                    />
                                  </form>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="spendings-list-username">
                                  {userData?.name}
                                </td>
                                <td>
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
                                </td>
                                <td className="spendings-list-date">
                                  {formatDate(new Date(spending.date), locale)}
                                </td>
                              </>
                            )}
                            <td className="spendings-list-button-container">
                              {editedSpendingId &&
                              editedSpendingId === spending.id ? (
                                <>
                                  <button
                                    onClick={handleSaveEditedSpending}
                                    className="spendings-list-mini-button"
                                  >
                                    <SaveIcon className="standard-mini-icon" />
                                  </button>
                                  <button
                                    onClick={handleCancelEditedSpending}
                                    className="spendings-list-mini-button"
                                  >
                                    <CancelIcon className="standard-mini-icon" />
                                  </button>
                                </>
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
