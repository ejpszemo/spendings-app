import type { User, Spending } from "../types";

export async function syncData(
  userToken: string,
  users: User[],
  spendings: Spending[]
) {
  const res = await fetch(
    `https://vercel-currency-api-for-spendings-a.vercel.app/api/data?userToken=${userToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users, spendings }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to sync data");
  }

  return res.json();
}

export async function getData(userToken: string | null) {
  const res = await fetch(
    `https://vercel-currency-api-for-spendings-a.vercel.app/api/data?userToken=${userToken}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json() as Promise<{
    users: User[];
    spendings: Spending[];
  }>;
}
