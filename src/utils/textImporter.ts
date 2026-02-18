import { todayAsInputValue } from "./helper";
import type { User, Spending, Output, HeaderType } from "../types";
import type { Currency } from "../currencies";

type Entries = {
  user: string;
  spending: number;
  description: string;
  currency: Currency;
};

// Converts raw text into object of Entries, then sends it to transform()
export function convertToJSON(
  rawText: string,
  currency: Currency,
  headers: HeaderType[],
) {
  const delimiter = " ";
  const lines = rawText.trim().split("\n");

  const entries: Entries[] = lines.slice().map((line) => {
    const parts = line.split(delimiter);

    const obj: Partial<Entries> = {};

    headers.forEach((header, index) => {
      if (header === "spending") {
        let value = parts[index].replace(",", ".");
        obj.spending = parseFloat(value);
      } else if (header === "description") {
        obj.description = parts[index];
      } else if (header === "user") {
        obj.user = parts[index];
      }
      obj.currency = currency;
    });

    return obj as Entries;
  });

  return transform(entries);
}

// Creates actual JSON file for importer
function transform(entries: Entries[]): Output {
  const users: User[] = [];
  const spendings: Spending[] = [];

  const userMap = new Map<String, string>();

  for (const entry of entries) {
    let userId: string;

    if (userMap.has(entry.user)) {
      userId = userMap.get(entry.user)!;
    } else {
      userId = crypto.randomUUID();
      userMap.set(entry.user, userId);
      users.push({
        id: userId,
        name: entry.user,
      });
    }

    spendings.push({
      id: crypto.randomUUID(),
      amount: entry.spending,
      description: entry.description,
      date: todayAsInputValue(),
      currency: entry.currency as Currency,
      exchangedAmount: entry.spending,
      userId: userId,
    });
  }

  return { users, spendings };
}
