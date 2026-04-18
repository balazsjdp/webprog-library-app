import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import keycloak from '../../keycloak';

export default function Header() {
  const { isAuthenticated, user, roles } = useAuthStore();
  const isAdmin = roles.includes('admin');

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight hover:text-blue-100">
          📚 Könyvtár
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-white font-semibold underline' : 'text-blue-100 hover:text-white'
            }
            end
          >
            Könyvek
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-borrowings"
              className={({ isActive }) =>
                isActive ? 'text-white font-semibold underline' : 'text-blue-100 hover:text-white'
              }
            >
              Kölcsönzéseim
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? 'text-white font-semibold underline' : 'text-blue-100 hover:text-white'
              }
            >
              Admin
            </NavLink>
          )}

          <div className="ml-4 border-l border-blue-500 pl-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-blue-100 text-xs">{user?.preferredUsername}</span>
                <button
                  onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
                  className="bg-white text-blue-700 text-xs px-3 py-1 rounded hover:bg-blue-50 font-medium"
                >
                  Kijelentkezés
                </button>
              </div>
            ) : (
              <button
                onClick={() => keycloak.login()}
                className="bg-white text-blue-700 text-xs px-3 py-1 rounded hover:bg-blue-50 font-medium"
              >
                Bejelentkezés
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
