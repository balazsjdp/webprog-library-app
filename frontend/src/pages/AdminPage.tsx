import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useAdminBorrowings } from '../hooks/useAdmin';
import { Book } from '../types/book.types';
import AdminBookTable from '../components/admin/AdminBookTable';
import BookFormModal from '../components/admin/BookFormModal';
import OpenLibraryImportModal from '../components/admin/OpenLibraryImportModal';
import BorrowingHistoryTable from '../components/borrowings/BorrowingHistoryTable';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

type Tab = 'books' | 'borrowings';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('books');
  const [bookPage, setBooksPage] = useState(1);
  const [borrowingPage, setBorrowingPage] = useState(1);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOLModal, setShowOLModal] = useState(false);

  const { data: booksData, isLoading: booksLoading } = useBooks({ page: bookPage, limit: 20 });
  const { data: borrowingsData, isLoading: borrowingsLoading } = useAdminBorrowings({
    page: borrowingPage,
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin felület</h1>

      <div className="flex gap-1 mb-6 border-b">
        {(['books', 'borrowings'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'books' ? 'Könyvek' : 'Kölcsönzések'}
          </button>
        ))}
      </div>

      {tab === 'books' && (
        <div>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Új könyv
            </button>
            <button
              onClick={() => setShowOLModal(true)}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Open Library importálás
            </button>
          </div>

          {booksLoading && <LoadingSpinner />}
          {booksData && (
            <>
              <AdminBookTable
                books={booksData.data}
                onEdit={(book) => setEditBook(book)}
              />
              <Pagination
                currentPage={booksData.meta.page}
                totalPages={booksData.meta.totalPages}
                onPageChange={setBooksPage}
              />
            </>
          )}
        </div>
      )}

      {tab === 'borrowings' && (
        <div>
          {borrowingsLoading && <LoadingSpinner />}
          {borrowingsData && (
            <>
              <BorrowingHistoryTable borrowings={borrowingsData.data} />
              <Pagination
                currentPage={borrowingsData.meta.page}
                totalPages={borrowingsData.meta.totalPages}
                onPageChange={setBorrowingPage}
              />
            </>
          )}
        </div>
      )}

      {(showCreateModal || editBook) && (
        <BookFormModal
          book={editBook}
          onClose={() => {
            setShowCreateModal(false);
            setEditBook(null);
          }}
        />
      )}

      {showOLModal && <OpenLibraryImportModal onClose={() => setShowOLModal(false)} />}
    </div>
  );
}
