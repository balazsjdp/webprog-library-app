import { create } from 'zustand';

interface AuthUser {
  sub: string;
  preferredUsername: string;
  email?: string;
}

interface AuthState {
  user: AuthUser | null;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser, roles: string[]) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  roles: [],
  isAuthenticated: false,
  isLoading: true,
  setUser: (user, roles) => set({ user, roles, isAuthenticated: true, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, roles: [], isAuthenticated: false, isLoading: false }),
}));
