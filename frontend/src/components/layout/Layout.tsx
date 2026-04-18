import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-gray-100 border-t text-center text-xs text-gray-400 py-3">
        Könyvtár App © 2026
      </footer>
    </div>
  );
}
