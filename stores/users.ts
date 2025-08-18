import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { generateId } from '@/lib/utils';

interface UsersState {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  addUserWithId: (id: string, user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  toggleUserRole: (id: string) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  seedUsers: () => void;
}

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Fawaz Ahamed',
    email: 'fawaz@demo.com',
    avatar: '',
    role: 'normal',
    createdAt: '2023-08-16T18:00:00.000Z'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@demo.com',
    avatar: '',
    role: 'superuser',
    createdAt: '2023-08-16T18:00:00.000Z'
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@demo.com',
    avatar: '',
    role: 'normal',
    createdAt: '2023-08-16T18:00:00.000Z'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@demo.com',
    avatar: '',
    role: 'superuser',
    createdAt: '2023-08-16T18:00:00.000Z'
  }
];

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: defaultUsers,
      
      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: generateId(),
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          users: [...state.users, newUser]
        }));
      },
      
      addUserWithId: (id, userData) => {
        const newUser: User = {
          ...userData,
          id: id,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          users: [...state.users, newUser]
        }));
      },
      
      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === id ? { ...user, ...updates } : user
          )
        }));
      },
      
      toggleUserRole: (id) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === id
              ? { ...user, role: user.role === 'normal' ? 'superuser' : 'normal' }
              : user
          )
        }));
      },
      
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter(user => user.id !== id)
        }));
      },
      
      getUserById: (id) => {
        return get().users.find(user => user.id === id);
      },
      
      seedUsers: () => {
        const state = get();
        if (state.users.length === 0) {
          set({ users: defaultUsers });
        }
      }
    }),
    {
      name: 'users-storage',
    }
  )
);
