import { getRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Category from '../models/Category';

interface CategoryDTO {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: CategoryDTO): Promise<Category> {
    const categoriesRepository = getRepository(Category);
    const categoryExists = await categoriesRepository.findOne({
      where: { title },
    });
    if (!categoryExists) {
      const newCategory = await categoriesRepository.create({
        title,
      });
      await categoriesRepository.save(newCategory);
      return newCategory;
    }
    return categoryExists;
  }
}

export default CreateCategoryService;
