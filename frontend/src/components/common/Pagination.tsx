interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (currentPage <= 4) return i + 1;
    if (currentPage >= totalPages - 3) return totalPages - 6 + i;
    return currentPage - 3 + i;
  });

  const base = 'px-3 py-1 rounded border text-sm transition-colors';

  return (
    <div className="flex justify-center items-center gap-1 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${base} border-graphite/60 text-pearl-aqua/70 hover:bg-graphite hover:text-snow disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`${base} ${
            p === currentPage
              ? 'bg-verdigris text-snow border-verdigris'
              : 'border-graphite/60 text-pearl-aqua/70 hover:bg-graphite hover:text-snow'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${base} border-graphite/60 text-pearl-aqua/70 hover:bg-graphite hover:text-snow disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ›
      </button>
    </div>
  );
}
