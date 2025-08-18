'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsersStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface TopbarProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

export function Topbar({ onNotificationClick, notificationCount }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { getUserById } = useUsersStore();
  const { user, signOut } = useAuthStore();
  const { getProfile } = useProfileStore();
  
  const currentUser = user;
  const profile = getProfile();

  const displayName = currentUser?.displayName || profile.name || '';
  const displayAvatar = profile.avatar || currentUser?.photoURL || undefined;

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      {/* Left side - can be used for breadcrumbs or other content */}
      <div></div>

      {/* Right side - notifications and profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={displayAvatar} />
              <AvatarFallback className="text-sm">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{displayName}</span>
            <ChevronDown size={16} className={cn(
              "transition-transform",
              isProfileOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Navigate to profile page
                    window.location.href = '/profile';
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
