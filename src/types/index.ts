export interface Spending {
  id: string;
  amount: number;
  description: string;
  date: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
}
