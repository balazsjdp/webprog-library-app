import { apiClient } from './client';
import { Book, OLSearchResult, PaginatedResponse } from '../types/book.types';
import { Borrowing, BorrowingStatus } from '../types/borrowing.types';

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  publishedYear?: number;
  genre?: string;
  totalCopies: number;
  coverImageUrl?: string;
}

export const adminApi = {
  createBook: (data: BookFormData) =>
    apiClient.post<Book>('/admin/books', data).then((r) => r.data),

  updateBook: (id: string, data: Partial<BookFormData>) =>
    apiClient.put<Book>(`/admin/books/${id}`, data).then((r) => r.data),

  deleteBook: (id: string) =>
    apiClient.delete(`/admin/books/${id}`).then((r) => r.data),

  updateCopies: (id: string, totalCopies: number) =>
    apiClient.patch<Book>(`/admin/books/${id}/copies`, { totalCopies }).then((r) => r.data),

  searchOpenLibrary: (query: string) =>
    apiClient.get<OLSearchResult[]>('/admin/books/search-ol', { params: { q: query } }).then((r) => r.data),

  importFromOpenLibrary: (result: OLSearchResult) =>
    apiClient.post<Book>('/admin/books/import', result).then((r) => r.data),

  allBorrowings: (params?: { status?: BorrowingStatus; page?: number }) =>
    apiClient.get<PaginatedResponse<Borrowing>>('/admin/borrowings', { params }).then((r) => r.data),
};
