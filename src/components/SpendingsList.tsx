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
import CancelIcon from "../assets/icons/cancel.svg?react";
import ArrowUpIcon from "../assets/icons/arrow_drop_up.svg?react";
import ArrowDownIcon from "../assets/icons/arrow_drop_down.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";
import ClearInputIcon from "../assets/icons/clear_input.svg?react";
import Button from "./ui/Button";
import Input from "./ui/Input";

function SpendingsList({
  spendings,
  setSpendings,
  users,
  selectedUserId,
  selectedSpendingCurrency,
  rates,
  expanded,
  setExpanded,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  users: User[];
  selectedUserId: string | null;
  selectedSpendingCurrency: Currency;
  rates: Rates[];
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
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
          : spending,
      ),
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
      (spending) => spending.id !== id,
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
                <Input
                  variant="none"
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
              <Input
                variant="long-default"
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
            <ol>
              {searchResults // replaced plain 'spendings' here for search bar feature
                .filter((spending) =>
                  filterByUser ? spending.userId === selectedUserId : true,
                )
                .filter((spending) =>
                  filterByCurrency
                    ? spending.currency === selectedSpendingCurrency
                    : true,
                )
                .map((spending) => {
                  const userData = usersDataMemo.get(spending.userId);
                  return (
                    <li key={spending.id}>
                      {editedSpendingId && editedSpendingId === spending.id ? (
                        <form
                          className="spendings-list-grid-edit-container"
                          onSubmit={handleSaveEditedSpending}
                        >
                          <select
                            name="users"
                            className="spendings-list-user-selector"
                            value={editUser}
                            onChange={(e) => setEditUser(e.target.value)}
                          >
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                          <div className="spendings-list-amount-edit-container">
                            <Input
                              variant="short-mini"
                              type="number"
                              placeholder={t.spending.amount}
                              min="0"
                              step="0.01"
                              value={editInputValue}
                              onChange={(e) =>
                                setEditInputValue(e.target.value)
                              }
                            />
                            <Input
                              variant="long-mini"
                              type="text"
                              placeholder={t.spending.description}
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                            />
                          </div>
                          <Input
                            variant="short-mini"
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                          />
                          <div className="spendings-list-button-container">
                            <Button variant="square-mini" type="submit">
                              <SaveIcon className="standard-mini-icon" />
                            </Button>
                            <Button
                              variant="square-mini"
                              onClick={() => handleCancelEditedSpending}
                            >
                              <CancelIcon className="standard-mini-icon" />
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="spendings-list-grid-container">
                          <span className="spendings-list-username">
                            {userData?.name}
                          </span>
                          <div className="spendings-list-amount-container">
                            <div
                              className="spendings-list-amount-container-inner"
                              title={formatCurrency(
                                spending.exchangedAmount,
                                currencyCode,
                                currencyLocale,
                              )}
                              tabIndex={0}
                              style={
                                {
                                  "--pred-color": userData?.color,
                                } as React.CSSProperties
                              }
                            >
                              <span className="spendings-list-amount">
                                {formatCurrency(
                                  spending.amount,
                                  spending.currency,
                                  localeMap[spending.currency],
                                )}
                              </span>
                              <span className="spendings-list-amount-description">
                                {spending.description}
                              </span>
                            </div>
                          </div>
                          <span className="spendings-list-date">
                            {formatDate(new Date(spending.date), locale)}
                          </span>
                          <div className="spendings-list-button-container">
                            <Button
                              variant="square-mini"
                              onClick={() => handleEditSpending(spending.id)}
                            >
                              <EditIcon className="standard-mini-icon" />
                            </Button>
                            <Button
                              variant="square-mini"
                              onClick={() => handleDeleteSpending(spending.id)}
                            >
                              <RemoveIcon className="standard-mini-icon" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ol>
          </div>
          <div className="spendings-list-expand">
            <Button
              variant="long-mini"
              onClick={() => setExpanded((prev) => !prev)}
            >
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
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default SpendingsList;
