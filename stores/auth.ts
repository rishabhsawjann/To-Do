import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          let errorMessage = 'Failed to sign in';
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Try again later';
          }
          set({ error: errorMessage });
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        try {
          set({ loading: true, error: null });
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          // Update display name
          if (userCredential.user) {
            await updateProfile(userCredential.user, {
              displayName: name
            });
            
            // Also update the profile store with the new user's name
            const { useProfileStore } = await import('./profile');
            useProfileStore.getState().updateProfile({ name });
          }
        } catch (error: any) {
          let errorMessage = 'Failed to create account';
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists';
          } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
          }
          set({ error: errorMessage });
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          await signOut(auth);
        } catch (error: any) {
          set({ error: 'Failed to sign out' });
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ loading: true, error: null });
          await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
          let errorMessage = 'Failed to send reset email';
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email';
          }
          set({ error: errorMessage });
        } finally {
          set({ loading: false });
        }
      },

      setUser: (user: FirebaseUser | null) => set({ user }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);

// Initialize auth state listener
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);
  });
}
