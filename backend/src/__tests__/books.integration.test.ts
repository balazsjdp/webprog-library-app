import request from 'supertest';
import { app } from '../app';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';

const bookRepo = () => AppDataSource.getRepository(Book);

beforeAll(async () => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
});

async function createBook(overrides: Partial<Book> = {}): Promise<Book> {
  const repo = bookRepo();
  const book = repo.create({
    title: 'Test Book',
    author: 'Test Author',
    totalCopies: 3,
    availableCopies: 3,
    isActive: true,
    ...overrides,
  });
  return repo.save(book);
}

beforeEach(async () => {
  await AppDataSource.getRepository(Book).delete({});
});

describe('GET /api/v1/books', () => {
  it('returns paginated book list', async () => {
    await createBook({ title: 'Book A' });
    await createBook({ title: 'Book B' });

    const res = await request(app).get('/api/v1/books');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toMatchObject({ total: 2, page: 1 });
  });

  it('filters by search term', async () => {
    await createBook({ title: 'Lord of the Rings', author: 'Tolkien' });
    await createBook({ title: 'Dune', author: 'Herbert' });

    const res = await request(app).get('/api/v1/books?search=tolkien');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Lord of the Rings');
  });

  it('filters to only available books', async () => {
    await createBook({ title: 'Available', availableCopies: 2 });
    await createBook({ title: 'Unavailable', availableCopies: 0 });

    const res = await request(app).get('/api/v1/books?available=true');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Available');
  });

  it('excludes soft-deleted books', async () => {
    await createBook({ title: 'Active' });
    await createBook({ title: 'Deleted', isActive: false });

    const res = await request(app).get('/api/v1/books');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Active');
  });
});

describe('GET /api/v1/books/:id', () => {
  it('returns book details for a valid id', async () => {
    const book = await createBook({ title: 'Detail Book' });

    const res = await request(app).get(`/api/v1/books/${book.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(book.id);
    expect(res.body.title).toBe('Detail Book');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/v1/books/00000000-0000-0000-0000-000000000000');

    expect(res.status).toBe(404);
  });
});
