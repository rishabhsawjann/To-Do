'use client';

import { useState } from 'react';
import { TodoList } from '@/components/TodoList';
import { TodoFilter } from '@/types';
import { useAuthStore } from '@/stores/auth';

export default function DashboardPage() {
  const [filter, setFilter] = useState<TodoFilter>('all');
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Hello, {user?.displayName || 'User'}
        </h1>
      </div>

      {/* Todo List */}
      <TodoList filter={filter} onFilterChange={setFilter} />
    </div>
  );
}
