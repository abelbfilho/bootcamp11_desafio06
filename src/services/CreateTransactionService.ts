import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  // private transactionsRepository: TransactionsRepository;

  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    // Create or find the category
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const actualBalance = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > actualBalance.total) {
      throw new AppError(
        'You dont have enought balance to do this transaction',
      );
    }
    const createCategory = new CreateCategoryService();
    const category_id = await createCategory.execute({ title: category });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category_id.id,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
