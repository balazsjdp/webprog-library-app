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
  active: 'bg-blue-50 text-blue-700',
  returned: 'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('hu-HU');
}

export default function BorrowingHistoryTable({ borrowings }: Props) {
  const returnMutation = useReturnMutation();

  if (borrowings.length === 0) {
    return <p className="text-center text-gray-400 py-10">Nincs kölcsönzési előzmény.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b text-gray-500 text-xs uppercase tracking-wide">
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
            <tr key={b.id} className="border-b hover:bg-gray-50">
              <td className="py-3 pr-4 font-medium text-gray-800">
                {b.book?.title ?? '—'}
                {b.book?.author && (
                  <div className="text-xs text-gray-400 font-normal">{b.book.author}</div>
                )}
              </td>
              <td className="py-3 pr-4 text-gray-600">{formatDate(b.borrowedAt)}</td>
              <td className="py-3 pr-4 text-gray-600">{formatDate(b.dueDate)}</td>
              <td className="py-3 pr-4 text-gray-600">
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
                    className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
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
