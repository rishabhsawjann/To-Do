'use client';

import { useState } from 'react';
import { TodoList } from '@/components/TodoList';
import { TodoFilter } from '@/types';
import { Button } from '@/components/ui/button';
import { useTodosStore } from '@/stores/todos';

export default function DashboardPage() {
  const [filter, setFilter] = useState<TodoFilter>('all');
  const { resetTodos } = useTodosStore();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hello, Fawaz</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetTodos}
          className="text-xs"
        >
          Reset Sample Data
        </Button>
      </div>

      {/* Todo List */}
      <TodoList filter={filter} onFilterChange={setFilter} />
    </div>
  );
}
