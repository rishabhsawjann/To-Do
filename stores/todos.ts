import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, TodoFilter } from '@/types';
import { generateId } from '@/lib/utils';

interface TodosState {
  todos: Todo[];
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoComplete: (id: string) => void;
  getTodosByUser: (userId: string) => Todo[];
  getFilteredTodos: (userId: string) => Todo[];
  seedTodos: () => void;
}

const defaultTodos: Todo[] = [
  {
    id: '1',
    userId: '1',
    title: 'Submit project report',
    description: 'Finalize and submit the quarterly project report to the manager by 3:00 PM.',
    scheduledAt: '2023-08-16T18:00:00.000Z',
    completed: true,
    completedAt: '2023-08-16T17:30:00.000Z',
    createdAt: '2023-08-16T10:00:00.000Z'
  },
  {
    id: '2',
    userId: '1',
    title: 'Team stand-up meeting',
    description: 'Attend the daily stand-up meeting with the product team on Zoom',
    scheduledAt: '2023-08-16T18:00:00.000Z',
    completed: false,
    createdAt: '2023-08-16T10:00:00.000Z'
  },
  {
    id: '3',
    userId: '1',
    title: 'Client follow-up email',
    description: 'Draft and send the follow-up email to the client regarding the new contract terms.',
    scheduledAt: '2023-08-16T18:00:00.000Z',
    completed: false,
    createdAt: '2023-08-16T10:00:00.000Z'
  },
  {
    id: '4',
    userId: '1',
    title: 'Review pull requests',
    description: 'Check and review the pending pull requests on GitHub before EOD.',
    scheduledAt: '2023-08-16T18:00:00.000Z',
    completed: true,
    completedAt: '2023-08-16T16:00:00.000Z',
    createdAt: '2023-08-16T10:00:00.000Z'
  },
  {
    id: '5',
    userId: '1',
    title: 'Buy groceries',
    description: 'Pick up essentials like vegetables, milk, and bread from the nearby supermarket',
    scheduledAt: '2023-08-16T18:00:00.000Z',
    completed: false,
    createdAt: '2023-08-16T10:00:00.000Z'
  },
  {
    id: '6',
    userId: '1',
    title: 'Workout session',
    description: 'Attend the 1-hour virtual HIIT workout class scheduled',
    scheduledAt: '2023-08-16T18:00:00.000Z',
    completed: true,
    completedAt: '2023-08-16T15:00:00.000Z',
    createdAt: '2023-08-16T10:00:00.000Z'
  }
];

export const useTodosStore = create<TodosState>()(
  persist(
    (set, get) => ({
      todos: defaultTodos,
      filter: 'all',
      
      setFilter: (filter) => {
        set({ filter });
      },
      
      addTodo: (todoData) => {
        const newTodo: Todo = {
          ...todoData,
          id: generateId(),
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          todos: [...state.todos, newTodo]
        }));
      },
      
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, ...updates } : todo
          )
        }));
      },
      
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter(todo => todo.id !== id)
        }));
      },
      
      toggleTodoComplete: (id) => {
        set((state) => ({
          todos: state.todos.map(todo =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  completedAt: !todo.completed ? new Date().toISOString() : undefined
                }
              : todo
          )
        }));
      },
      
      getTodosByUser: (userId) => {
        return get().todos.filter(todo => todo.userId === userId);
      },
      
      getFilteredTodos: (userId) => {
        const { todos, filter } = get();
        const userTodos = todos.filter(todo => todo.userId === userId);
        
        switch (filter) {
          case 'upcoming':
            return userTodos
              .filter(todo => !todo.completed)
              .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
          case 'completed':
            return userTodos
              .filter(todo => todo.completed)
              .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime());
          default:
            return userTodos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      },
      
      seedTodos: () => {
        const state = get();
        if (state.todos.length === 0) {
          set({ todos: defaultTodos });
        }
      }
    }),
    {
      name: 'todos-storage',
    }
  )
);
