import { useEffect, useState } from 'react';
import { Book } from '../../types/book.types';
import { BookFormData } from '../../api/admin.api';
import { useCreateBook, useUpdateBook } from '../../hooks/useAdmin';

interface Props {
  book?: Book | null;
  onClose: () => void;
}

const EMPTY: BookFormData = {
  title: '',
  author: '',
  isbn: '',
  description: '',
  publisher: '',
  publishedYear: undefined,
  genre: '',
  totalCopies: 1,
  coverImageUrl: '',
};

export default function BookFormModal({ book, onClose }: Props) {
  const create = useCreateBook();
  const update = useUpdateBook();
  const [form, setForm] = useState<BookFormData>(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        isbn: book.isbn ?? '',
        description: book.description ?? '',
        publisher: book.publisher ?? '',
        publishedYear: book.publishedYear ?? undefined,
        genre: book.genre ?? '',
        totalCopies: book.totalCopies,
        coverImageUrl: book.coverImageUrl ?? '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [book]);

  const set = (key: keyof BookFormData, value: string | number | undefined) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload: BookFormData = {
      ...form,
      isbn: form.isbn || undefined,
      description: form.description || undefined,
      publisher: form.publisher || undefined,
      genre: form.genre || undefined,
      coverImageUrl: form.coverImageUrl || undefined,
    };
    try {
      if (book) {
        await update.mutateAsync({ id: book.id, data: payload });
      } else {
        await create.mutateAsync(payload);
      }
      onClose();
    } catch {
      setError('Hiba történt a mentés során.');
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {book ? 'Könyv szerkesztése' : 'Új könyv hozzáadása'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Cím *">
              <input
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </Field>

            <Field label="Szerző *">
              <input
                required
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="ISBN">
                <input
                  value={form.isbn ?? ''}
                  onChange={(e) => set('isbn', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </Field>
              <Field label="Megjelenés éve">
                <input
                  type="number"
                  value={form.publishedYear ?? ''}
                  onChange={(e) =>
                    set('publishedYear', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Kiadó">
                <input
                  value={form.publisher ?? ''}
                  onChange={(e) => set('publisher', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </Field>
              <Field label="Műfaj">
                <input
                  value={form.genre ?? ''}
                  onChange={(e) => set('genre', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </Field>
            </div>

            <Field label="Példányszám *">
              <input
                type="number"
                required
                min={1}
                value={form.totalCopies}
                onChange={(e) => set('totalCopies', Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </Field>

            <Field label="Borítókép URL">
              <input
                value={form.coverImageUrl ?? ''}
                onChange={(e) => set('coverImageUrl', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://..."
              />
            </Field>

            <Field label="Leírás">
              <textarea
                value={form.description ?? ''}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </Field>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {isPending ? 'Mentés…' : 'Mentés'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
