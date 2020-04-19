import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactionExists = await transactionRepository.find({ id });
    if (!transactionExists) {
      throw new AppError('Transaction id didnt exists.', 400);
    }
    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
