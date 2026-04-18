import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import keycloak from '../../keycloak';

export default function Header() {
  const { isAuthenticated, user, roles } = useAuthStore();
  const isAdmin = roles.includes('admin');

  return (
    <header className="bg-graphite border-b border-graphite/60 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-snow hover:text-pearl-aqua transition-colors">
          📚 Könyvtár
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-verdigris font-semibold'
                : 'text-pearl-aqua/70 hover:text-snow transition-colors'
            }
            end
          >
            Könyvek
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-borrowings"
              className={({ isActive }) =>
                isActive
                  ? 'text-verdigris font-semibold'
                  : 'text-pearl-aqua/70 hover:text-snow transition-colors'
              }
            >
              Kölcsönzéseim
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive
                  ? 'text-verdigris font-semibold'
                  : 'text-pearl-aqua/70 hover:text-snow transition-colors'
              }
            >
              Admin
            </NavLink>
          )}

          <div className="ml-4 border-l border-graphite/60 pl-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-pearl-aqua/70 text-xs">{user?.preferredUsername}</span>
                <button
                  onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
                  className="bg-verdigris text-snow text-xs px-3 py-1 rounded hover:bg-pearl-aqua hover:text-onyx font-medium transition-colors"
                >
                  Kijelentkezés
                </button>
              </div>
            ) : (
              <button
                onClick={() => keycloak.login()}
                className="bg-verdigris text-snow text-xs px-3 py-1 rounded hover:bg-pearl-aqua hover:text-onyx font-medium transition-colors"
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
