import { useState } from 'react';
import { useOLSearch, useImportFromOL } from '../../hooks/useAdmin';
import { OLSearchResult } from '../../types/book.types';
import BookCoverImage from '../books/BookCoverImage';
import LoadingSpinner from '../common/LoadingSpinner';

interface Props {
  onClose: () => void;
}

export default function OpenLibraryImportModal({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [importingId, setImportingId] = useState<string | null>(null);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const { data, isLoading } = useOLSearch(query);
  const importMutation = useImportFromOL();

  const handleImport = async (result: OLSearchResult) => {
    setImportingId(result.olWorkId);
    try {
      await importMutation.mutateAsync(result);
      setImported((prev) => new Set(prev).add(result.olWorkId));
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-graphite rounded-xl border border-graphite/60 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-graphite/60">
          <h2 className="text-lg font-bold text-snow mb-3">Open Library importálás</h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Keresés cím vagy szerző alapján…"
            className="w-full bg-onyx border border-graphite/60 text-snow placeholder:text-pearl-aqua/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verdigris"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && <LoadingSpinner />}

          {query.length > 2 && !isLoading && data?.length === 0 && (
            <p className="text-center text-pearl-aqua/50 py-8">Nincs találat.</p>
          )}

          {query.length <= 2 && (
            <p className="text-center text-pearl-aqua/50 py-8 text-sm">
              Írj be legalább 3 karaktert a kereséshez.
            </p>
          )}

          <div className="space-y-3">
            {data?.map((result) => (
              <OLResultRow
                key={result.olWorkId}
                result={result}
                isImporting={importingId === result.olWorkId}
                isImported={imported.has(result.olWorkId)}
                onImport={handleImport}
              />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-graphite/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-graphite/60 text-pearl-aqua/70 rounded-lg hover:bg-onyx transition-colors"
          >
            Bezárás
          </button>
        </div>
      </div>
    </div>
  );
}

interface RowProps {
  result: OLSearchResult;
  isImporting: boolean;
  isImported: boolean;
  onImport: (r: OLSearchResult) => void;
}

function OLResultRow({ result, isImporting, isImported, onImport }: RowProps) {
  return (
    <div className="flex gap-3 items-center border border-graphite/60 rounded-lg p-3 hover:border-verdigris/40 transition-colors">
      <div className="flex-shrink-0 w-12 h-16">
        <BookCoverImage
          coverImageUrl={result.coverUrl}
          title={result.title}
          className="w-12 h-16 rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-snow truncate">{result.title}</p>
        <p className="text-xs text-pearl-aqua/70">{result.author}</p>
        {result.isbn && <p className="text-xs text-pearl-aqua/50">ISBN: {result.isbn}</p>}
        {result.publishedYear && (
          <p className="text-xs text-pearl-aqua/50">{result.publishedYear}</p>
        )}
      </div>
      <button
        onClick={() => onImport(result)}
        disabled={isImporting || isImported}
        className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
          isImported
            ? 'bg-verdigris/20 text-verdigris cursor-default'
            : 'bg-verdigris text-snow hover:bg-pearl-aqua hover:text-onyx disabled:opacity-60 disabled:cursor-not-allowed'
        }`}
      >
        {isImported ? 'Importálva' : isImporting ? '…' : 'Importálás'}
      </button>
    </div>
  );
}
