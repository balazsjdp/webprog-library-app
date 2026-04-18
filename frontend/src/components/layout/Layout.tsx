import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-onyx flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-graphite border-t border-graphite/60 text-center text-xs text-pearl-aqua/50 py-3">
        Könyvtár App © 2026
      </footer>
    </div>
  );
}
