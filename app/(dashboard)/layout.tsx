'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { useUsersStore } from '@/stores/users';
import { useTodosStore } from '@/stores/todos';
import { useSessionStore } from '@/stores/session';
import { useProfileStore } from '@/stores/profile';
import { isWithinNextHours } from '@/lib/time';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const { seedUsers } = useUsersStore();
  const { seedTodos } = useTodosStore();
  const { currentUserId } = useSessionStore();
  const { getProfile } = useProfileStore();

  // Seed data on first load
  useEffect(() => {
    seedUsers();
    seedTodos();
  }, [seedUsers, seedTodos]);

  // Calculate notification count
  const getNotificationCount = () => {
    const todos = useTodosStore.getState().getTodosByUser(currentUserId);
    return todos.filter(todo => 
      !todo.completed && isWithinNextHours(todo.scheduledAt, 4)
    ).length;
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar 
          onNotificationClick={handleNotificationClick}
          notificationCount={getNotificationCount()}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
