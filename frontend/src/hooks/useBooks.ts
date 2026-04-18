import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../api/books.api';
import { BookListParams } from '../types/book.types';

export function useBooks(params: BookListParams) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => booksApi.list(params),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => booksApi.getById(id),
    enabled: !!id,
  });
}
