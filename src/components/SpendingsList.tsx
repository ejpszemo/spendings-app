import { useState, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDate, formatCurrency } from "../utils/formatter";
import { predefinedColors } from "../constants/colors";
import type { Spending, User } from "../types";

function SpendingsList({
  spendings,
  setSpendings,
  users,
  selectedUserId,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  users: User[];
  selectedUserId: string | null;
}) {
  const { t, locale } = useLanguage();
  const [filterByUser, setFilterByUser] = useState<boolean>(false);
  const [editedSpendingId, setEditedSpendingId] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");

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

  return (
    <>
      {spendings.length > 0 && (
        <div className="spendings-list">
          <label>
            <input
              type="checkbox"
              checked={filterByUser}
              onChange={(e) => setFilterByUser(e.target.checked)}
            />
            <span>{t.spending.filterByUser}</span>
          </label>
          <ol>
            {spendings
              .filter((spending) =>
                filterByUser ? spending.userId === selectedUserId : true
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
                                    min="0"
                                    value={editInputValue}
                                    onChange={(e) =>
                                      setEditInputValue(e.target.value)
                                    }
                                  />{" "}
                                  <input
                                    type="text"
                                    className="spendings-list-description-input"
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
                                style={
                                  {
                                    "--pred-color": userData?.color,
                                  } as React.CSSProperties
                                }
                              >
                                {formatCurrency(spending.amount)}{" "}
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
                                💾
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleEditSpending(spending.id)
                                  }
                                  className="spendings-list-mini-button"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSpending(spending.id)
                                  }
                                  className="spendings-list-mini-button"
                                >
                                  ➖
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
      )}
    </>
  );
}

export default SpendingsList;
