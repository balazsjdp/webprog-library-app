import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';
import { Borrowing, BorrowingStatus } from '../entities/Borrowing';
import { AppError } from '../middleware/errorHandler.middleware';
import { CacheService } from './CacheService';
import { borrowingsActive, borrowingsCreated } from '../config/metrics';

const BORROW_DAYS = 30;

export const BorrowingService = {
  async borrow(bookId: string, userId: string, userName: string): Promise<Borrowing> {
    return AppDataSource.transaction(async (manager) => {
      const bookRepo = manager.getRepository(Book);
      const borrowingRepo = manager.getRepository(Borrowing);

      const book = await bookRepo
        .createQueryBuilder('book')
        .where('book.id = :id AND book.isActive = true', { id: bookId })
        .setLock('pessimistic_write')
        .getOne();

      if (!book) throw new AppError(404, 'Book not found');
      if (book.availableCopies <= 0) throw new AppError(409, 'No copies available');

      const existing = await borrowingRepo.findOne({
        where: { userId, bookId, status: BorrowingStatus.ACTIVE },
      });
      if (existing) throw new AppError(409, 'You already have this book borrowed');

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

      const borrowing = borrowingRepo.create({
        userId,
        userName,
        bookId,
        status: BorrowingStatus.ACTIVE,
        dueDate,
        returnedAt: null,
      });

      await bookRepo.update(bookId, { availableCopies: book.availableCopies - 1 });
      const saved = await borrowingRepo.save(borrowing);

      await CacheService.del(`books:detail:${bookId}`);
      await CacheService.delPattern('books:list:*');
      await CacheService.delPattern(`borrowings:my:${userId}:*`);

      borrowingsCreated.add(1);
      borrowingsActive.add(1);

      return saved;
    });
  },

  async return(borrowingId: string, userId: string, isAdmin: boolean): Promise<Borrowing> {
    return AppDataSource.transaction(async (manager) => {
      const borrowingRepo = manager.getRepository(Borrowing);
      const bookRepo = manager.getRepository(Book);

      const borrowing = await borrowingRepo.findOne({ where: { id: borrowingId } });
      if (!borrowing) throw new AppError(404, 'Borrowing not found');
      if (!isAdmin && borrowing.userId !== userId) throw new AppError(403, 'Not authorized');
      if (borrowing.status === BorrowingStatus.RETURNED) throw new AppError(409, 'Already returned');

      const returnedAt = new Date();
      await borrowingRepo.update(borrowingId, { status: BorrowingStatus.RETURNED, returnedAt });

      const book = await bookRepo.findOne({ where: { id: borrowing.bookId } });
      if (book) {
        await bookRepo.update(book.id, { availableCopies: book.availableCopies + 1 });
      }

      await CacheService.del(`books:detail:${borrowing.bookId}`);
      await CacheService.delPattern('books:list:*');
      await CacheService.delPattern(`borrowings:my:${borrowing.userId}:*`);
      await CacheService.delPattern('borrowings:all:*');

      borrowingsActive.add(-1);

      return (await borrowingRepo.findOne({ where: { id: borrowingId } }))!;
    });
  },

  async getMyBorrowings(userId: string, status?: string, page = 1, limit = 10) {
    const cacheKey = `borrowings:my:${userId}:${status ?? 'all'}:${page}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const qb = AppDataSource.getRepository(Borrowing)
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.book', 'book')
      .where('b.userId = :userId', { userId });

    if (status) qb.andWhere('b.status = :status', { status });
    qb.skip((page - 1) * limit).take(limit).orderBy('b.borrowedAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    const result = { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };

    await CacheService.set(cacheKey, result, 60);
    return result;
  },

  async getAllBorrowings(page = 1, limit = 20, status?: string) {
    const cacheKey = `borrowings:all:${status ?? 'all'}:${page}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const qb = AppDataSource.getRepository(Borrowing)
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.book', 'book');

    if (status) qb.andWhere('b.status = :status', { status });
    qb.skip((page - 1) * limit).take(limit).orderBy('b.borrowedAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    const result = { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };

    await CacheService.set(cacheKey, result, 30);
    return result;
  },
};
