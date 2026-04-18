import { useState } from 'react';
import { Book } from '../../types/book.types';
import { useDeleteBook } from '../../hooks/useAdmin';

interface Props {
  books: Book[];
  onEdit: (book: Book) => void;
}

export default function AdminBookTable({ books, onEdit }: Props) {
  const deleteMutation = useDeleteBook();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setConfirmId(null);
  };

  if (books.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nincs könyv.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b text-gray-500 text-xs uppercase tracking-wide">
            <th className="py-3 pr-4">Cím / Szerző</th>
            <th className="py-3 pr-4">Műfaj</th>
            <th className="py-3 pr-4">Példány</th>
            <th className="py-3 pr-4">Elérhető</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b hover:bg-gray-50">
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-800">{book.title}</p>
                <p className="text-xs text-gray-400">{book.author}</p>
              </td>
              <td className="py-3 pr-4 text-gray-600">{book.genre ?? '—'}</td>
              <td className="py-3 pr-4 text-gray-600">{book.totalCopies}</td>
              <td className="py-3 pr-4">
                <span
                  className={`text-xs font-medium ${
                    book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {book.availableCopies}
                </span>
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Szerkesztés
                  </button>
                  {confirmId === book.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(book.id)}
                        disabled={deleteMutation.isPending}
                        className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Törlés
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        Mégse
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(book.id)}
                      className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50"
                    >
                      Törlés
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
