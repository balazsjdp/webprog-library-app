import { Book } from './book.types';

export type BorrowingStatus = 'active' | 'returned' | 'overdue';

export interface Borrowing {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  book?: Book;
  status: BorrowingStatus;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
}
