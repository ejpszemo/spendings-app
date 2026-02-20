import { useState } from "react";
import { predefinedColors } from "../constants/colors";
import { useLanguage } from "../contexts/LanguageContext";
import type { User, Spending } from "../types";
import AddIcon from "../assets/icons/add.svg?react";
import RemoveIcon from "../assets/icons/remove.svg?react";
import SaveIcon from "../assets/icons/save.svg?react";
import CheckIcon from "../assets/icons/checkmark.svg?react";
import Button from "./ui/Button";

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
        spendings.filter((spending) => spending.userId !== selectedUserId),
      );
    }
  };

  return (
    <form className="user-selector" onSubmit={handleAddUser}>
      {users.map((user) => (
        <label key={user.id} className="user-selector-label">
          <input
            type="radio"
            className="user-selector-radio"
            value={user.id}
            checked={selectedUserId === user.id}
            onChange={(e) => setSelectedUserId(e.target.value)}
          />
          <CheckIcon className="standard-mini-icon" />
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
          <Button variant="square-default" type="submit">
            <SaveIcon className="standard-icon" />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="square-default"
            disabled={users.length >= predefinedColors.length}
            onClick={() => setAddingUser(true)}
          >
            <AddIcon className="standard-icon" />
          </Button>
          <Button
            variant="square-default"
            onClick={() => handleRemoveUser()}
            disabled={users.length <= 0}
          >
            <RemoveIcon className="standard-icon" />
          </Button>
        </>
      )}
    </form>
  );
}

export default UserSelector;
