'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Users, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsersStore } from '@/stores/users';
import { useSessionStore } from '@/stores/session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInitials } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { users, getUserById } = useUsersStore();
  const { currentUserId, setCurrentUser } = useSessionStore();
  const currentUser = getUserById(currentUserId);

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      roles: ['normal', 'superuser']
    },
    {
      title: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      roles: ['normal', 'superuser']
    },
    {
      title: 'To do list',
      href: '/todo',
      icon: CheckSquare,
      roles: ['normal', 'superuser']
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: User,
      roles: ['normal', 'superuser']
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: Users,
      roles: ['superuser']
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    currentUser?.role === 'superuser' || item.roles.includes('normal')
  );

  return (
    <div className={cn(
      "flex flex-col bg-gray-800 text-white transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white">GREEDYGAME</h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className={cn(
              "w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
              isCollapsed && "hidden"
            )}
          />
        </div>
      </div>

      {/* User Switcher */}
      <div className="p-4 border-b border-gray-700">
        <Select value={currentUserId} onValueChange={setCurrentUser}>
          <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentUser?.avatar} />
                <AvatarFallback className="text-xs">
                  {getInitials(currentUser?.name || '')}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <SelectValue>
                  <span className="truncate">{currentUser?.name}</span>
                </SelectValue>
              )}
            </div>
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  {user.role === 'superuser' && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                      Super Admin
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                isActive 
                  ? "bg-green-600 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
