import { Request, Response } from 'express';
import { BookService } from '../services/BookService';

export const BookController = {
  async list(req: Request, res: Response): Promise<void> {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const search = Array.isArray(req.query.search) ? undefined : req.query.search as string | undefined;
    const genre = Array.isArray(req.query.genre) ? undefined : req.query.genre as string | undefined;
    const available = req.query.available === 'true';

    const result = await BookService.list({ page, limit, search, genre, available });
    res.json(result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const book = await BookService.getById(req.params.id);
    res.json(book);
  },
};
