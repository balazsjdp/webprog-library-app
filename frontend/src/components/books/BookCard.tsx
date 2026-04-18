import { Link } from 'react-router-dom';
import { Book } from '../../types/book.types';
import BookCoverImage from './BookCoverImage';

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="bg-graphite rounded-lg border border-graphite/60 hover:border-verdigris/50 transition-colors overflow-hidden flex flex-col"
    >
      <BookCoverImage
        coverImageUrl={book.coverImageUrl}
        title={book.title}
        className="w-full h-48"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-snow text-sm leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="text-pearl-aqua/60 text-xs mt-1">{book.author}</p>

        {book.genre && (
          <span className="mt-2 inline-block text-xs bg-verdigris/20 text-verdigris px-2 py-0.5 rounded-full w-fit">
            {book.genre}
          </span>
        )}

        <div className="mt-auto pt-3">
          <span
            className={`text-xs font-medium ${
              book.availableCopies > 0 ? 'text-verdigris' : 'text-red-400'
            }`}
          >
            {book.availableCopies > 0
              ? `${book.availableCopies} / ${book.totalCopies} elérhető`
              : 'Nem elérhető'}
          </span>
        </div>
      </div>
    </Link>
  );
}
