import { Borrowing, BorrowingStatus } from '../../types/borrowing.types';
import { useReturnMutation } from '../../hooks/useBorrowings';

interface Props {
  borrowings: Borrowing[];
}

const STATUS_LABEL: Record<BorrowingStatus, string> = {
  active: 'Aktív',
  returned: 'Visszahozva',
  overdue: 'Lejárt',
};

const STATUS_CLASS: Record<BorrowingStatus, string> = {
  active: 'bg-verdigris/20 text-verdigris',
  returned: 'bg-pearl-aqua/20 text-pearl-aqua',
  overdue: 'bg-red-500/20 text-red-400',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('hu-HU');
}

export default function BorrowingHistoryTable({ borrowings }: Props) {
  const returnMutation = useReturnMutation();

  if (borrowings.length === 0) {
    return <p className="text-center text-pearl-aqua/50 py-10">Nincs kölcsönzési előzmény.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-graphite/60 text-pearl-aqua/50 text-xs uppercase tracking-wide">
            <th className="py-3 pr-4">Könyv</th>
            <th className="py-3 pr-4">Kölcsönzés</th>
            <th className="py-3 pr-4">Határidő</th>
            <th className="py-3 pr-4">Visszahozva</th>
            <th className="py-3 pr-4">Státusz</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {borrowings.map((b) => (
            <tr key={b.id} className="border-b border-graphite/40 hover:bg-graphite/50 transition-colors">
              <td className="py-3 pr-4 font-medium text-snow">
                {b.book?.title ?? '—'}
                {b.book?.author && (
                  <div className="text-xs text-pearl-aqua/50 font-normal">{b.book.author}</div>
                )}
              </td>
              <td className="py-3 pr-4 text-pearl-aqua/70">{formatDate(b.borrowedAt)}</td>
              <td className="py-3 pr-4 text-pearl-aqua/70">{formatDate(b.dueDate)}</td>
              <td className="py-3 pr-4 text-pearl-aqua/70">
                {b.returnedAt ? formatDate(b.returnedAt) : '—'}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[b.status]}`}
                >
                  {STATUS_LABEL[b.status]}
                </span>
              </td>
              <td className="py-3">
                {b.status !== 'returned' && (
                  <button
                    onClick={() => returnMutation.mutate(b.id)}
                    disabled={returnMutation.isPending}
                    className="text-xs px-3 py-1 rounded border border-graphite/60 text-pearl-aqua/70 hover:bg-graphite hover:text-snow transition-colors disabled:opacity-50"
                  >
                    Visszahozás
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
