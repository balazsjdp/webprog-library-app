import { apiClient } from './client';
import { Book, BookListParams, OLSearchResult, PaginatedResponse } from '../types/book.types';

export const booksApi = {
  list: (params: BookListParams) =>
    apiClient.get<PaginatedResponse<Book>>('/books', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Book>(`/books/${id}`).then((r) => r.data),
};

export const adminBooksApi = {
  create: (data: Partial<Book>) =>
    apiClient.post<Book>('/admin/books', data).then((r) => r.data),

  update: (id: string, data: Partial<Book>) =>
    apiClient.put<Book>(`/admin/books/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/admin/books/${id}`),

  updateCopies: (id: string, totalCopies: number) =>
    apiClient.patch<Book>(`/admin/books/${id}/copies`, { totalCopies }).then((r) => r.data),

  searchOpenLibrary: (q: string) =>
    apiClient.get<OLSearchResult[]>('/admin/books/search-ol', { params: { q } }).then((r) => r.data),

  importFromOpenLibrary: (olWorkId: string, isbn: string | null, totalCopies: number) =>
    apiClient.post<Book>('/admin/books/import', { olWorkId, isbn, totalCopies }).then((r) => r.data),
};
