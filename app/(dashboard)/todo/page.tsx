'use client';

import { useState } from 'react';
import { Plus, Filter, Search, Calendar, Clock, CheckCircle2, Circle, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Todo, TodoFilter } from '@/types';
import { useTodosStore } from '@/stores/todos';
import { useAuthStore } from '@/stores/auth';
import { formatDateTime, formatTime, getRelativeTime } from '@/lib/time';
import { TodoForm } from '@/components/TodoForm';

export default function TodoPage() {
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const { getFilteredTodos, addTodo, updateTodo, deleteTodo, toggleTodoComplete } = useTodosStore();
  const { user } = useAuthStore();

  const todos = getFilteredTodos(user?.uid || '', filter);
  const allTodos = useTodosStore.getState().getTodosByUser(user?.uid || '');
  
  // Filter todos based on search query
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get counts for different categories
  const upcomingTodos = allTodos.filter(todo => !todo.completed);
  const completedTodos = allTodos.filter(todo => todo.completed);
  const overdueTodos = allTodos.filter(todo => 
    !todo.completed && new Date(todo.scheduledAt) < new Date()
  );

  const handleCreateTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    if (user?.uid) {
      addTodo({
        ...todoData,
        userId: user.uid
      });
    }
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

  const getPriorityColor = (todo: Todo) => {
    const now = new Date();
    const scheduled = new Date(todo.scheduledAt);
    const diffHours = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'text-red-600 bg-red-100 border-red-200'; // Overdue
    if (diffHours < 4) return 'text-orange-600 bg-orange-100 border-orange-200'; // Urgent
    if (diffHours < 24) return 'text-yellow-600 bg-yellow-100 border-yellow-200'; // Soon
    return 'text-blue-600 bg-blue-100 border-blue-200'; // Later
  };

  const getPriorityLabel = (todo: Todo) => {
    const now = new Date();
    const scheduled = new Date(todo.scheduledAt);
    const diffHours = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'Overdue';
    if (diffHours < 4) return 'Urgent';
    if (diffHours < 24) return 'Soon';
    return 'Later';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">To-Do List</h1>
          <p className="text-sm text-gray-500">Manage and organize your tasks efficiently</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus size={16} className="mr-2" />
          Add Todo
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Tasks</p>
                <p className="text-2xl font-bold">{allTodos.length}</p>
              </div>
              <div className="p-2 bg-white/20 rounded-full">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingTodos.length}</p>
              </div>
              <div className="p-2 bg-white/20 rounded-full">
                <Clock size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Completed</p>
                <p className="text-2xl font-bold">{completedTodos.length}</p>
              </div>
              <div className="p-2 bg-white/20 rounded-full">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Overdue</p>
                <p className="text-2xl font-bold">{overdueTodos.length}</p>
              </div>
              <div className="p-2 bg-white/20 rounded-full">
                <Star size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No todos found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first todo'}
                </p>
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus size={16} className="mr-2" />
                Create Todo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredTodos.map((todo) => (
            <Card key={todo.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(todo.id)}
                    className="mt-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={20} className="text-green-600" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {todo.description}
                          </p>
                        )}
                        
                        {/* Priority and Time */}
                        <div className="flex items-center space-x-2 mt-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(todo)}`}
                          >
                            {getPriorityLabel(todo)}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>{formatDateTime(todo.scheduledAt)}</span>
                          </div>
                        </div>

                        {/* Relative Time */}
                        <p className="text-xs text-gray-400 mt-1">
                          {todo.completed 
                            ? `Completed ${getRelativeTime(todo.completedAt || '')}`
                            : getRelativeTime(todo.scheduledAt)
                          }
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => openEditForm(todo)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Todo Form Modal */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        todo={editingTodo}
        onSubmit={editingTodo ? handleEditTodo : handleCreateTodo}
      />
    </div>
  );
}
