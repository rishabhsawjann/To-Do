import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile } from '@/types';

interface ProfileState extends Profile {
  updateProfile: (updates: Partial<Profile>) => void;
  getProfile: () => Profile;
}

const defaultProfile: Profile = {
  name: '',
  avatar: ''
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...defaultProfile,
      
      updateProfile: (updates) => {
        set((state) => ({ ...state, ...updates }));
      },
      
      getProfile: () => {
        const state = get();
        return {
          name: state.name,
          avatar: state.avatar
        };
      }
    }),
    {
      name: 'profile-storage',
    }
  )
);
