import { useState } from "react";
import { predefinedColors } from "../constants/colors";
import { useLanguage } from "../contexts/LanguageContext";
import type { User, Spending } from "../types";

function UserSelector({
  spendings,
  setSpendings,
  users,
  setUsers,
  selectedUserId,
  setSelectedUserId,
}: {
  spendings: Spending[];
  setSpendings: (spendings: Spending[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
}) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState<string>("");
  const [addingUser, setAddingUser] = useState<boolean>(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUser(false);
    if (inputValue === "") {
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: inputValue,
    };
    setUsers([...users, newUser]);
    setInputValue("");
    setSelectedUserId(newUser.id);
  };
  const handleRemoveUser = () => {
    if (confirm(t.app.removeUserConfirmation)) {
      const filteredUsers = users.filter((user) => user.id !== selectedUserId);
      setUsers(filteredUsers);
      setSelectedUserId(filteredUsers[0]?.id || null);
      setSpendings(
        spendings.filter((spending) => spending.userId !== selectedUserId)
      );
    }
  };

  return (
    <form className="user-selector" onSubmit={handleAddUser}>
      {users.map((user, index) => (
        <label
          key={user.id}
          className="user-selector-label"
          style={
            { "--pred-color": predefinedColors[index] } as React.CSSProperties
          }
        >
          <input
            type="radio"
            className="user-selector-radio"
            value={user.id}
            checked={selectedUserId === user.id}
            onChange={(e) => setSelectedUserId(e.target.value)}
          />
          {user.name}
        </label>
      ))}

      {addingUser ? (
        <>
          <input
            type="text"
            className="user-selector-input"
            placeholder={t.user.userName}
            autoFocus
            maxLength={15}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">💾</button>
        </>
      ) : (
        <>
          <button
            disabled={users.length >= predefinedColors.length}
            onClick={() => setAddingUser(true)}
          >
            ➕
          </button>
          <button
            onClick={() => handleRemoveUser()}
            disabled={users.length <= 0}
          >
            ➖
          </button>
        </>
      )}
    </form>
  );
}

export default UserSelector;
