import { useParams, Link } from 'react-router-dom';
import { useBook } from '../hooks/useBooks';
import { useMyBorrowings } from '../hooks/useBorrowings';
import { useAuth } from '../hooks/useAuth';
import BookCoverImage from '../components/books/BookCoverImage';
import BorrowButton from '../components/borrowings/BorrowButton';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, isError } = useBook(id!);
  const { isAuthenticated } = useAuth();
  const { data: myBorrowings } = useMyBorrowings({ status: 'active' });

  const alreadyBorrowed = myBorrowings?.data.some((b) => b.bookId === id);

  if (isLoading) return <LoadingSpinner />;

  if (isError || !book) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg mb-4">A könyv nem található.</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Vissza a listához
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        ← Vissza a listához
      </Link>

      <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col sm:flex-row gap-8">
        <div className="flex-shrink-0 w-full sm:w-48">
          <BookCoverImage
            coverImageUrl={book.coverImageUrl}
            title={book.title}
            className="w-full h-64 sm:h-72 rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h1>
          <p className="text-gray-600 mt-1">{book.author}</p>

          {book.genre && (
            <span className="mt-3 inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              {book.genre}
            </span>
          )}

          <div className="mt-4 space-y-1 text-sm text-gray-600">
            {book.isbn && (
              <p>
                <span className="font-medium text-gray-800">ISBN:</span> {book.isbn}
              </p>
            )}
            {book.publisher && (
              <p>
                <span className="font-medium text-gray-800">Kiadó:</span> {book.publisher}
              </p>
            )}
            {book.publishedYear && (
              <p>
                <span className="font-medium text-gray-800">Megjelent:</span>{' '}
                {book.publishedYear}
              </p>
            )}
          </div>

          <div className="mt-4">
            <span
              className={`text-sm font-semibold ${
                book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {book.availableCopies > 0
                ? `${book.availableCopies} / ${book.totalCopies} példány elérhető`
                : 'Jelenleg nem elérhető'}
            </span>
          </div>

          {book.description && (
            <p className="mt-4 text-gray-700 text-sm leading-relaxed">{book.description}</p>
          )}

          <div className="mt-6">
            <BorrowButton
              bookId={book.id}
              availableCopies={book.availableCopies}
              alreadyBorrowed={isAuthenticated ? alreadyBorrowed : false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
