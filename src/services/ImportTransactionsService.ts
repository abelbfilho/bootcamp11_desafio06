import path from 'path';
import fs from 'fs';
import csv from 'csv-parse';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  csvFile: string;
}

interface CsvDto {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
interface TransactionDTO {
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
}

const readCsv = (pathCSV: string): Promise<CsvDto[]> =>
  new Promise(resolve => {
    const csvData: CsvDto[] = [];
    const csvStream = fs
      .createReadStream(pathCSV)
      .pipe(csv({ columns: true, ltrim: true }))
      .on('data', async data => {
        csvStream.pause();
        if (data[0] !== 'title' && data[1] !== 'type' && data[2] !== 'value') {
          csvData.push(data);
          csvStream.resume();
        } else {
          csvStream.resume();
        }
      })
      .on('end', () => {
        resolve(csvData);
      });
  });
class ImportTransactionsService {
  async execute({ csvFile }: Request): Promise<any> {
    const pathCSV = path.join(uploadConfig.directory, csvFile);
    const createTransaction = new CreateTransactionService();
    const transactions: Transaction[] = [];

    const contentCsv = await readCsv(pathCSV);

    await Promise.all(
      contentCsv.map(async row => {
        const transaction = await createTransaction.execute(row);
        transactions.push(transaction);
      }),
    );

    await fs.promises.unlink(pathCSV);

    return transactions;
  }
}

export default ImportTransactionsService;
