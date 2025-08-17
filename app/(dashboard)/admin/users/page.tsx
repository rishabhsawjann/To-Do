'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserTable } from '@/components/UserTable';
import { useUsersStore } from '@/stores/users';
import { useSessionStore } from '@/stores/session';

export default function AdminUsersPage() {
  const router = useRouter();
  const { getUserById } = useUsersStore();
  const { currentUserId } = useSessionStore();
  const currentUser = getUserById(currentUserId);

  // Check if user has access to this page
  useEffect(() => {
    if (currentUser && currentUser.role !== 'superuser') {
      router.push('/');
    }
  }, [currentUser, router]);

  // Show loading or redirect if not authorized
  if (!currentUser || currentUser.role !== 'superuser') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return <UserTable />;
}
