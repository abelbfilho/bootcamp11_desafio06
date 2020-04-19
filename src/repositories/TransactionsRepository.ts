import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: {
    id: string;
    title: string;
  };
}
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const totalIncome = allTransactions.reduce((total, transaction) => {
      if (transaction.type === 'income') return (total += transaction.value);
      return total;
    }, 0);
    const totalOucome = allTransactions.reduce((total, transaction) => {
      if (transaction.type === 'outcome') return (total += transaction.value);
      return total;
    }, 0);

    const balance = {
      income: totalIncome,
      outcome: totalOucome,
      total: totalIncome - totalOucome,
    };

    return balance;
  }
}

export default TransactionsRepository;
