export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  publisher: string | null;
  publishedYear: number | null;
  genre: string | null;
  totalCopies: number;
  availableCopies: number;
  coverImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BookListParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  available?: boolean;
}

export interface OLSearchResult {
  olWorkId: string;
  title: string;
  author: string;
  isbn: string | null;
  publishedYear: number | null;
  coverUrl: string | null;
}
