import { apiClient } from './client';
import { Borrowing, BorrowingStatus } from '../types/borrowing.types';
import { PaginatedResponse } from '../types/book.types';

export const borrowingsApi = {
  borrow: (bookId: string) =>
    apiClient.post<Borrowing>('/borrowings', { bookId }).then((r) => r.data),

  return: (id: string) =>
    apiClient.post<Borrowing>(`/borrowings/${id}/return`).then((r) => r.data),

  myBorrowings: (params?: { status?: BorrowingStatus; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Borrowing>>('/borrowings/my', { params }).then((r) => r.data),

  allBorrowings: (params?: { status?: BorrowingStatus; page?: number; limit?: number }) =>
    apiClient
      .get<PaginatedResponse<Borrowing>>('/admin/borrowings', { params })
      .then((r) => r.data),
};
