import { useState } from 'react';
import { useMyBorrowings } from '../hooks/useBorrowings';
import { BorrowingStatus } from '../types/borrowing.types';
import BorrowingHistoryTable from '../components/borrowings/BorrowingHistoryTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const TABS: { label: string; value: BorrowingStatus | undefined }[] = [
  { label: 'Összes', value: undefined },
  { label: 'Aktív', value: 'active' },
  { label: 'Visszahozva', value: 'returned' },
  { label: 'Lejárt', value: 'overdue' },
];

export default function MyBorrowingsPage() {
  const [status, setStatus] = useState<BorrowingStatus | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyBorrowings({ status, page });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-snow mb-6">Kölcsönzéseim</h1>

      <div className="flex gap-1 mb-6 border-b border-graphite/40">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              status === tab.value
                ? 'border-verdigris text-verdigris'
                : 'border-transparent text-pearl-aqua/60 hover:text-snow'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner />}

      {isError && (
        <p className="text-center text-red-400 py-10">Hiba történt a kölcsönzések betöltésekor.</p>
      )}

      {data && (
        <>
          <BorrowingHistoryTable borrowings={data.data} />
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
