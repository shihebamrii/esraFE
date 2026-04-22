import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  locale?: string;
  role: 'user' | 'admin';
  profilePictureFileId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setHasHydrated: (state: boolean) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setToken: (token) => set({ token }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      updateUser: (data) => set((state) => ({ 
        user: state.user ? { ...state.user, ...data } : null 
      })),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
