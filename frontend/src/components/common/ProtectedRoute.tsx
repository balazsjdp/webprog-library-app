import { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';
import keycloak from '../../keycloak';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  children: ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, isLoading, roles } = useAuthStore();

  if (isLoading) return <LoadingSpinner className="py-20" />;

  if (!isAuthenticated) {
    keycloak.login();
    return null;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-400">Hozzáférés megtagadva</h2>
        <p className="text-pearl-aqua/60 mt-2">Nincs jogosultságod ennek az oldalnak a megtekintéséhez.</p>
      </div>
    );
  }

  return <>{children}</>;
}
