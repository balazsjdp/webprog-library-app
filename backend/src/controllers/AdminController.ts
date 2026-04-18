import { Request, Response } from 'express';
import { BookService } from '../services/BookService';
import { BorrowingService } from '../services/BorrowingService';
import { OpenLibraryService } from '../services/OpenLibraryService';
import { AppError } from '../middleware/errorHandler.middleware';

export const AdminController = {
  async createBook(req: Request, res: Response): Promise<void> {
    const { title, author, isbn, description, publisher, publishedYear, genre, totalCopies, coverImageUrl } =
      req.body as Record<string, unknown>;
    if (!title || !author) throw new AppError(400, 'Title and author are required');

    const copies = Number(totalCopies) || 1;
    const book = await BookService.create({
      title: String(title),
      author: String(author),
      isbn: isbn ? String(isbn) : null,
      description: description ? String(description) : null,
      publisher: publisher ? String(publisher) : null,
      publishedYear: publishedYear ? Number(publishedYear) : null,
      genre: genre ? String(genre) : null,
      totalCopies: copies,
      availableCopies: copies,
      coverImageUrl: coverImageUrl ? String(coverImageUrl) : null,
    });
    res.status(201).json(book);
  },

  async updateBook(req: Request, res: Response): Promise<void> {
    const { title, author, isbn, description, publisher, publishedYear, genre, coverImageUrl } =
      req.body as Record<string, unknown>;
    const book = await BookService.update(req.params.id, {
      ...(title ? { title: String(title) } : {}),
      ...(author ? { author: String(author) } : {}),
      isbn: isbn !== undefined ? (isbn ? String(isbn) : null) : undefined,
      description: description !== undefined ? (description ? String(description) : null) : undefined,
      publisher: publisher !== undefined ? (publisher ? String(publisher) : null) : undefined,
      publishedYear: publishedYear !== undefined ? (publishedYear ? Number(publishedYear) : null) : undefined,
      genre: genre !== undefined ? (genre ? String(genre) : null) : undefined,
      coverImageUrl: coverImageUrl !== undefined ? (coverImageUrl ? String(coverImageUrl) : null) : undefined,
    });
    res.json(book);
  },

  async deleteBook(req: Request, res: Response): Promise<void> {
    await BookService.softDelete(req.params.id);
    res.status(204).send();
  },

  async searchOpenLibrary(req: Request, res: Response): Promise<void> {
    const q = (Array.isArray(req.query.q) ? '' : (req.query.q as string | undefined) ?? '').trim();
    if (!q) throw new AppError(400, 'Search query is required');
    const results = await OpenLibraryService.search(q);
    res.json(results);
  },

  async importFromOpenLibrary(req: Request, res: Response): Promise<void> {
    const { olWorkId, isbn, totalCopies = 1 } = req.body as Record<string, unknown>;
    if (!olWorkId) throw new AppError(400, 'olWorkId is required');

    const [searchResults, workDetails] = await Promise.all([
      OpenLibraryService.search(String(olWorkId)),
      OpenLibraryService.getWorkDetails(String(olWorkId)),
    ]);

    const source = searchResults[0];
    const resolvedIsbn = isbn ? String(isbn) : (source?.isbn ?? null);
    const copies = Number(totalCopies) || 1;

    const book = await BookService.create({
      title: source?.title ?? 'Unknown',
      author: source?.author ?? 'Unknown',
      isbn: resolvedIsbn,
      description: workDetails.description,
      publishedYear: source?.publishedYear ?? null,
      totalCopies: copies,
      availableCopies: copies,
      coverImageUrl: resolvedIsbn
        ? OpenLibraryService.buildCoverUrl(resolvedIsbn, 'L')
        : (source?.coverUrl ?? null),
    });
    res.status(201).json(book);
  },

  async updateCopies(req: Request, res: Response): Promise<void> {
    const { totalCopies } = req.body as Record<string, unknown>;
    if (typeof totalCopies !== 'number' || totalCopies < 0) {
      throw new AppError(400, 'totalCopies must be a non-negative number');
    }
    const book = await BookService.update(req.params.id, { totalCopies });
    res.json(book);
  },

  async getAllBorrowings(req: Request, res: Response): Promise<void> {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const status = Array.isArray(req.query.status)
      ? undefined
      : (req.query.status as string | undefined);
    const result = await BorrowingService.getAllBorrowings(page, limit, status);
    res.json(result);
  },
};
