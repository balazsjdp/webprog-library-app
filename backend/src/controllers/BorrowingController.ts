import { Request, Response } from 'express';
import { BorrowingService } from '../services/BorrowingService';
import { AppError } from '../middleware/errorHandler.middleware';

export const BorrowingController = {
  async borrow(req: Request, res: Response): Promise<void> {
    const { bookId } = req.body as Record<string, unknown>;
    if (!bookId) throw new AppError(400, 'bookId is required');

    const { sub: userId, preferred_username: userName } = req.user!;
    const borrowing = await BorrowingService.borrow(String(bookId), userId, userName);
    res.status(201).json(borrowing);
  },

  async returnBook(req: Request, res: Response): Promise<void> {
    const isAdmin = req.user?.realm_access?.roles.includes('admin') ?? false;
    const borrowing = await BorrowingService.return(req.params.id, req.user!.sub, isAdmin);
    res.json(borrowing);
  },

  async myBorrowings(req: Request, res: Response): Promise<void> {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const status = Array.isArray(req.query.status)
      ? undefined
      : (req.query.status as string | undefined);

    const result = await BorrowingService.getMyBorrowings(req.user!.sub, status, page, limit);
    res.json(result);
  },
};
