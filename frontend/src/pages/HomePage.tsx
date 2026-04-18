import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import BookSearchBar from '../components/books/BookSearchBar';
import BookGrid from '../components/books/BookGrid';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HomePage() {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page') ?? '1');
  const search = params.get('search') ?? '';
  const genre = params.get('genre') ?? '';
  const available = params.get('available') === 'true';

  const { data, isLoading, isError } = useBooks({ page, limit: 20, search, genre, available: available || undefined });

  const setParam = (key: string, value: string | undefined) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete('page');
      return next;
    });
  };

  const handlePageChange = (p: number) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(p));
      return next;
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-snow mb-6">Könyvek</h1>

      <BookSearchBar
        search={search}
        genre={genre}
        available={available}
        onSearchChange={(v) => setParam('search', v || undefined)}
        onGenreChange={(v) => setParam('genre', v || undefined)}
        onAvailableChange={(v) => setParam('available', v ? 'true' : undefined)}
      />

      {isLoading && <LoadingSpinner />}

      {isError && (
        <p className="text-center text-red-400 py-10">
          Hiba történt a könyvek betöltésekor.
        </p>
      )}

      {data && (
        <>
          <p className="text-sm text-pearl-aqua/50 mb-4">
            {data.meta.total} könyv található
          </p>
          <BookGrid books={data.data} />
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
