import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Profile {
  id: string;
  username: string;
}

interface AuthState {
  profile: Profile | null;
  isLoading: boolean;
  signIn: (username: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      
      signIn: (username: string) => {
        set({
          profile: {
            id: crypto.randomUUID(),
            username
          }
        });
      },
      
      signOut: () => {
        set({ profile: null });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);