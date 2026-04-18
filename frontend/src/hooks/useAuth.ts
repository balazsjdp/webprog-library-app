import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, roles, isAuthenticated, isLoading } = useAuthStore();
  return {
    user,
    roles,
    isAuthenticated,
    isLoading,
    isAdmin: roles.includes('admin'),
  };
}
