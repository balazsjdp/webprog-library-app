import request from 'supertest';
import { app } from '../app';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';
import { Borrowing } from '../entities/Borrowing';

const TEST_USER_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const TEST_USER_NAME = 'Test User';
const OTHER_USER_ID = 'bbbbbbbb-0000-0000-0000-000000000002';

jest.mock('../middleware/auth.middleware', () => ({
  authenticate: jest.fn((req: any, res: any, next: any) => {
    const auth: string | undefined = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = auth.slice(7);
    const userId = token === 'other-user' ? OTHER_USER_ID : TEST_USER_ID;
    req.user = {
      sub: userId,
      preferred_username: TEST_USER_NAME,
      realm_access: { roles: ['user'] },
    };
    next();
  }),
}));

beforeAll(async () => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
});

async function createBook(overrides: Partial<Book> = {}): Promise<Book> {
  const repo = AppDataSource.getRepository(Book);
  return repo.save(
    repo.create({
      title: 'Borrow Test Book',
      author: 'Author',
      totalCopies: 2,
      availableCopies: 2,
      isActive: true,
      ...overrides,
    })
  );
}

beforeEach(async () => {
  await AppDataSource.getRepository(Borrowing).delete({});
  await AppDataSource.getRepository(Book).delete({});
});

describe('POST /api/v1/borrowings', () => {
  it('creates a borrowing and decreases availableCopies', async () => {
    const book = await createBook();

    const res = await request(app)
      .post('/api/v1/borrowings')
      .set('Authorization', 'Bearer user-token')
      .send({ bookId: book.id });

    expect(res.status).toBe(201);
    expect(res.body.bookId).toBe(book.id);
    expect(res.body.status).toBe('active');

    const updated = await AppDataSource.getRepository(Book).findOneBy({ id: book.id });
    expect(updated!.availableCopies).toBe(1);
  });

  it('returns 401 without a token', async () => {
    const book = await createBook();
    const res = await request(app).post('/api/v1/borrowings').send({ bookId: book.id });
    expect(res.status).toBe(401);
  });

  it('returns 409 when no copies are available', async () => {
    const book = await createBook({ availableCopies: 0 });

    const res = await request(app)
      .post('/api/v1/borrowings')
      .set('Authorization', 'Bearer user-token')
      .send({ bookId: book.id });

    expect(res.status).toBe(409);
  });

  it('returns 409 when same user borrows the same book twice', async () => {
    const book = await createBook({ totalCopies: 5, availableCopies: 5 });

    await request(app)
      .post('/api/v1/borrowings')
      .set('Authorization', 'Bearer user-token')
      .send({ bookId: book.id });

    const res = await request(app)
      .post('/api/v1/borrowings')
      .set('Authorization', 'Bearer user-token')
      .send({ bookId: book.id });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/v1/borrowings/:id/return', () => {
  it('marks borrowing returned and increases availableCopies', async () => {
    const book = await createBook();

    const borrowRes = await request(app)
      .post('/api/v1/borrowings')
      .set('Authorization', 'Bearer user-token')
      .send({ bookId: book.id });

    const borrowingId: string = borrowRes.body.id;

    const returnRes = await request(app)
      .post(`/api/v1/borrowings/${borrowingId}/return`)
      .set('Authorization', 'Bearer user-token');

    expect(returnRes.status).toBe(200);
    expect(returnRes.body.status).toBe('returned');

    const updated = await AppDataSource.getRepository(Book).findOneBy({ id: book.id });
    expect(updated!.availableCopies).toBe(2);
  });
});

describe('GET /api/v1/borrowings/my', () => {
  it('returns only the current users borrowings', async () => {
    const book = await createBook({ totalCopies: 5, availableCopies: 5 });

    await request(app)
      .post('/api/v1/borrowings')
      .set('Authorization', 'Bearer user-token')
      .send({ bookId: book.id });

    await request(app)
      .post('/api/v1/borrowings')
      .set('Authorization', 'Bearer other-user')
      .send({ bookId: book.id });

    const res = await request(app)
      .get('/api/v1/borrowings/my')
      .set('Authorization', 'Bearer user-token');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].userId).toBe(TEST_USER_ID);
  });
});
