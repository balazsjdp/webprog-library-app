import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { borrowingsApi } from '../api/borrowings.api';
import { BorrowingStatus } from '../types/borrowing.types';

export function useMyBorrowings(params?: { status?: BorrowingStatus; page?: number }) {
  return useQuery({
    queryKey: ['borrowings', 'my', params],
    queryFn: () => borrowingsApi.myBorrowings(params),
  });
}

export function useBorrowMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => borrowingsApi.borrow(bookId),
    onSuccess: (_data, bookId) => {
      qc.invalidateQueries({ queryKey: ['books', bookId] });
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['borrowings'] });
    },
  });
}

export function useReturnMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (borrowingId: string) => borrowingsApi.return(borrowingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['books'] });
      qc.invalidateQueries({ queryKey: ['borrowings'] });
    },
  });
}
