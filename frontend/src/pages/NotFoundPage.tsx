import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl text-gray-600 mt-4">Az oldal nem található</p>
      <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">
        Vissza a főoldalra
      </Link>
    </div>
  );
}
