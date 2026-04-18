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
      <h1 className="text-2xl font-bold text-snow mb-6">Admin felület</h1>

      <div className="flex gap-1 mb-6 border-b border-graphite/40">
        {(['books', 'borrowings'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-verdigris text-verdigris'
                : 'border-transparent text-pearl-aqua/60 hover:text-snow'
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
              className="px-4 py-2 text-sm bg-verdigris text-snow rounded-lg hover:bg-pearl-aqua hover:text-onyx transition-colors"
            >
              + Új könyv
            </button>
            <button
              onClick={() => setShowOLModal(true)}
              className="px-4 py-2 text-sm border border-graphite/60 text-pearl-aqua/70 rounded-lg hover:bg-graphite hover:text-snow transition-colors"
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
