export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  description: string;
  group?: string;
}
