import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import type { Spending } from "../types";

function SpendingsInput({
  spendings,
  setSpendings,
  selectedUserId,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  selectedUserId: string | null;
}) {
  const { t } = useLanguage();
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
    const newSpending = {
      id: crypto.randomUUID(),
      amount: Number(inputValue),
      description: description,
      date: new Date().toISOString(),
      userId: selectedUserId,
    };
    setInputValue("");
    setDescription("");
    setSpendings([...spendings, newSpending]);
  };

  return (
    <>
      {selectedUserId ? (
        <form className="spendings-input" onSubmit={handleAddSpending}>
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
