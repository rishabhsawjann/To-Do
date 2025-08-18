'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { useUsersStore } from '@/stores/users';
import { useTodosStore } from '@/stores/todos';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { isWithinNextHours } from '@/lib/time';
import { generateId } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();
  
  const { seedUsers, addUserWithId, users } = useUsersStore();
  const { seedTodos, createSampleTodosForUser } = useTodosStore();
  const { user } = useAuthStore();
  const { getProfile } = useProfileStore();

  // Check authentication
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Seed data on first load and create sample data for new Firebase users
  useEffect(() => {
    if (user) {
      seedUsers();
      seedTodos();
      
      // Check if this Firebase user exists in our users store
      const existingUser = users.find(u => u.email === user.email);
      
      if (!existingUser && user.email) {
        // This is a new Firebase user, create sample data
        const firebaseUserId = user.uid; // Use Firebase UID directly
        
        // Add user to users store with Firebase UID
        addUserWithId(firebaseUserId, {
          name: user.displayName || 'New User',
          email: user.email,
          avatar: user.photoURL || '',
          role: 'normal'
        });
      }
      
      // Always create sample todos for any user to ensure app functionality
      const firebaseUserId = user.uid;
      createSampleTodosForUser(firebaseUserId);
    }
  }, [seedUsers, seedTodos, user, users, addUserWithId, createSampleTodosForUser]);

  // Show loading or redirect if not authenticated
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Calculate notification count
  const getNotificationCount = () => {
    const todos = useTodosStore.getState().getTodosByUser(user.uid);
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
