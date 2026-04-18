import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, BookFormData } from '../api/admin.api';
import { BorrowingStatus } from '../types/borrowing.types';
import { OLSearchResult } from '../types/book.types';

export function useAdminBorrowings(params?: { status?: BorrowingStatus; page?: number }) {
  return useQuery({
    queryKey: ['admin', 'borrowings', params],
    queryFn: () => adminApi.allBorrowings(params),
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BookFormData) => adminApi.createBook(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BookFormData> }) =>
      adminApi.updateBook(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteBook(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}

export function useOLSearch(query: string) {
  return useQuery({
    queryKey: ['ol-search', query],
    queryFn: () => adminApi.searchOpenLibrary(query),
    enabled: query.length > 2,
  });
}

export function useImportFromOL() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (result: OLSearchResult) => adminApi.importFromOpenLibrary(result),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
  });
}
