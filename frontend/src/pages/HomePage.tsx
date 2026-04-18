import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Könyvek</h1>
      <LoadingSpinner />
      <p className="text-center text-gray-400 mt-4">Könyvlista hamarosan…</p>
    </div>
  );
}
