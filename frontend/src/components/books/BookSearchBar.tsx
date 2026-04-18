import { useEffect, useRef, useState } from 'react';

const GENRES = [
  'Fantasy',
  'Science Fiction',
  'Thriller',
  'Mystery',
  'Romance',
  'Horror',
  'Historical Fiction',
  'Biography',
  'Non-fiction',
  'Philosophy',
  'Psychology',
  'Classic',
];

interface Props {
  search: string;
  genre: string;
  available: boolean;
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onAvailableChange: (value: boolean) => void;
}

export default function BookSearchBar({
  search,
  genre,
  available,
  onSearchChange,
  onGenreChange,
  onAvailableChange,
}: Props) {
  const [localSearch, setLocalSearch] = useState(search);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchInput = (value: string) => {
    setLocalSearch(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearchChange(value), 400);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        value={localSearch}
        onChange={(e) => handleSearchInput(e.target.value)}
        placeholder="Keresés cím vagy szerző alapján…"
        className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        value={genre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      >
        <option value="">Minden műfaj</option>
        {GENRES.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap cursor-pointer">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => onAvailableChange(e.target.checked)}
          className="w-4 h-4 accent-blue-600"
        />
        Csak elérhető
      </label>
    </div>
  );
}
