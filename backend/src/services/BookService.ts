import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';
import { AppError } from '../middleware/errorHandler.middleware';
import { CacheService, hashParams } from './CacheService';

export interface BookListParams {
  page: number;
  limit: number;
  search?: string;
  genre?: string;
  available?: boolean;
}

export const BookService = {
  async list(params: BookListParams) {
    const { page, limit, search, genre, available } = params;
    const cacheKey = `books:list:${hashParams(params as unknown as Record<string, unknown>)}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const repo = AppDataSource.getRepository(Book);
    const qb = repo.createQueryBuilder('book').where('book.isActive = true');

    if (search) {
      qb.andWhere(
        '(LOWER(book.title) LIKE :search OR LOWER(book.author) LIKE :search)',
        { search: `%${search.toLowerCase()}%` }
      );
    }
    if (genre) qb.andWhere('book.genre = :genre', { genre });
    if (available) qb.andWhere('book.availableCopies > 0');

    qb.skip((page - 1) * limit).take(limit).orderBy('book.title', 'ASC');

    const [data, total] = await qb.getManyAndCount();
    const result = { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };

    await CacheService.set(cacheKey, result, 120);
    return result;
  },

  async getById(id: string): Promise<Book> {
    const cacheKey = `books:detail:${id}`;
    const cached = await CacheService.get<Book>(cacheKey);
    if (cached) return cached;

    const book = await AppDataSource.getRepository(Book).findOne({
      where: { id, isActive: true },
    });
    if (!book) throw new AppError(404, 'Book not found');

    await CacheService.set(cacheKey, book, 300);
    return book;
  },

  async create(data: Partial<Book>): Promise<Book> {
    const repo = AppDataSource.getRepository(Book);
    const book = repo.create(data);
    const saved = await repo.save(book);
    await CacheService.delPattern('books:list:*');
    return saved;
  },

  async update(id: string, data: Partial<Book>): Promise<Book> {
    const repo = AppDataSource.getRepository(Book);
    const existing = await repo.findOne({ where: { id } });
    if (!existing) throw new AppError(404, 'Book not found');
    await repo.update(id, data);
    await CacheService.del(`books:detail:${id}`);
    await CacheService.delPattern('books:list:*');
    const updated = await repo.findOne({ where: { id } });
    return updated!;
  },

  async softDelete(id: string): Promise<void> {
    const repo = AppDataSource.getRepository(Book);
    const existing = await repo.findOne({ where: { id } });
    if (!existing) throw new AppError(404, 'Book not found');
    await repo.update(id, { isActive: false });
    await CacheService.del(`books:detail:${id}`);
    await CacheService.delPattern('books:list:*');
  },
};
