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
    return <p className="text-center text-pearl-aqua/50 py-10">Nincs könyv.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-graphite/60 text-pearl-aqua/50 text-xs uppercase tracking-wide">
            <th className="py-3 pr-4">Cím / Szerző</th>
            <th className="py-3 pr-4">Műfaj</th>
            <th className="py-3 pr-4">Példány</th>
            <th className="py-3 pr-4">Elérhető</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b border-graphite/40 hover:bg-graphite/50 transition-colors">
              <td className="py-3 pr-4">
                <p className="font-medium text-snow">{book.title}</p>
                <p className="text-xs text-pearl-aqua/50">{book.author}</p>
              </td>
              <td className="py-3 pr-4 text-pearl-aqua/70">{book.genre ?? '—'}</td>
              <td className="py-3 pr-4 text-pearl-aqua/70">{book.totalCopies}</td>
              <td className="py-3 pr-4">
                <span
                  className={`text-xs font-medium ${
                    book.availableCopies > 0 ? 'text-verdigris' : 'text-red-400'
                  }`}
                >
                  {book.availableCopies}
                </span>
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="text-xs px-3 py-1 border border-graphite/60 text-pearl-aqua/70 rounded hover:bg-graphite hover:text-snow transition-colors"
                  >
                    Szerkesztés
                  </button>
                  {confirmId === book.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(book.id)}
                        disabled={deleteMutation.isPending}
                        className="text-xs px-2 py-1 bg-red-600 text-snow rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Törlés
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs px-2 py-1 border border-graphite/60 text-pearl-aqua/70 rounded hover:bg-graphite transition-colors"
                      >
                        Mégse
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(book.id)}
                      className="text-xs px-3 py-1 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors"
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
