'use client';

import { useState } from 'react';
import { Edit, Trash2, CheckCircle, Circle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Todo, TodoFilter } from '@/types';
import { useTodosStore } from '@/stores/todos';
import { useSessionStore } from '@/stores/session';
import { formatDateTime } from '@/lib/time';
import { TodoForm } from './TodoForm';

interface TodoListProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

export function TodoList({ filter, onFilterChange }: TodoListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { getFilteredTodos, addTodo, updateTodo, deleteTodo, toggleTodoComplete } = useTodosStore();
  const { currentUserId } = useSessionStore();

  const todos = getFilteredTodos(currentUserId, filter);
  const allTodos = useTodosStore.getState().getTodosByUser(currentUserId);
  const upcomingTodos = allTodos.filter(todo => !todo.completed);
  const completedTodos = allTodos.filter(todo => todo.completed);

  const handleCreateTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    addTodo({
      ...todoData,
      userId: currentUserId
    });
  };

  const handleEditTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
    }
  };

  const handleDeleteTodo = (todoId: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todoId);
    }
  };

  const handleToggleComplete = (todoId: string) => {
    toggleTodoComplete(todoId);
  };

  const openEditForm = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const getStatusBadge = (todo: Todo) => {
    if (todo.completed) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Upcoming</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Todos</h1>
          <p className="text-sm text-gray-500">
            Last Updated: {new Date().toLocaleString('en-GB')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={16} />
              <span>Filter</span>
            </Button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onFilterChange('all');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      filter === 'all' ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      onFilterChange('upcoming');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      filter === 'upcoming' ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => {
                      onFilterChange('completed');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      filter === 'completed' ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    Completed
                    </button>
                </div>
              </div>
            )}
          </div>

          <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
            + Add Todo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Todos</h3>
          <p className="text-3xl font-bold text-gray-900">{allTodos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming</h3>
          <p className="text-3xl font-bold text-yellow-600">{upcomingTodos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completedTodos.length}</p>
        </div>
      </div>

      {/* Todo List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-6">Todo</div>
            <div className="col-span-3">Due Date ↑↓</div>
            <div className="col-span-2">Status ↑↓</div>
            <div className="col-span-1">Actions</div>
          </div>
        </div>

        {todos.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 mb-4">No todos found</p>
            <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
              Create your first todo
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {todos.map((todo) => (
              <div key={todo.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleComplete(todo.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {todo.completed ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                      <div>
                        <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {todo.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <span className="text-sm text-gray-900">{formatDateTime(todo.scheduledAt)}</span>
                  </div>
                  
                  <div className="col-span-2">
                    {getStatusBadge(todo)}
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditForm(todo)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Todo Form */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        todo={editingTodo}
        onSubmit={editingTodo ? handleEditTodo : handleCreateTodo}
      />
    </div>
  );
}
