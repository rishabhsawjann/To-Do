import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from '@/types';

interface SessionState extends Session {
  setCurrentUser: (userId: string) => void;
  getCurrentUser: () => string;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      currentUserId: '1', // Default to Fawaz
      
      setCurrentUser: (userId) => {
        set({ currentUserId: userId });
      },
      
      getCurrentUser: () => {
        return get().currentUserId;
      }
    }),
    {
      name: 'session-storage',
    }
  )
);
