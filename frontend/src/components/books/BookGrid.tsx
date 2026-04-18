import { Book } from '../../types/book.types';
import BookCard from './BookCard';

interface Props {
  books: Book[];
}

export default function BookGrid({ books }: Props) {
  if (books.length === 0) {
    return (
      <div className="text-center py-16 text-pearl-aqua/50">
        <p className="text-lg">Nem találtunk könyvet.</p>
        <p className="text-sm mt-1">Próbálj más keresési feltételeket.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
