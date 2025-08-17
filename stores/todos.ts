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
  getFilteredTodos: (userId: string, filterType?: TodoFilter) => Todo[];
  seedTodos: () => void;
  resetTodos: () => void;
}

const defaultTodos: Todo[] = [
  // Fawaz Ahamed (User 1) - Mix of completed and upcoming
  {
    id: '1',
    userId: '1',
    title: 'Submit project report',
    description: 'Finalize and submit the quarterly project report to the manager by 3:00 PM.',
    scheduledAt: '2024-12-20T15:00:00.000Z',
    completed: true,
    completedAt: '2024-12-20T14:30:00.000Z',
    createdAt: '2024-12-20T09:00:00.000Z'
  },
  {
    id: '2',
    userId: '1',
    title: 'Team stand-up meeting',
    description: 'Attend the daily stand-up meeting with the product team on Zoom',
    scheduledAt: '2024-12-20T10:00:00.000Z',
    completed: true,
    completedAt: '2024-12-20T10:30:00.000Z',
    createdAt: '2024-12-20T08:00:00.000Z'
  },
  {
    id: '3',
    userId: '1',
    title: 'Client follow-up email',
    description: 'Draft and send the follow-up email to the client regarding the new contract terms.',
    scheduledAt: '2024-12-21T16:00:00.000Z',
    completed: false,
    createdAt: '2024-12-20T09:00:00.000Z'
  },
  {
    id: '4',
    userId: '1',
    title: 'Review pull requests',
    description: 'Check and review the pending pull requests on GitHub before EOD.',
    scheduledAt: '2024-12-21T17:00:00.000Z',
    completed: false,
    createdAt: '2024-12-20T09:00:00.000Z'
  },
  {
    id: '5',
    userId: '1',
    title: 'Buy groceries',
    description: 'Pick up essentials like vegetables, milk, and bread from the nearby supermarket',
    scheduledAt: '2024-12-21T18:00:00.000Z',
    completed: false,
    createdAt: '2024-12-20T09:00:00.000Z'
  },
  {
    id: '6',
    userId: '1',
    title: 'Workout session',
    description: 'Attend the 1-hour virtual HIIT workout class scheduled',
    scheduledAt: '2024-12-20T19:00:00.000Z',
    completed: true,
    completedAt: '2024-12-20T20:00:00.000Z',
    createdAt: '2024-12-20T09:00:00.000Z'
  },

  // John Doe (User 2) - More upcoming than completed
  {
    id: '7',
    userId: '2',
    title: 'Code review meeting',
    description: 'Participate in the weekly code review session with the development team',
    scheduledAt: '2024-12-20T11:00:00.000Z',
    completed: true,
    completedAt: '2024-12-20T12:00:00.000Z',
    createdAt: '2024-12-20T08:00:00.000Z'
  },
  {
    id: '8',
    userId: '2',
    title: 'Database optimization',
    description: 'Work on optimizing the database queries for better performance',
    scheduledAt: '2024-12-21T14:00:00.000Z',
    completed: false,
    createdAt: '2024-12-20T08:00:00.000Z'
  },
  {
    id: '9',
    userId: '2',
    title: 'API documentation update',
    description: 'Update the API documentation with the latest endpoint changes',
    scheduledAt: '2024-12-21T15:30:00.000Z',
    completed: false,
    createdAt: '2024-12-20T08:00:00.000Z'
  },
  {
    id: '10',
    userId: '2',
    title: 'Unit tests writing',
    description: 'Write comprehensive unit tests for the new authentication module',
    scheduledAt: '2024-12-21T16:30:00.000Z',
    completed: false,
    createdAt: '2024-12-20T08:00:00.000Z'
  },
  {
    id: '11',
    userId: '2',
    title: 'Team lunch',
    description: 'Have lunch with the development team to discuss project updates',
    scheduledAt: '2024-12-20T12:30:00.000Z',
    completed: true,
    completedAt: '2024-12-20T13:30:00.000Z',
    createdAt: '2024-12-20T08:00:00.000Z'
  },

  // Jane Smith (User 3) - Superuser with balanced todos
  {
    id: '12',
    userId: '3',
    title: 'Product roadmap review',
    description: 'Review and update the product roadmap for Q4 2024',
    scheduledAt: '2024-12-20T09:00:00.000Z',
    completed: true,
    completedAt: '2024-12-20T10:00:00.000Z',
    createdAt: '2024-12-20T07:00:00.000Z'
  },
  {
    id: '13',
    userId: '3',
    title: 'Stakeholder meeting',
    description: 'Present quarterly results to key stakeholders and investors',
    scheduledAt: '2024-12-21T13:00:00.000Z',
    completed: false,
    createdAt: '2024-12-20T07:00:00.000Z'
  },
  {
    id: '14',
    userId: '3',
    title: 'Budget planning',
    description: 'Work on the annual budget planning for the product team',
    scheduledAt: '2024-12-21T14:30:00.000Z',
    completed: false,
    createdAt: '2024-12-20T07:00:00.000Z'
  },
  {
    id: '15',
    userId: '3',
    title: 'Team performance review',
    description: 'Conduct one-on-one performance reviews with team members',
    scheduledAt: '2024-12-20T16:00:00.000Z',
    completed: true,
    completedAt: '2024-12-20T17:00:00.000Z',
    createdAt: '2024-12-20T07:00:00.000Z'
  },
  {
    id: '16',
    userId: '3',
    title: 'Market research analysis',
    description: 'Analyze competitor data and market trends for strategic planning',
    scheduledAt: '2024-12-21T17:30:00.000Z',
    completed: false,
    createdAt: '2024-12-20T07:00:00.000Z'
  },

  // Bob Johnson (User 4) - Mostly completed tasks
  {
    id: '17',
    userId: '4',
    title: 'Morning standup',
    description: 'Attend the daily morning standup meeting with the QA team',
    scheduledAt: '2024-12-20T09:30:00.000Z',
    completed: true,
    completedAt: '2024-12-20T10:00:00.000Z',
    createdAt: '2024-12-20T08:30:00.000Z'
  },
  {
    id: '18',
    userId: '4',
    title: 'Test case execution',
    description: 'Execute regression test cases for the latest release',
    scheduledAt: '2024-12-20T11:00:00.000Z',
    completed: true,
    completedAt: '2024-12-20T13:00:00.000Z',
    createdAt: '2024-12-20T08:30:00.000Z'
  },
  {
    id: '19',
    userId: '4',
    title: 'Bug report documentation',
    description: 'Document and file bug reports for the issues found during testing',
    scheduledAt: '2024-12-20T13:30:00.000Z',
    completed: true,
    completedAt: '2024-12-20T14:30:00.000Z',
    createdAt: '2024-12-20T08:30:00.000Z'
  },
  {
    id: '20',
    userId: '4',
    title: 'Automation script update',
    description: 'Update the automated test scripts with the latest test scenarios',
    scheduledAt: '2024-12-21T15:00:00.000Z',
    completed: false,
    createdAt: '2024-12-20T08:30:00.000Z'
  },
  {
    id: '21',
    userId: '4',
    title: 'Test environment setup',
    description: 'Set up the new test environment for the upcoming release testing',
    scheduledAt: '2024-12-21T16:30:00.000Z',
    completed: false,
    createdAt: '2024-12-20T08:30:00.000Z'
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
      
      getFilteredTodos: (userId, filterType?: TodoFilter) => {
        const { todos } = get();
        const userTodos = todos.filter(todo => todo.userId === userId);
        const activeFilter = filterType || get().filter;
        
        switch (activeFilter) {
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
      },
      
      resetTodos: () => {
        set({ todos: defaultTodos });
      }
    }),
    {
      name: 'todos-storage',
    }
  )
);
